import { type ProofUri, ProvingJob, type ProvingJobId, ProvingJobSettledResult } from '@aztec/circuit-types';
import { type AztecKVStore, type AztecMap } from '@aztec/kv-store';

import { type ProvingBrokerDatabase } from '../proving_broker_database.js';

export class PersistedProvingJobDatabase implements ProvingBrokerDatabase {
  private jobs: AztecMap<ProvingJobId, string>;
  private jobResults: AztecMap<ProvingJobId, string>;

  constructor(private store: AztecKVStore) {
    this.jobs = store.openMap('proving_jobs');
    this.jobResults = store.openMap('proving_job_results');
  }

  async addProvingJob(job: ProvingJob): Promise<void> {
    await this.jobs.set(job.id, JSON.stringify(job));
  }

  *allProvingJobs(): Iterable<[ProvingJob, ProvingJobSettledResult | undefined]> {
    for (const jobStr of this.jobs.values()) {
      const job = ProvingJob.parse(JSON.parse(jobStr));
      const resultStr = this.jobResults.get(job.id);
      const result = resultStr ? ProvingJobSettledResult.parse(JSON.parse(resultStr)) : undefined;
      yield [job, result];
    }
  }

  deleteProvingJobAndResult(id: ProvingJobId): Promise<void> {
    return this.store.transaction(() => {
      void this.jobs.delete(id);
      void this.jobResults.delete(id);
    });
  }

  async setProvingJobError(id: ProvingJobId, err: Error): Promise<void> {
    const result: ProvingJobSettledResult = { status: 'rejected', reason: err.message };
    await this.jobResults.set(id, JSON.stringify(result));
  }

  async setProvingJobResult(id: ProvingJobId, value: ProofUri): Promise<void> {
    const result: ProvingJobSettledResult = { status: 'fulfilled', value };
    await this.jobResults.set(id, JSON.stringify(result));
  }
}