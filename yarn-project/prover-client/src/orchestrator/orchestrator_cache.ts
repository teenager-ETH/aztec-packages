import { type AztecKVStore, type AztecMap } from '@aztec/kv-store';

export type ProvingJobStatus = { status: 'in-progress' } | { status: 'resolved'; value: any };

/**
 * A database where the proving orchestrator can store intermediate results
 */
export interface OrchestratorCache {
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
  getProvingJobStatus(jobId: string): Promise<ProvingJobStatus | undefined>;
}

export class InMemoryOrchestratorCache implements OrchestratorCache {
  private proofs: Record<string, ProvingJobStatus> = {};

  constructor() {}

  setProvingJobStatus(jobId: string, status: ProvingJobStatus): Promise<void> {
    this.proofs[jobId] = status;
    return Promise.resolve();
  }

  getProvingJobStatus(jobId: string): Promise<ProvingJobStatus | undefined> {
    return Promise.resolve(this.proofs[jobId]);
  }
}

export class PersistentOrchestratorCache implements OrchestratorCache {
  private proofs: AztecMap<string, string>;

  constructor(store: AztecKVStore) {
    this.proofs = store.openMap('prover_node_proof_status');
  }

  getProvingJobStatus(jobId: string): Promise<ProvingJobStatus | undefined> {
    const item = this.proofs.get(jobId);
    if (!item) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(JSON.parse(item));
  }

  setProvingJobStatus(jobId: string, status: ProvingJobStatus): Promise<void> {
    return this.proofs.set(jobId, JSON.stringify(status));
  }
}
