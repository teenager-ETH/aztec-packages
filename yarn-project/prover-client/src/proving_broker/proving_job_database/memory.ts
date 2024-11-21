import type { ProofOutputsUri, ProvingJobId, V2ProvingJob, V2ProvingJobResult } from '@aztec/circuit-types';

import { type ProvingJobDatabase } from '../proving_job_database.js';

export class InMemoryDatabase implements ProvingJobDatabase {
  private jobs = new Map<ProvingJobId, V2ProvingJob>();
  private results = new Map<ProvingJobId, V2ProvingJobResult>();

  getProvingJob(id: ProvingJobId): V2ProvingJob | undefined {
    return this.jobs.get(id);
  }

  getProvingJobResult(id: ProvingJobId): V2ProvingJobResult | undefined {
    return this.results.get(id);
  }

  addProvingJob(request: V2ProvingJob): Promise<void> {
    this.jobs.set(request.id, request);
    return Promise.resolve();
  }

  setProvingJobResult(id: ProvingJobId, value: ProofOutputsUri): Promise<void> {
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

  *allProvingJobs(): Iterable<[V2ProvingJob, V2ProvingJobResult | undefined]> {
    for (const item of this.jobs.values()) {
      yield [item, this.results.get(item.id)] as const;
    }
  }
}
