import type { ProofUri, ProvingJob, ProvingJobId } from '@aztec/circuit-types';

import { type ProvingJobDatabase } from '../proving_job_database.js';

export class InMemoryDatabase implements ProvingJobDatabase {
  private jobs = new Map<ProvingJobId, ProvingJob>();
  private results = new Map<ProvingJobId, { value: ProofUri } | { error: string }>();

  getProvingJob(id: ProvingJobId): ProvingJob | undefined {
    return this.jobs.get(id);
  }

  getProvingJobResult(id: ProvingJobId): { value: ProofUri } | { error: string } | undefined {
    return this.results.get(id);
  }

  addProvingJob(request: ProvingJob): Promise<void> {
    this.jobs.set(request.id, request);
    return Promise.resolve();
  }

  setProvingJobResult(id: ProvingJobId, value: ProofUri): Promise<void> {
    this.results.set(id, { value });
    return Promise.resolve();
  }

  setProvingJobError(id: ProvingJobId, error: Error): Promise<void> {
    this.results.set(id, { error: String(error) });
    return Promise.resolve();
  }

  deleteProvingJobAndResult(id: ProvingJobId): Promise<void> {
    this.jobs.delete(id);
    this.results.delete(id);
    return Promise.resolve();
  }

  *allProvingJobs(): Iterable<[ProvingJob, { value: ProofUri } | { error: string } | undefined]> {
    for (const item of this.jobs.values()) {
      yield [item, this.results.get(item.id)] as const;
    }
  }
}
