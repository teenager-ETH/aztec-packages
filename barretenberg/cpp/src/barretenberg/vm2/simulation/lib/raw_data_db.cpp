#include "barretenberg/vm2/simulation/lib/raw_data_db.hpp"

#include <cassert>

namespace bb::avm::simulation {

HintedRawDataDB::HintedRawDataDB(const ExecutionHints& hints)
    : contract_instances(hints.contract_instances)
    , contract_classes(hints.contract_classes)
{}

ContractInstance HintedRawDataDB::get_contract_instance(const AztecAddress& address) const
{
    assert(contract_instances_idx < contract_instances.size());
    auto contract_instance_hint = contract_instances[contract_instances_idx];
    assert(contract_instance_hint.address == address);
    return {
        .address = contract_instance_hint.address,
        .salt = contract_instance_hint.salt,
        .deployer_addr = contract_instance_hint.deployer_addr,
        .contract_class_id = contract_instance_hint.contract_class_id,
        .initialisation_hash = contract_instance_hint.initialisation_hash,
        .public_keys =
            [](const auto& pks) {
                return PublicKeys{
                    .nullifier_key = pks.nullifier_key,
                    .incoming_viewing_key = pks.incoming_viewing_key,
                    .outgoing_viewing_key = pks.outgoing_viewing_key,
                    .tagging_key = pks.tagging_key,
                };
            }(contract_instance_hint.public_keys),
    };
}

ContractClass HintedRawDataDB::get_contract_class(const ContractClassId& class_id) const
{
    assert(contract_classes_idx < contract_classes.size());
    auto contract_class_hint = contract_classes[contract_classes_idx++];
    assert(class_id == contract_class_hint.artifact_hash);
    return {
        .artifact_hash = contract_class_hint.artifact_hash,
        .private_function_root = contract_class_hint.private_function_root,
        .public_bytecode_commitment = contract_class_hint.public_bytecode_commitment,
        .packed_bytecode = contract_class_hint.packed_bytecode,
    };
}

} // namespace bb::avm::simulation