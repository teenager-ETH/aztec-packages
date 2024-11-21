import {
  type ProofInputs,
  type ProvingJobId,
  type ProvingJobResult,
  ProvingRequestType,
  type ServerCircuitProver,
} from '@aztec/circuit-types';

export enum ProvingJobControllerStatus {
  IDLE = 'idle',
  PROVING = 'proving',
  DONE = 'done',
}

type ProvingJobCompletionCallback = (
  jobId: ProvingJobId,
  type: ProvingRequestType,
  error: Error | undefined,
  result: ProvingJobResult | undefined,
) => void | Promise<void>;

export class ProvingJobController {
  private status: ProvingJobControllerStatus = ProvingJobControllerStatus.IDLE;
  private promise?: Promise<void>;
  private abortController = new AbortController();

  constructor(
    private jobId: ProvingJobId,
    private inputs: ProofInputs,
    private startedAt: number,
    private circuitProver: ServerCircuitProver,
    private onComplete: ProvingJobCompletionCallback,
  ) {}

  public start(): void {
    if (this.status !== ProvingJobControllerStatus.IDLE) {
      return;
    }

    this.status = ProvingJobControllerStatus.PROVING;
    this.promise = this.generateProof()
      .then(
        result => {
          this.status = ProvingJobControllerStatus.DONE;
          return this.onComplete(this.jobId, this.inputs.type, undefined, result);
        },
        error => {
          this.status = ProvingJobControllerStatus.DONE;
          if (error.name === 'AbortError') {
            // Ignore abort errors
            return;
          }
          return this.onComplete(this.jobId, this.inputs.type, error, undefined);
        },
      )
      .catch(_ => {
        // ignore completion errors
      });
  }

  public getStatus(): ProvingJobControllerStatus {
    return this.status;
  }

  public abort(): void {
    if (this.status !== ProvingJobControllerStatus.PROVING) {
      return;
    }

    this.abortController.abort();
  }

  public getJobId(): ProvingJobId {
    return this.jobId;
  }

  public getStartedAt(): number {
    return this.startedAt;
  }

  public getProofTypeName(): string {
    return ProvingRequestType[this.inputs.type];
  }

  private async generateProof(): Promise<ProvingJobResult> {
    const { type, inputs } = this.inputs;
    const signal = this.abortController.signal;
    switch (type) {
      case ProvingRequestType.PUBLIC_VM: {
        const result = await this.circuitProver.getAvmProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.PRIVATE_BASE_ROLLUP: {
        const result = await this.circuitProver.getPrivateBaseRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.PUBLIC_BASE_ROLLUP: {
        const result = await this.circuitProver.getPublicBaseRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.MERGE_ROLLUP: {
        const result = await this.circuitProver.getMergeRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.EMPTY_BLOCK_ROOT_ROLLUP: {
        const result = await this.circuitProver.getEmptyBlockRootRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.BLOCK_ROOT_ROLLUP: {
        const result = await this.circuitProver.getBlockRootRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.BLOCK_MERGE_ROLLUP: {
        const result = await this.circuitProver.getBlockMergeRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.ROOT_ROLLUP: {
        const result = await this.circuitProver.getRootRollupProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.BASE_PARITY: {
        const result = await this.circuitProver.getBaseParityProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.ROOT_PARITY: {
        const result = await this.circuitProver.getRootParityProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.PRIVATE_KERNEL_EMPTY: {
        const result = await this.circuitProver.getEmptyPrivateKernelProof(inputs, signal);
        return { type, result };
      }

      case ProvingRequestType.TUBE_PROOF: {
        const result = await this.circuitProver.getTubeProof(inputs, signal);
        return { type, result };
      }

      default: {
        const _exhaustive: never = type;
        return Promise.reject(new Error(`Invalid proof request type: ${type}`));
      }
    }
  }
}
