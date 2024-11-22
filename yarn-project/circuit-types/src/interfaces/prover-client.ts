import { Fr } from '@aztec/circuits.js';
import { type ConfigMappingsType, booleanConfigHelper, numberConfigHelper } from '@aztec/foundation/config';
import { schemas } from '@aztec/foundation/schemas';

import { z } from 'zod';

import { type TxHash } from '../tx/tx_hash.js';
import { type EpochProver } from './epoch-prover.js';
import { type MerkleTreeReadOperations } from './merkle_tree_operations.js';
import { type ProvingJobStatus, ProvingRequestType } from './proving-job.js';

export const ProverAgentConfig = z.object({
  /** The number of prover agents to start */
  proverAgentCount: z.number(),
  /** The types of proofs the prover agent can generate */
  proverAgentProofTypes: z.array(z.string()),
  /** How often the prover agents poll for jobs */
  proverAgentPollIntervalMs: z.number(),
  /** Whether to fake proving */
  proverAgentFakeProofs: z.boolean().optional(),
  /** Whether fake proving takes a "real" amount of time */
  proverAgentFakeProofDelay: z.boolean().optional(),
});

export type ProverAgentConfig = z.infer<typeof ProverAgentConfig>;

export const proverAgentConfigMappings: ConfigMappingsType<ProverAgentConfig> = {
  proverAgentCount: {
    env: 'PROVER_AGENT_COUNT',
    description: 'Whether this prover has a local prover agent',
    ...numberConfigHelper(1),
  },
  proverAgentPollIntervalMs: {
    env: 'PROVER_AGENT_POLL_INTERVAL_MS',
    description: 'The interval agents poll for jobs at',
    ...numberConfigHelper(100),
  },
  proverAgentProofTypes: {
    env: 'PROVER_AGENT_PROOF_TYPES',
    description: 'The types of proofs the prover agent can generate',
    parseEnv: (val: string) =>
      val
        .split(',')
        .map(v => ProvingRequestType[v as any])
        .filter(Boolean),
  },
  proverAgentFakeProofDelay: {
    env: 'PROVER_AGENT_FAKE_PROOF_DELAY',
    description: 'Whether fake proving takes a "real" amount of time',
    ...booleanConfigHelper(true),
  },

  proverAgentFakeProofs: {
    env: 'PROVER_AGENT_FAKE_PROOFS',
    description: 'Whether to fake proving',
    ...booleanConfigHelper(false),
  },
};

export const ProverBrokerConfig = z.object({
  /** If starting a prover broker locally, the max number of retries per proving job */
  proverBrokerJobMaxRetries: z.number(),
  /** If starting a prover broker locally, the time after which a job times out and gets assigned to a different agent */
  proverBrokerJobTimeoutMs: z.number(),
  /** If starting a prover broker locally, the interval the broker checks for timed out jobs */
  proverBrokerPollIntervalMs: z.number(),
  /** If starting a prover broker locally, the directory to store broker data */
  proverBrokerDataDirectory: z.string().optional(),
});

export type ProverBrokerConfig = z.infer<typeof ProverBrokerConfig>;

export const proverBrokerConfigMappings: ConfigMappingsType<ProverBrokerConfig> = {
  proverBrokerJobTimeoutMs: {
    env: 'PROVER_BROKER_JOB_TIMEOUT_MS',
    description: 'Jobs are retried if not kept alive for this long',
    ...numberConfigHelper(60_000),
  },
  proverBrokerPollIntervalMs: {
    env: 'PROVER_BROKER_POLL_INTERVAL_MS',
    description: 'The interval to check job health status',
    ...numberConfigHelper(1_000),
  },
  proverBrokerDataDirectory: {
    env: 'DATA_DIRECTORY',
    description: 'If starting a prover broker locally, the directory to store broker data',
  },
  proverBrokerJobMaxRetries: {
    env: 'PROVER_BROKER_JOB_MAX_RETRIES',
    description: 'If starting a prover broker locally, the max number of retries per proving job',
    ...numberConfigHelper(3),
  },
};
/**
 * The prover configuration.
 */
export const ProverConfig = z.object({
  /** The URL to the Aztec node to take proving jobs from */
  nodeUrl: z.string().optional(),
  /** Identifier of the prover */
  proverId: schemas.Fr,
  /** An optional directory to cache data in */
  proverCacheDir: z.string().optional(),
});

export type ProverConfig = z.infer<typeof ProverConfig>;

export const proverConfigMappings: ConfigMappingsType<ProverConfig> = {
  nodeUrl: {
    env: 'AZTEC_NODE_URL',
    description: 'The URL to the Aztec node to take proving jobs from',
  },
  proverId: {
    env: 'PROVER_ID',
    parseEnv: (val: string) => parseProverId(val),
    description: 'Identifier of the prover',
    defaultValue: Fr.ZERO,
  },
  proverCacheDir: {
    env: 'PROVER_CACHE_DIR',
    description: 'Where to store cache data generated while proving',
    defaultValue: '/tmp/aztec-prover',
  },
};

function parseProverId(str: string) {
  return Fr.fromString(str.startsWith('0x') ? str : Buffer.from(str, 'utf8').toString('hex'));
}

/**
 * A database where the proving orchestrator can store intermediate results
 */
export interface ProverCache {
  /**
   * Saves the status of a proving job
   * @param jobId - The job ID
   * @param status - The status of the proof
   */
  setProvingJobStatus(jobId: string, status: ProvingJobStatus): Promise<void>;

  /**
   * Retrieves the status of a proving job (if known)
   * @param jobId - The job ID
   */
  getProvingJobStatus(jobId: string): Promise<ProvingJobStatus>;
}

/**
 * The interface to the prover client.
 * Provides the ability to generate proofs and build rollups.
 */
export interface EpochProverManager {
  createEpochProver(db: MerkleTreeReadOperations, cache?: ProverCache): EpochProver;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export class BlockProofError extends Error {
  static #name = 'BlockProofError';
  override name = BlockProofError.#name;

  constructor(message: string, public readonly txHashes: TxHash[]) {
    super(message);
  }

  static isBlockProofError(err: any): err is BlockProofError {
    return err && typeof err === 'object' && err.name === BlockProofError.#name;
  }
}
