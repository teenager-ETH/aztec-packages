#include "barretenberg/vm2/proving_helper.hpp"

#include <memory>

#include "barretenberg/common/serialize.hpp"
#include "barretenberg/common/thread.hpp"
#include "barretenberg/numeric/bitop/get_msb.hpp"
#include "barretenberg/vm/stats.hpp"
#include "barretenberg/vm2/constraining/check_circuit.hpp"
#include "barretenberg/vm2/generated/prover.hpp"
#include "barretenberg/vm2/generated/verifier.hpp"

namespace bb::avm2 {
namespace {

constexpr size_t circuit_subgroup_size = 1 << 21; // TODO: factor out.

// TODO: This doesn't need to be a shared_ptr, but BB requires it.
std::shared_ptr<AvmProver::ProvingKey> create_proving_key(AvmProver::ProverPolynomials& polynomials)
{
    // TODO: Why is num_public_inputs 0?
    auto proving_key = std::make_shared<AvmProver::ProvingKey>(circuit_subgroup_size, /*num_public_inputs=*/0);

    for (auto [key_poly, prover_poly] : zip_view(proving_key->get_all(), polynomials.get_unshifted())) {
        ASSERT(flavor_get_label(*proving_key, key_poly) == flavor_get_label(polynomials, prover_poly));
        key_poly = std::move(prover_poly);
    }

    proving_key->commitment_key = std::make_shared<AvmProver::PCSCommitmentKey>(circuit_subgroup_size);

    return proving_key;
}

AvmProver::ProverPolynomials compute_polynomials(tracegen::TraceContainer& trace)
{
    AvmProver::ProverPolynomials polys;

    // Polynomials that will be shifted need special care.
    AVM_TRACK_TIME("proving/init_polys_to_be_shifted", ({
                       auto to_be_shifted = polys.get_to_be_shifted();

                       // TODO: cannot parallelize because Polynomial construction uses parallelism.
                       for (size_t i = 0; i < to_be_shifted.size(); i++) {
                           auto& poly = to_be_shifted[i];
                           // WARNING! Column-Polynomials order matters!
                           Column col = static_cast<Column>(TO_BE_SHIFTED_COLUMNS_ARRAY.at(i));
                           auto num_rows = trace.get_column_size(col);
                           num_rows = num_rows >= 2 ? num_rows : 2; // We need at least 2 rows for the shift.

                           poly = AvmProver::Polynomial(
                               /*memory size*/
                               num_rows - 1,
                               /*largest possible index*/ circuit_subgroup_size,
                               /*make shiftable with offset*/ 1);
                       }
                   }));

    // catch-all with fully formed polynomials
    AVM_TRACK_TIME("proving/init_polys_unshifted", ({
                       auto unshifted = polys.get_unshifted();

                       // FIXME: We don't support handling of derived polynomials.
                       // Derived polynomials will be empty.
                       bb::parallel_for(unshifted.size(), [&](size_t i) {
                           auto& poly = unshifted[i];
                           // FIXME: this is a bad way to check if the polynomial is already initialized.
                           // It could be that it has been initialized, but it's all zeroes.
                           if (!poly.is_empty()) {
                               // Already initialized above.
                               return;
                           }

                           // WARNING! Column-Polynomials order matters!
                           Column col = static_cast<Column>(i);
                           const auto num_rows = trace.get_column_size(col);

                           poly = AvmProver::Polynomial::create_non_parallel_zero_init(num_rows, circuit_subgroup_size);
                       });
                   }));

    AVM_TRACK_TIME("proving/set_polys_unshifted", ({
                       auto unshifted = polys.get_unshifted();

                       // FIXME: We don't support handling of derived polynomials.
                       // This means that the derived polynomials will be empty.
                       // Therefore, you shouldn't try to write to them.
                       // In other words, the trace should be empty for inverse columns.
                       // This will only be correct if the lookup/perm selectors are always 0.

                       // TODO: We are now visiting per-column. Profile if per-row is better.
                       // This would need changes to the trace container.
                       bb::parallel_for(unshifted.size(), [&](size_t i) {
                           // WARNING! Column-Polynomials order matters!
                           auto& poly = unshifted[i];
                           Column col = static_cast<Column>(i);

                           trace.visit_column(col, [&](size_t row, const AvmProver::FF& value) {
                               // We use `at` because we are sure the row exists and the value is non-zero.
                               poly.at(row) = value;
                           });
                           // We free columns as we go.
                           // TODO: If we merge the init with the setting, this would be even more memory efficient.
                           trace.clear_column(col);
                       });
                   }));

    AVM_TRACK_TIME("proving/set_polys_shifted", ({
                       for (auto [shifted, to_be_shifted] : zip_view(polys.get_shifted(), polys.get_to_be_shifted())) {
                           shifted = to_be_shifted.shifted();
                       }
                   }));

    return polys;
}

} // namespace

std::pair<AvmProvingHelper::Proof, AvmProvingHelper::VkData> AvmProvingHelper::prove(tracegen::TraceContainer&& trace)
{
    auto polynomials = AVM_TRACK_TIME_V("proving/prove:compute_polynomials", compute_polynomials(trace));
    auto proving_key = AVM_TRACK_TIME_V("proving/prove:proving_key", create_proving_key(polynomials));
    auto prover =
        AVM_TRACK_TIME_V("proving/prove:construct_prover", AvmProver(proving_key, proving_key->commitment_key));
    auto verification_key =
        AVM_TRACK_TIME_V("proving/prove:verification_key", std::make_shared<AvmVerifier::VerificationKey>(proving_key));

    auto proof = AVM_TRACK_TIME_V("proving/construct_proof", prover.construct_proof());
    auto serialized_vk = to_buffer(verification_key->to_field_elements());

    return { std::move(proof), std::move(serialized_vk) };
}

bool AvmProvingHelper::check_circuit(tracegen::TraceContainer&& trace)
{
    // The proof is done over the whole circuit (2^21 rows).
    // However, for check-circuit purposes we run only over the trace rows
    // PLUS one extra row to catch any possible errors in the empty remainder
    // of the circuit.
    const size_t num_rows = trace.get_num_rows() + 1;
    info("Running check circuit over ", num_rows, " rows.");

    auto polynomials = AVM_TRACK_TIME_V("proving/prove:compute_polynomials", compute_polynomials(trace));
    try {
        AVM_TRACK_TIME("proving/check_circuit", constraining::run_check_circuit(polynomials, num_rows));
    } catch (const std::exception& e) {
        info("Circuit check failed: ", e.what());
        return false;
    }

    return true;
}

bool AvmProvingHelper::verify(const AvmProvingHelper::Proof& proof, const PublicInputs& pi, const VkData& vk_data)
{
    using VerificationKey = AvmVerifier::VerificationKey;
    std::vector<fr> vk_as_fields = many_from_buffer<AvmFlavorSettings::FF>(vk_data);

    auto circuit_size = uint64_t(vk_as_fields[0]);
    auto num_public_inputs = uint64_t(vk_as_fields[1]);
    std::span vk_span(vk_as_fields);

    vinfo("vk fields size: ", vk_as_fields.size());
    vinfo("circuit size: ",
          circuit_size,
          " (next or eq power: 2^",
          numeric::get_msb(numeric::round_up_power_2(circuit_size)),
          ")");
    // WARNING: The number of public inputs in the verification key is always 0!
    // Apparently we use some other mechanism to check the public inputs.
    vinfo("num of pub inputs: ", num_public_inputs);

    std::array<VerificationKey::Commitment, VerificationKey::NUM_PRECOMPUTED_COMMITMENTS> precomputed_cmts;
    for (size_t i = 0; i < VerificationKey::NUM_PRECOMPUTED_COMMITMENTS; i++) {
        // Start at offset 2 and adds 4 (NUM_FRS_COM) fr elements per commitment. Therefore, index = 4 * i + 2.
        precomputed_cmts[i] = field_conversion::convert_from_bn254_frs<VerificationKey::Commitment>(
            vk_span.subspan(AvmFlavor::NUM_FRS_COM * i + 2, AvmFlavor::NUM_FRS_COM));
    }

    auto vk = AVM_TRACK_TIME_V("proving/verify:verification_key",
                               std::make_shared<VerificationKey>(circuit_size, num_public_inputs, precomputed_cmts));

    auto verifier = AVM_TRACK_TIME_V("proving/verify:construct_verifier", AvmVerifier(std::move(vk)));
    return AVM_TRACK_TIME_V("proving/verify_proof", verifier.verify_proof(proof, pi.to_columns()));
}

} // namespace bb::avm2