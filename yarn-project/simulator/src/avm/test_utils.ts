import { Fr } from '@aztec/circuits.js';
import { type ContractInstanceWithAddress } from '@aztec/types/contracts';

import { type jest } from '@jest/globals';
import { mock } from 'jest-mock-extended';

import { type WorldStateDB } from '../public/public_db_sources.js';
import { type PublicSideEffectTraceInterface } from '../public/side_effect_trace_interface.js';

export function mockGetBytecode(worldStateDB: WorldStateDB, bytecode: Buffer) {
  (worldStateDB as jest.Mocked<WorldStateDB>).getBytecode.mockResolvedValue(bytecode);
}

export function mockTraceFork(trace: PublicSideEffectTraceInterface, nestedTrace?: PublicSideEffectTraceInterface) {
  (trace as jest.Mocked<PublicSideEffectTraceInterface>).fork.mockReturnValue(
    nestedTrace ?? mock<PublicSideEffectTraceInterface>(),
  );
}

export function mockStorageRead(worldStateDB: WorldStateDB, value: Fr) {
  (worldStateDB as jest.Mocked<WorldStateDB>).storageRead.mockResolvedValue(value);
}

export function mockStorageReadWithMap(worldStateDB: WorldStateDB, mockedStorage: Map<bigint, Fr>) {
  (worldStateDB as jest.Mocked<WorldStateDB>).storageRead.mockImplementation((_address, slot) =>
    Promise.resolve(mockedStorage.get(slot.toBigInt()) ?? Fr.ZERO),
  );
}

export function mockNoteHashExists(worldStateDB: WorldStateDB, _leafIndex: Fr, value?: Fr) {
  (worldStateDB as jest.Mocked<WorldStateDB>).getCommitmentValue.mockImplementation((index: bigint) => {
    if (index == _leafIndex.toBigInt()) {
      return Promise.resolve(value);
    } else {
      // This is ok for now since the traceing functions handle it
      return Promise.resolve(undefined);
    }
  });
}

export function mockNullifierExists(worldStateDB: WorldStateDB, leafIndex: Fr, _value?: Fr) {
  (worldStateDB as jest.Mocked<WorldStateDB>).getNullifierIndex.mockResolvedValue(leafIndex.toBigInt());
}

export function mockL1ToL2MessageExists(
  worldStateDB: WorldStateDB,
  leafIndex: Fr,
  value: Fr,
  valueAtOtherIndices?: Fr,
) {
  (worldStateDB as jest.Mocked<WorldStateDB>).getL1ToL2LeafValue.mockImplementation((index: bigint) => {
    if (index == leafIndex.toBigInt()) {
      return Promise.resolve(value);
    } else {
      // any indices other than mockAtLeafIndex will return a different value
      // (or undefined if no value is specified for other indices)
      return Promise.resolve(valueAtOtherIndices!);
    }
  });
}

export function mockGetContractInstance(worldStateDB: WorldStateDB, contractInstance: ContractInstanceWithAddress) {
  (worldStateDB as jest.Mocked<WorldStateDB>).getContractInstance.mockResolvedValue(contractInstance);
}