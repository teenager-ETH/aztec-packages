import type { V2ProofOutput } from '@aztec/circuit-types';

export type ProofStatus =
  | { status: 'in-progress'; jobId: string }
  | { status: 'resolved'; value: V2ProofOutput }
  | { status: 'rejected'; error: string };

export interface EpochProofDatabase {
  updateProofStatus(jobId: string, status: ProofStatus): Promise<void>;
  getProofStatus(jobId: string): Promise<ProofStatus | undefined>;

  // updateTxProofStatus(
  //   txHash: TxHash,
  //   type:
  //     | ProvingRequestType.PUBLIC_VM
  //     | ProvingRequestType.TUBE_PROOF
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP,
  //   status: ProofStatus,
  // ): Promise<void>;

  // getTxProofStatus(
  //   txHash: TxHash,
  //   type:
  //     | ProvingRequestType.PUBLIC_VM
  //     | ProvingRequestType.TUBE_PROOF
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP,
  // ): Promise<ProofStatus | undefined>;

  // updateMergeRollupProofStatus(blockNumber: number, level: number, index: number, status: ProofStatus): Promise<void>;

  // getMergeRollupProofStatus(blockNumber: number, level: number, index: number): Promise<ProofStatus | undefined>;

  // updateBlockRootRollupProofStatus(blockNumber: number, outputs: ProofStatus): Promise<void>;

  // getBlockRootRollupProofStatus(blockNumber: number): Promise<ProofStatus | undefined>;

  // updateBlockMergeProofStatus(level: number, index: number, outputs: ProofStatus): Promise<void>;

  // getBlockMergeProofStatus(level: number, index: number): Promise<ProofStatus | undefined>;

  // updateRootRollupProofStatus(outputs: ProofStatus): Promise<void>;

  // getRootRollupProofStatus(): Promise<ProofStatus | undefined>;
}

export class InMemoryOrchestratorDatabase implements EpochProofDatabase {
  // private txProofOutputs = new Map<string, ProofStatus>();
  // private blockProofOutputs = new Map<string, ProofStatus>();
  // private epochProofOutputs = new Map<string, ProofStatus>();
  private proofs: Record<string, ProofStatus> = {};

  constructor() {}

  updateProofStatus(jobId: string, status: ProofStatus): Promise<void> {
    this.proofs[jobId] = status;
    return Promise.resolve();
  }

  getProofStatus(jobId: string): Promise<ProofStatus | undefined> {
    return Promise.resolve(this.proofs[jobId]);
  }

  // updateTxProofStatus(
  //   txHash: TxHash,
  //   type:
  //     | ProvingRequestType.PUBLIC_VM
  //     | ProvingRequestType.TUBE_PROOF
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP,
  //   outputs: ProofStatus,
  // ): Promise<void> {
  //   this.txProofOutputs.set(txHash.toString() + ':' + type, outputs);
  //   return Promise.resolve();
  // }

  // getTxProofStatus(
  //   txHash: TxHash,
  //   type:
  //     | ProvingRequestType.PUBLIC_VM
  //     | ProvingRequestType.TUBE_PROOF
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP
  //     | ProvingRequestType.PUBLIC_BASE_ROLLUP,
  // ): Promise<ProofStatus | undefined> {
  //   return Promise.resolve(this.txProofOutputs.get(txHash.toString() + ':' + type));
  // }

  // updateMergeRollupProofStatus(blockNumber: number, level: number, index: number, outputs: ProofStatus): Promise<void> {
  //   this.blockProofOutputs.set(blockNumber + ':' + level + ':' + index, outputs);
  //   return Promise.resolve();
  // }

  // getMergeRollupProofStatus(blockNumber: number, level: number, index: number): Promise<ProofStatus | undefined> {
  //   return Promise.resolve(this.blockProofOutputs.get(blockNumber + ':' + level + ':' + index));
  // }

  // updateBlockRootRollupProofStatus(blockNumber: number, outputs: ProofStatus): Promise<void> {
  //   this.blockProofOutputs.set(blockNumber.toString(), outputs);
  //   return Promise.resolve();
  // }

  // getBlockRootRollupProofStatus(blockNumber: number): Promise<ProofStatus | undefined> {
  //   return Promise.resolve(this.blockProofOutputs.get(blockNumber.toString()));
  // }

  // updateBlockMergeProofStatus(level: number, index: number, outputs: ProofStatus): Promise<void> {
  //   this.epochProofOutputs.set(level + ':' + index, outputs);
  //   return Promise.resolve();
  // }

  // getBlockMergeProofStatus(level: number, index: number): Promise<ProofStatus | undefined> {
  //   return Promise.resolve(this.epochProofOutputs.get(level + ':' + index));
  // }

  // updateRootRollupProofStatus(outputs: ProofStatus): Promise<void> {
  //   this.epochProofOutputs.set('root', outputs);
  //   return Promise.resolve();
  // }

  // getRootRollupProofStatus(): Promise<ProofStatus | undefined> {
  //   return Promise.resolve(this.epochProofOutputs.get('root'));
  // }
}
