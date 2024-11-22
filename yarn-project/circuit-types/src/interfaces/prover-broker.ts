import {
  ProofUri,
  ProvingJob,
  ProvingJobId,
  ProvingJobSettledResult,
  ProvingJobStatus,
  ProvingRequestType,
} from '@aztec/circuit-types';
import { type ApiSchemaFor } from '@aztec/foundation/schemas';

import { z } from 'zod';

/**
 * An interface for the proving orchestrator. The producer uses this to enqueue jobs for agents
 */
export interface ProvingJobProducer {
  /**
   * Enqueues a proving job
   * @param job - The job to enqueue
   */
  enqueueProvingJob(job: ProvingJob): Promise<void>;

  /**
   * Cancels a proving job and clears all of its
   * @param id - The ID of the job to cancel
   */
  removeAndCancelProvingJob(id: ProvingJobId): Promise<void>;

  /**
   * Returns the current status fof the proving job
   * @param id - The ID of the job to get the status of
   */
  getProvingJobStatus(id: ProvingJobId): Promise<ProvingJobStatus>;

  /**
   * Waits for the job to settle and returns to the result
   * @param id - The ID of the job to get the status of
   */
  waitForJobToSettle(id: ProvingJobId): Promise<ProvingJobSettledResult>;
}

export const ProvingJobFilter = z.object({
  allowList: z.array(z.nativeEnum(ProvingRequestType)),
});

export type ProvingJobFilter = z.infer<typeof ProvingJobFilter>;

export const GetProvingJobResponse = z.object({
  job: ProvingJob,
  time: z.number(),
});

export type GetProvingJobResponse = z.infer<typeof GetProvingJobResponse>;

/**
 * An interface for proving agents to request jobs and report results
 */
export interface ProvingJobConsumer {
  /**
   * Gets a proving job to work on
   * @param filter - Optional filter for the type of job to get
   */
  getProvingJob(filter?: ProvingJobFilter): Promise<GetProvingJobResponse | undefined>;

  /**
   * Marks a proving job as successful
   * @param id - The ID of the job to report success for
   * @param result - The result of the job
   */
  reportProvingJobSuccess(id: ProvingJobId, result: ProofUri): Promise<void>;

  /**
   * Marks a proving job as errored
   * @param id - The ID of the job to report an error for
   * @param err - The error that occurred while processing the job
   * @param retry - Whether to retry the job
   */
  reportProvingJobError(id: ProvingJobId, err: string, retry?: boolean): Promise<void>;

  /**
   * Sends a heartbeat to the broker to indicate that the agent is still working on the given proving job
   * @param id - The ID of the job to report progress for
   * @param startedAt - The unix epoch when the job was started
   * @param filter - Optional filter for the type of job to get
   */
  reportProvingJobProgress(
    id: ProvingJobId,
    startedAt: number,
    filter?: ProvingJobFilter,
  ): Promise<GetProvingJobResponse | undefined>;
}

export const ProvingJobProducer: ApiSchemaFor<ProvingJobProducer> = {
  enqueueProvingJob: z.function().args(ProvingJob).returns(z.void()),
  getProvingJobStatus: z.function().args(ProvingJobId).returns(ProvingJobStatus),
  removeAndCancelProvingJob: z.function().args(ProvingJobId).returns(z.void()),
  waitForJobToSettle: z.function().args(ProvingJobId).returns(ProvingJobSettledResult),
};

// can't use ApiSchemaFor because of the optional parameters
export const ProvingJobConsumer = {
  getProvingJob: z.function().args(ProvingJobFilter.optional()).returns(GetProvingJobResponse.optional()),
  reportProvingJobError: z.function().args(ProvingJobId, z.string(), z.boolean().optional()).returns(z.void()),
  reportProvingJobProgress: z
    .function()
    .args(ProvingJobId, z.number(), ProvingJobFilter.optional())
    .returns(GetProvingJobResponse.optional()),
  reportProvingJobSuccess: z.function().args(ProvingJobId, ProofUri).returns(z.void()),
};
