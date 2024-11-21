import {
  ProofInputs,
  type ProofInputsUri,
  type ProofOutputsUri,
  type ProvingJobId,
  ProvingJobResult,
  type ProvingRequestType,
} from '@aztec/circuit-types';

/**
 * A database for storing proof inputs and outputs.
 */
export interface ProofInputOutputDatabase {
  /**
   * Save a proof input to the database.
   * @param jobId - The ID of the job the proof input is associated with.
   * @param type - The type of the proving request.
   * @param proofInput - The proof input to save.
   * @returns The URI of the saved proof input.
   */
  saveProofInput(jobId: ProvingJobId, type: ProvingRequestType, proofInput: ProofInputs): Promise<ProofInputsUri>;

  /**
   * Save a proof output to the database.
   * @param jobId - The ID of the job the proof input is associated with.
   * @param type - The type of the proving request.
   * @param proofOutput - The proof output to save.
   * @returns The URI of the saved proof output.
   */
  saveProofOutput(
    jobId: ProvingJobId,
    type: ProvingRequestType,
    proofOutput: ProvingJobResult,
  ): Promise<ProofOutputsUri>;

  /**
   * Retrieve a proof input from the database.
   * @param uri - The URI of the proof input to retrieve.
   * @returns The proof input.
   */
  getProofInput(uri: ProofInputsUri): Promise<ProofInputs>;

  /**
   * Retrieve a proof output from the database.
   * @param uri - The URI of the proof output to retrieve.
   * @returns The proof output.
   */
  getProofOutput(uri: ProofOutputsUri): Promise<ProvingJobResult>;
}

/**
 * An implementation of a proof input/output database that stores data inline in the URI.
 */
export class InlineProofIODatabase implements ProofInputOutputDatabase {
  private static readonly PREFIX = 'data:application/json;base64';
  private static readonly SEPARATOR = ',';
  private static readonly BUFFER_ENCODING = 'base64url';

  saveProofInput(_id: ProvingJobId, _type: ProvingRequestType, proofInput: ProofInputs): Promise<ProofInputsUri> {
    return Promise.resolve(
      (InlineProofIODatabase.PREFIX +
        InlineProofIODatabase.SEPARATOR +
        Buffer.from(JSON.stringify(proofInput)).toString(InlineProofIODatabase.BUFFER_ENCODING)) as ProofInputsUri,
    );
  }

  saveProofOutput(
    _id: ProvingJobId,
    _type: ProvingRequestType,
    proofOutput: ProvingJobResult,
  ): Promise<ProofOutputsUri> {
    return Promise.resolve(
      (InlineProofIODatabase.PREFIX +
        InlineProofIODatabase.SEPARATOR +
        Buffer.from(JSON.stringify(proofOutput)).toString(InlineProofIODatabase.BUFFER_ENCODING)) as ProofOutputsUri,
    );
  }

  getProofInput(uri: ProofInputsUri): Promise<ProofInputs> {
    const [prefix, data] = uri.split(',');
    if (prefix !== InlineProofIODatabase.PREFIX) {
      throw new Error('Invalid proof input URI: ' + prefix);
    }

    return Promise.resolve(
      ProofInputs.parse(JSON.parse(Buffer.from(data, InlineProofIODatabase.BUFFER_ENCODING).toString())),
    );
  }

  getProofOutput(uri: ProofOutputsUri): Promise<ProvingJobResult> {
    const [prefix, data] = uri.split(',');
    if (prefix !== InlineProofIODatabase.PREFIX) {
      throw new Error('Invalid proof output URI: ' + prefix);
    }

    return Promise.resolve(
      ProvingJobResult.parse(JSON.parse(Buffer.from(data, InlineProofIODatabase.BUFFER_ENCODING).toString())),
    );
  }
}
