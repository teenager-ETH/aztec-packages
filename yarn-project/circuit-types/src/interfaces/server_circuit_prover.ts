import {
  type AvmProofAndVerificationKey,
  type PublicInputsAndRecursiveProof,
  type PublicInputsAndTubeProof,
  type Tx,
} from '@aztec/circuit-types';
import {
  type AvmCircuitInputs,
  type BaseOrMergeRollupPublicInputs,
  type BaseParityInputs,
  type BaseRollupInputs,
  type BlockMergeRollupInputs,
  type BlockRootOrBlockMergePublicInputs,
  type BlockRootRollupInputs,
  type KernelCircuitPublicInputs,
  type MergeRollupInputs,
  type NESTED_RECURSIVE_PROOF_LENGTH,
  type PrivateKernelEmptyInputData,
  type PublicKernelCircuitPrivateInputs,
  type PublicKernelCircuitPublicInputs,
  type PublicKernelInnerCircuitPrivateInputs,
  type PublicKernelTailCircuitPrivateInputs,
  type RECURSIVE_PROOF_LENGTH,
  type RecursiveProof,
  type RootParityInput,
  type RootParityInputs,
  type RootRollupInputs,
  type RootRollupPublicInputs,
  type TubeInputs,
  type VMCircuitPublicInputs,
  type VerificationKeyData,
} from '@aztec/circuits.js';

/**
 * Generates proofs for parity and rollup circuits.
 */
export interface ServerCircuitProver {
  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getBaseParityProof(
    inputs: BaseParityInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<RootParityInput<typeof RECURSIVE_PROOF_LENGTH>>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getRootParityProof(
    inputs: RootParityInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<RootParityInput<typeof NESTED_RECURSIVE_PROOF_LENGTH>>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getBaseRollupProof(
    baseRollupInput: BaseRollupInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<BaseOrMergeRollupPublicInputs>>;

  /**
   * Get a recursively verified client IVC proof (making it a compatible honk proof for the rest of the rollup).
   * @param input - Input to the circuit.
   */
  getTubeProof(
    tubeInput: TubeInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<{ tubeVK: VerificationKeyData; tubeProof: RecursiveProof<typeof RECURSIVE_PROOF_LENGTH> }>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getMergeRollupProof(
    input: MergeRollupInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<BaseOrMergeRollupPublicInputs>>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getBlockRootRollupProof(
    input: BlockRootRollupInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<BlockRootOrBlockMergePublicInputs>>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getBlockRootRollupFinalProof(
    input: BlockRootRollupInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<BlockRootOrBlockMergePublicInputs>>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getBlockMergeRollupProof(
    input: BlockMergeRollupInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<BlockRootOrBlockMergePublicInputs>>;

  /**
   * Creates a proof for the given input.
   * @param input - Input to the circuit.
   */
  getRootRollupProof(
    input: RootRollupInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<RootRollupPublicInputs>>;

  /**
   * Create a public kernel inner proof.
   * @param kernelRequest - Object containing the details of the proof required
   */
  getPublicKernelInnerProof(
    inputs: PublicKernelInnerCircuitPrivateInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<VMCircuitPublicInputs>>;

  getPublicKernelMergeProof(
    inputs: PublicKernelCircuitPrivateInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<PublicKernelCircuitPublicInputs>>;

  getPublicTailProof(
    inputs: PublicKernelTailCircuitPrivateInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<KernelCircuitPublicInputs>>;

  getEmptyPrivateKernelProof(
    inputs: PrivateKernelEmptyInputData,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndRecursiveProof<KernelCircuitPublicInputs>>;

  getEmptyTubeProof(
    inputs: PrivateKernelEmptyInputData,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<PublicInputsAndTubeProof<KernelCircuitPublicInputs>>;

  /**
   * Create a proof for the AVM circuit.
   * @param inputs - Inputs to the AVM circuit.
   */
  getAvmProof(
    inputs: AvmCircuitInputs,
    signal?: AbortSignal,
    epochNumber?: number,
  ): Promise<AvmProofAndVerificationKey>;
}

/**
 * A verifier used by nodes to check tx proofs are valid.
 */
export interface ClientProtocolCircuitVerifier {
  /**
   * Verifies the private protocol circuit's proof.
   * @param tx - The tx to verify the proof of
   * @returns True if the proof is valid, false otherwise
   */
  verifyProof(tx: Tx): Promise<boolean>;
}