import type { ProverCache, ProvingJobStatus } from '@aztec/circuit-types';

export class SimpleProverCache implements ProverCache {
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
