// NOTE: names are in camel-case because they matter to messagepack.
// DO NOT use camel-case outside of these structures.
#pragma once

#include <vector>

#include "barretenberg/serialize/msgpack.hpp"
#include "barretenberg/vm2/common/aztec_types.hpp"
#include "barretenberg/vm2/common/field.hpp"

namespace bb::avm2 {

struct PublicKeysHint {
    AffinePoint masterNullifierPublicKey;
    AffinePoint masterIncomingViewingPublicKey;
    AffinePoint masterOutgoingViewingPublicKey;
    AffinePoint masterTaggingPublicKey;

    MSGPACK_FIELDS(masterNullifierPublicKey,
                   masterIncomingViewingPublicKey,
                   masterOutgoingViewingPublicKey,
                   masterTaggingPublicKey);
};

struct ContractInstanceHint {
    AztecAddress address;
    bool exists;
    FF salt;
    AztecAddress deployer;
    ContractClassId contractClassId;
    FF initializationHash;
    PublicKeysHint publicKeys;

    MSGPACK_FIELDS(address, exists, salt, deployer, contractClassId, initializationHash, publicKeys);
};

struct ContractClassHint {
    FF artifactHash;
    FF privateFunctionsRoot;
    FF publicBytecodeCommitment;
    std::vector<uint8_t> packedBytecode;

    MSGPACK_FIELDS(artifactHash, privateFunctionsRoot, publicBytecodeCommitment, packedBytecode);
};

struct ExecutionHints {
    std::vector<ContractInstanceHint> contractInstances;
    std::vector<ContractClassHint> contractClasses;

    MSGPACK_FIELDS(contractInstances, contractClasses);
};

struct PublicExecutionRequest {
    AztecAddress contractAddress;
    AztecAddress sender;
    std::vector<FF> args;
    bool isStatic;

    MSGPACK_FIELDS(contractAddress, sender, args, isStatic);
};

struct PublicInputs {
    // Nothing yet.
    std::vector<FF> dummy;

    static PublicInputs from(const std::vector<uint8_t>& data);
    std::vector<std::vector<FF>> to_columns() const { return { dummy }; }

    MSGPACK_FIELDS(dummy);
};

struct AvmProvingInputs {
    std::vector<PublicExecutionRequest> enqueuedCalls;
    ExecutionHints hints;
    PublicInputs publicInputs;

    static AvmProvingInputs from(const std::vector<uint8_t>& data);

    MSGPACK_FIELDS(enqueuedCalls, hints);
};

} // namespace bb::avm2