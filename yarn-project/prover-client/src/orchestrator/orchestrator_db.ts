import { type AztecKVStore, type AztecMap } from '@aztec/kv-store';

export type ProofStatus =
  | { status: 'in-progress'; jobId: string }
  | { status: 'resolved'; value: any }
  | { status: 'rejected'; error: string };

/**
 * A database where the proving orchestrator can store intermediate results
 */
export interface OrchestratorDatabase {
  /**
   * Saves the status of a proving job
   * @param jobId - The job ID
   * @param status - The status of the proof
   */
  setProofStatus(jobId: string, status: ProofStatus): Promise<void>;

  /**
   * Retrieves the status of a proving job (if known)
   * @param jobId - The job ID
   */
  getProofStatus(jobId: string): Promise<ProofStatus | undefined>;
}

export class InMemoryOrchestratorDatabase implements OrchestratorDatabase {
  private proofs: Record<string, ProofStatus> = {};

  constructor() {}

  setProofStatus(jobId: string, status: ProofStatus): Promise<void> {
    this.proofs[jobId] = status;
    return Promise.resolve();
  }

  getProofStatus(jobId: string): Promise<ProofStatus | undefined> {
    return Promise.resolve(this.proofs[jobId]);
  }
}

export class PersistentOrchestratorDatabase implements OrchestratorDatabase {
  private proofStatus: AztecMap<string, string>;

  constructor(store: AztecKVStore) {
    this.proofStatus = store.openMap('prover_node_proof_status');
  }

  getProofStatus(jobId: string): Promise<ProofStatus | undefined> {
    const item = this.proofStatus.get(jobId);
    if (!item) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(JSON.parse(item));
  }

  setProofStatus(jobId: string, status: ProofStatus): Promise<void> {
    return this.proofStatus.set(jobId, JSON.stringify(status));
  }
}
