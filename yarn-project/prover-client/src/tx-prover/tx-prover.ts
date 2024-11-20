import { BBNativeRollupProver, TestCircuitProver } from '@aztec/bb-prover';
import {
  type EpochProver,
  type EpochProverManager,
  type MerkleTreeWriteOperations,
  type ProvingJobSource,
  type ServerCircuitProver,
} from '@aztec/circuit-types/interfaces';
import { Fr } from '@aztec/circuits.js';
import { createDebugLogger } from '@aztec/foundation/log';
import { AztecLmdbStore } from '@aztec/kv-store/lmdb';
import { NativeACVMSimulator } from '@aztec/simulator';
import { type TelemetryClient } from '@aztec/telemetry-client';

import { type Dirent } from 'fs';
import { mkdir, readFile, readdir, rm } from 'fs/promises';
import { join } from 'path';

import { type ProverClientConfig } from '../config.js';
import { ProvingOrchestrator } from '../orchestrator/orchestrator.js';
import {
  InMemoryOrchestratorCache,
  type OrchestratorCache,
  PersistentOrchestratorCache,
} from '../orchestrator/orchestrator_cache.js';
import { MemoryProvingQueue } from '../prover-agent/memory-proving-queue.js';
import { ProverAgent } from '../prover-agent/prover-agent.js';

const EPOCH_DIR_PREFIX = 'epoch';
const EPOCH_DIR_SEPARATOR = '_';
const EPOCH_HASH_FILENAME = 'epoch_hash.txt';

/**
 * A prover factory.
 * TODO(palla/prover-node): Rename this class
 */
export class TxProver implements EpochProverManager {
  private queue: MemoryProvingQueue;
  private running = false;

  private cacheDir?: string;

  private constructor(
    private config: ProverClientConfig,
    private telemetry: TelemetryClient,
    private agent?: ProverAgent,
    private log = createDebugLogger('aztec:prover-client:tx-prover'),
  ) {
    // TODO(palla/prover-node): Cache the paddingTx here, and not in each proving orchestrator,
    // so it can be reused across multiple ones and not recomputed every time.
    this.queue = new MemoryProvingQueue(telemetry, config.proverJobTimeoutMs, config.proverJobPollIntervalMs);
    this.cacheDir = this.config.cacheDir ? join(this.config.cacheDir, `tx_prover_${this.config.proverId}`) : undefined;
  }

  public async createEpochProver(db: MerkleTreeWriteOperations, epochNumber: bigint): Promise<EpochProver> {
    const cache = await this.createIntermediateProofDatabase(epochNumber, Buffer.from(epochNumber.toString()));
    return new ProvingOrchestrator(db, this.queue, this.telemetry, this.config.proverId, cache);
  }

  public getProverId(): Fr {
    return this.config.proverId ?? Fr.ZERO;
  }

  async updateProverConfig(config: Partial<ProverClientConfig>): Promise<void> {
    const newConfig = { ...this.config, ...config };

    if (newConfig.realProofs !== this.config.realProofs && this.agent) {
      const circuitProver = await TxProver.buildCircuitProver(newConfig, this.telemetry);
      this.agent.setCircuitProver(circuitProver);
    }

    if (this.config.proverAgentConcurrency !== newConfig.proverAgentConcurrency) {
      await this.agent?.setMaxConcurrency(newConfig.proverAgentConcurrency);
    }

    if (!this.config.realProofs && newConfig.realProofs) {
      // TODO(palla/prover-node): Reset padding tx here once we cache it at this class
    }

    this.config = newConfig;
  }

  /**
   * Starts the prover instance
   */
  public start() {
    if (this.running) {
      return Promise.resolve();
    }

    this.running = true;
    this.queue.start();
    this.agent?.start(this.queue);
    return Promise.resolve();
  }

  /**
   * Stops the prover instance
   */
  public async stop() {
    if (!this.running) {
      return;
    }
    this.running = false;

    // TODO(palla/prover-node): Keep a reference to all proving orchestrators that are alive and stop them?
    await this.agent?.stop();
    await this.queue.stop();
  }

  /**
   * Creates a new prover client and starts it
   * @param config - The prover configuration.
   * @param vks - The verification keys for the prover
   * @param worldStateSynchronizer - An instance of the world state
   * @returns An instance of the prover, constructed and started.
   */
  public static async new(config: ProverClientConfig, telemetry: TelemetryClient) {
    const agent = config.proverAgentEnabled
      ? new ProverAgent(
          await TxProver.buildCircuitProver(config, telemetry),
          config.proverAgentConcurrency,
          config.proverAgentPollInterval,
        )
      : undefined;

    const prover = new TxProver(config, telemetry, agent);
    await prover.start();
    return prover;
  }

  private static async buildCircuitProver(
    config: ProverClientConfig,
    telemetry: TelemetryClient,
  ): Promise<ServerCircuitProver> {
    if (config.realProofs) {
      return await BBNativeRollupProver.new(config, telemetry);
    }

    const simulationProvider = config.acvmBinaryPath
      ? new NativeACVMSimulator(config.acvmWorkingDirectory, config.acvmBinaryPath)
      : undefined;

    return new TestCircuitProver(telemetry, simulationProvider, config);
  }

  public getProvingJobSource(): ProvingJobSource {
    return this.queue;
  }

  /**
   * Opens a new database for the orchestrator to store intermediate proofs
   * @param epochNumber - The epoch number to open a database for
   * @param epochHash - The hash of the whole epoch
   * @returns A database to store intermediate proofs
   */
  private async createIntermediateProofDatabase(epochNumber: bigint, epochHash: Buffer): Promise<OrchestratorCache> {
    if (!this.cacheDir) {
      return new InMemoryOrchestratorCache();
    }

    const epochDir = EPOCH_DIR_PREFIX + EPOCH_DIR_SEPARATOR + epochNumber;
    const dataDir = join(this.cacheDir, epochDir);

    const storedEpochHash = await readFile(join(dataDir, EPOCH_HASH_FILENAME), 'utf8').catch(() => Buffer.alloc(0));
    if (storedEpochHash.toString() !== epochHash.toString()) {
      await rm(dataDir, { recursive: true, force: true });
    }

    await mkdir(dataDir, { recursive: true });
    const store = AztecLmdbStore.open(dataDir);

    this.log.debug(`Created new database for epoch ${epochNumber} at ${dataDir}`);

    return new PersistentOrchestratorCache(store);
  }

  private async removeUnusedOrchestratorDatabases(currentEpochNumber: bigint): Promise<void> {
    if (!this.cacheDir) {
      return;
    }

    const entries: Dirent[] = await readdir(this.cacheDir, { withFileTypes: true }).catch(() => []);

    for (const item of entries) {
      if (!item.isDirectory()) {
        continue;
      }

      const [prefix, epochNumber] = item.name.split(EPOCH_DIR_SEPARATOR);
      if (prefix !== EPOCH_DIR_PREFIX) {
        continue;
      }

      const epochNumberInt = BigInt(epochNumber);
      if (epochNumberInt < currentEpochNumber) {
        this.log.info(`Removing old epoch database for epoch ${epochNumberInt} at ${join(this.cacheDir, item.name)}`);
        await rm(join(this.cacheDir, item.name), { recursive: true });
      }
    }
  }
}
