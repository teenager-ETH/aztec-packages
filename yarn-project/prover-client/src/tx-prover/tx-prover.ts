import {
  type EpochProver,
  type EpochProverManager,
  type MerkleTreeWriteOperations,
  type ProverCache,
  type ProvingJobConsumer,
  type ProvingJobProducer,
} from '@aztec/circuit-types/interfaces';
import { Fr } from '@aztec/circuits.js';
import { times } from '@aztec/foundation/collection';
import { createDebugLogger } from '@aztec/foundation/log';
import { type TelemetryClient } from '@aztec/telemetry-client';

import { AztecLmdbStore } from '../../../kv-store/src/lmdb/store.js';
import { type ProverClientConfig } from '../config.js';
import { ProvingOrchestrator } from '../orchestrator/orchestrator.js';
import { InMemoryProverCache } from '../orchestrator/orchestrator_cache.js';
import { InlineProofStore } from '../proving_broker/proof_store.js';
import { ProvingAgent } from '../proving_broker/proving_agent.js';
import { ProvingBroker } from '../proving_broker/proving_broker.js';
import { InMemoryBrokerDatabase } from '../proving_broker/proving_broker_database/memory.js';
import { KVBrokerDatabase } from '../proving_broker/proving_broker_database/persisted.js';
import { createProvingJobConsumer, createProvingJobProducer } from '../proving_broker/rpc.js';

/**
 * A prover factory.
 * TODO(palla/prover-node): Rename this class
 */
export class TxProver implements EpochProverManager {
  private running = false;
  private agents: ProvingAgent[] = [];
  private proofStore = new InlineProofStore();

  private constructor(
    private config: ProverClientConfig,
    private broker: ProvingJobProducer,
    private jobSource: ProvingJobConsumer,
    private telemetry: TelemetryClient,
    private log = createDebugLogger('aztec:prover-client:tx-prover'),
  ) {
    // TODO(palla/prover-node): Cache the paddingTx here, and not in each proving orchestrator,
    // so it can be reused across multiple ones and not recomputed every time.
  }

  public createEpochProver(db: MerkleTreeWriteOperations, cache: ProverCache = new InMemoryProverCache()): EpochProver {
    return new ProvingOrchestrator(db, this.broker, this.telemetry, this.config.proverId, cache, this.proofStore);
  }

  public getProverId(): Fr {
    return this.config.proverId ?? Fr.ZERO;
  }

  /**
   * Starts the prover instance
   */
  public start() {
    if (this.running) {
      return Promise.resolve();
    }

    this.running = true;
    this.agents = times(
      this.config.proverAgentCount,
      () =>
        new ProvingAgent(this.jobSource, this.proofStore, {} as any, undefined, this.config.proverAgentPollIntervalMs),
    );
    return Promise.resolve();
  }

  /**
   * Stops the prover instance
   */
  public async stop(): Promise<void> {
    if (!this.running) {
      return;
    }
    this.running = false;
    await Promise.all(this.agents.map(agent => agent.stop()));

    if (this.broker instanceof ProvingBroker) {
      await this.broker.stop();
    }

    // TODO(palla/prover-node): Keep a reference to all proving orchestrators that are alive and stop them?
  }

  /**
   * Creates a new prover client and starts it
   * @param config - The prover configuration.
   * @param telemetry - The telemetry client.
   * @returns An instance of the prover, constructed and started.
   */
  public static async new(config: ProverClientConfig, telemetry: TelemetryClient) {
    let producer: ProvingJobProducer;
    let consumer: ProvingJobConsumer;

    if (config.proverBrokerUrl) {
      producer = createProvingJobProducer(config.proverBrokerUrl);
      consumer = createProvingJobConsumer(config.proverBrokerUrl) as any;
    } else {
      const db = config.proverBrokerDataDirectory
        ? new KVBrokerDatabase(AztecLmdbStore.open(config.proverBrokerDataDirectory))
        : new InMemoryBrokerDatabase();

      const broker = new ProvingBroker(db, {
        jobTimeoutSec: config.proverBrokerJobTimeoutMs / 1000,
        timeoutIntervalSec: config.proverBrokerPollIntervalMs / 1000,
        maxRetries: config.proverBrokerJobMaxRetries,
      });
      producer = broker;
      consumer = broker;

      await broker.start();
    }

    const prover = new TxProver(config, producer, consumer, telemetry);
    await prover.start();
    return prover;
  }
}
