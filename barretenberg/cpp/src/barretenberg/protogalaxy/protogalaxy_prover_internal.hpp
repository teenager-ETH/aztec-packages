#pragma once
#include "barretenberg/common/constexpr_utils.hpp"
#include "barretenberg/common/container.hpp"
#include "barretenberg/common/op_count.hpp"
#include "barretenberg/common/thread.hpp"
#include "barretenberg/protogalaxy/prover_verifier_shared.hpp"
#include "barretenberg/relations/relation_parameters.hpp"
#include "barretenberg/relations/relation_types.hpp"
#include "barretenberg/relations/utils.hpp"
#include "barretenberg/ultra_honk/oink_prover.hpp"

namespace bb {

/**
 * @brief A purely static class (never add state to this!) consisting of functions used by the Protogalaxy prover.
 *
 * @tparam DeciderProvingKeys_
 */
template <class DeciderProvingKeys_> class ProtogalaxyProverInternal {
  public:
    using DeciderPKs = DeciderProvingKeys_;
    using Flavor = typename DeciderPKs::Flavor;
    using FF = typename Flavor::FF;
    using DeciderPK = typename DeciderPKs::DeciderPK;
    using RelationUtils = bb::RelationUtils<Flavor>;
    using ProverPolynomials = typename Flavor::ProverPolynomials;
    using Relations = typename Flavor::Relations;
    using RelationSeparator = typename Flavor::RelationSeparator;
    static constexpr size_t NUM_KEYS = DeciderProvingKeys_::NUM;
    using UnivariateRelationParametersNoOptimisticSkipping =
        bb::RelationParameters<Univariate<FF, DeciderProvingKeys_::EXTENDED_LENGTH>>;
    using UnivariateRelationParameters =
        bb::RelationParameters<Univariate<FF, DeciderProvingKeys_::EXTENDED_LENGTH, 0, /*skip_count=*/NUM_KEYS - 1>>;
    using UnivariateRelationSeparator =
        std::array<Univariate<FF, DeciderPKs::BATCHED_EXTENDED_LENGTH>, Flavor::NUM_SUBRELATIONS - 1>;

    // The length of ExtendedUnivariate is the largest length (==max_relation_degree + 1) of a univariate polynomial
    // obtained by composing a relation with Lagrange polynomial-linear combination of NUM-many decider pks, with
    // relation parameters regarded as variables.
    using ExtendedUnivariate = Univariate<FF, (Flavor::MAX_TOTAL_RELATION_LENGTH - 1) * (DeciderPKs::NUM - 1) + 1>;
    // Represents the total length of the combiner univariate, obtained by combining the already folded relations with
    // the folded relation batching challenge.
    using ExtendedUnivariateWithRandomization =
        Univariate<FF, (Flavor::MAX_TOTAL_RELATION_LENGTH - 1 + DeciderPKs::NUM - 1) * (DeciderPKs::NUM - 1) + 1>;
    using ExtendedUnivariatesNoOptimisticSkipping =
        typename Flavor::template ProverUnivariates<ExtendedUnivariate::LENGTH>;
    using ExtendedUnivariates =
        typename Flavor::template ProverUnivariatesWithOptimisticSkipping<ExtendedUnivariate::LENGTH,
                                                                          /* SKIP_COUNT= */ DeciderPKs::NUM - 1>;

    using TupleOfTuplesOfUnivariatesNoOptimisticSkipping =
        typename Flavor::template ProtogalaxyTupleOfTuplesOfUnivariatesNoOptimisticSkipping<DeciderPKs::NUM>;
    using TupleOfTuplesOfUnivariates = typename Flavor::template ProtogalaxyTupleOfTuplesOfUnivariates<DeciderPKs::NUM>;
    using RelationEvaluations = typename Flavor::TupleOfArraysOfValues;

    static constexpr size_t NUM_SUBRELATIONS = DeciderPKs::NUM_SUBRELATIONS;

    /**
     * @brief Compute the values of the aggregated relation evaluations at each row in the execution trace, representing
     * f_i(ω) in the Protogalaxy paper, given the evaluations of all the prover polynomials and \vec{α} (the batching
     * challenges that help establishing each subrelation is independently valid in Honk - from the Plonk paper, DO NOT
     * confuse with α in Protogalaxy).
     *
     * @details When folding Mega decider proving keys, one of the relations is linearly dependent. We define such
     * relations as acting on the entire execution trace and hence requiring to be accumulated separately as we iterate
     * over each row. At the end of the function, the linearly dependent contribution is accumulated at index 0
     * representing the sum f_0(ω) + α_j*g(ω) where f_0 represents the full honk evaluation at row 0, g(ω) is the
     * linearly dependent subrelation and α_j is its corresponding batching challenge.
     */
    static std::tuple<std::shared_ptr<RelationEvaluations[]>, std::vector<FF>> compute_row_evaluations(
        const ProverPolynomials& polynomials,
        const RelationSeparator& alpha,
        const RelationParameters<FF>& relation_parameters)

    {

        BB_OP_COUNT_TIME_NAME("ProtogalaxyProver_::compute_row_evaluations");

        const size_t polynomial_size = polynomials.get_polynomial_size();
        std::vector<FF> aggregate_relation_evaluations(polynomial_size);
        std::shared_ptr<RelationEvaluations[]> subrelation_evaluations(new RelationEvaluations[polynomial_size]);
        const std::vector<FF> linearly_dependent_contribution_accumulators = parallel_for_heuristic(
            polynomial_size,
            /*accumulator default*/ FF(0),
            [&](size_t row_idx, FF& linearly_dependent_contribution_accumulator) {
                auto row = polynomials.get_row(row_idx);
                // evaluate all subrelations on (row, relation_params) and accumulate in evals (separator is 1 since we
                // are not summing across rows here)
                RelationEvaluations evals =
                    RelationUtils::accumulate_relation_evaluations(row, relation_parameters, FF(1));

                FF result{ 0 };
                FF running_challenge{ 1 };
                RelationUtils::scale_and_batch_elements(
                    evals, alpha, running_challenge, result, linearly_dependent_contribution_accumulator);

                subrelation_evaluations[static_cast<ptrdiff_t>(row_idx)] = evals;
                aggregate_relation_evaluations[row_idx] = result;
            },
            thread_heuristics::ALWAYS_MULTITHREAD);
        aggregate_relation_evaluations[0] += sum(linearly_dependent_contribution_accumulators);

        return std::make_pair(subrelation_evaluations, aggregate_relation_evaluations);
    }

    /**
     * @brief  Recursively compute the parent nodes of each level in the tree, starting from the leaves. Note that at
     * each level, the resulting parent nodes will be polynomials of degree (level+1) because we multiply by an
     * additional factor of X.
     */
    static std::vector<FF> construct_coefficients_tree(std::span<const FF> betas,
                                                       std::span<const FF> deltas,
                                                       const std::vector<std::vector<FF>>& prev_level_coeffs,
                                                       const size_t level = 1)
    {
        if (prev_level_coeffs.size() == 1) {
            return prev_level_coeffs[0];
        }

        const size_t degree{ level + 1 };
        const size_t prev_level_width{ prev_level_coeffs.size() };
        std::vector<std::vector<FF>> level_coeffs(prev_level_width / 2, std::vector<FF>(degree + 1, 0));
        parallel_for_heuristic(
            prev_level_width / 2,
            [&](size_t parent) {
                size_t node = parent * 2;
                std::copy(prev_level_coeffs[node].begin(), prev_level_coeffs[node].end(), level_coeffs[parent].begin());
                for (size_t d = 0; d < degree; d++) {
                    level_coeffs[parent][d] += prev_level_coeffs[node + 1][d] * betas[level];
                    level_coeffs[parent][d + 1] += prev_level_coeffs[node + 1][d] * deltas[level];
                }
            },
            /* overestimate */ thread_heuristics::FF_MULTIPLICATION_COST * degree * 3);
        return construct_coefficients_tree(betas, deltas, level_coeffs, level + 1);
    }

    /**
     * @brief We construct the coefficients of the perturbator polynomial in O(n) time following the technique in
     * Claim 4.4. Consider a binary tree whose leaves are the evaluations of the full Honk relation at each row in the
     * execution trace. The subsequent levels in the tree are constructed using the following technique: At level i in
     * the tree, label the branch connecting the left node n_l to its parent by 1 and for the right node n_r by β_i +
     * δ_i X. The value of the parent node n will be constructed as n = n_l + n_r * (β_i + δ_i X). Recurse over each
     * layer until the root is reached which will correspond to the perturbator polynomial F(X).
     * TODO(https://github.com/AztecProtocol/barretenberg/issues/745): make computation of perturbator more memory
     * efficient, operate in-place and use std::resize; add multithreading
     */
    static std::vector<FF> construct_perturbator_coefficients(std::span<const FF> betas,
                                                              std::span<const FF> deltas,
                                                              const std::vector<FF>& subrelation_evaluations)
    {
        const size_t width = subrelation_evaluations.size();
        std::vector<std::vector<FF>> first_level_coeffs(width / 2, std::vector<FF>(2, 0));
        parallel_for_heuristic(
            width / 2,
            [&](size_t parent) {
                size_t node = parent * 2;
                first_level_coeffs[parent][0] =
                    subrelation_evaluations[node] + subrelation_evaluations[node + 1] * betas[0];
                first_level_coeffs[parent][1] = subrelation_evaluations[node + 1] * deltas[0];
            },
            /* overestimate */ thread_heuristics::FF_MULTIPLICATION_COST * 3);
        return construct_coefficients_tree(betas, deltas, first_level_coeffs);
    }

    /**
     * @brief Construct the power perturbator polynomial F(X) in coefficient form from the accumulator
     */
    static std::tuple<std::shared_ptr<RelationEvaluations[]>, Polynomial<FF>> compute_perturbator(
        const std::shared_ptr<const DeciderPK>& accumulator, const std::vector<FF>& deltas)
    {
        BB_OP_COUNT_TIME();

        auto [subrelation_evaluations, aggregate_relation_evaluations] = compute_row_evaluations(
            accumulator->proving_key.polynomials, accumulator->alphas, accumulator->relation_parameters);
        const auto betas = accumulator->gate_challenges;
        ASSERT(betas.size() == deltas.size());

        std::vector<FF> perturbator(construct_perturbator_coefficients(betas, deltas, aggregate_relation_evaluations));
        // Populate the remaining coefficients with zeros to reach the required constant size
        for (size_t idx = accumulator->proving_key.log_circuit_size; idx < CONST_PG_LOG_N; ++idx) {
            perturbator.emplace_back(FF(0));
        }

        return std::make_pair(subrelation_evaluations, Polynomial<FF>(perturbator));
    }

    /**
     * @brief Prepare a univariate polynomial for relation execution in one step of the combiner construction.
     * @details For a fixed prover polynomial index, extract that polynomial from each key in DeciderProvingKeys. From
     * each polynomial, extract the value at row_idx. Use these values to create a univariate polynomial, and then
     * extend (i.e., compute additional evaluations at adjacent domain values) as needed.
     * @todo TODO(https://github.com/AztecProtocol/barretenberg/issues/751) Optimize memory
     */

    template <size_t skip_count = 0>
    static void extend_univariates(
        std::conditional_t<skip_count != 0, ExtendedUnivariates, ExtendedUnivariatesNoOptimisticSkipping>&
            extended_univariates,
        const DeciderPKs& keys,
        const size_t row_idx)
    {
        const auto base_univariates = keys.template row_to_univariates<skip_count>(row_idx);
        for (auto [extended_univariate, base_univariate] : zip_view(extended_univariates.get_all(), base_univariates)) {
            extended_univariate = base_univariate.template extend_to<ExtendedUnivariate::LENGTH, skip_count>();
        }
    }

    template <typename TupleOfUnivariates,
              typename LagrangePolynomialPowers, /* i-th idx is L_0^i */
              typename ArraysOfValues>
    inline static void accumulate_zero_incoming_contribution(TupleOfUnivariates& relation_accumulator,
                                                             const LagrangePolynomialPowers& L_0_pows,
                                                             const ArraysOfValues& subrelation_values_on_accumulator,
                                                             const FF& scaling_factor)
    {
        static constexpr size_t NUM_SUBRELATIONS = std::tuple_size_v<TupleOfUnivariates>;
        constexpr_for</* Start */ 0, /* End */ NUM_SUBRELATIONS, /* Increment */ 1>([&]<size_t idx>() {
            using Accumulator = std::tuple_element_t<idx, TupleOfUnivariates>;
            using View = typename Accumulator::View;

            static constexpr size_t DEG = Accumulator::LENGTH - 1;
            auto tmp = View(L_0_pows[DEG]) * std::get<idx>(subrelation_values_on_accumulator);
            tmp *= scaling_factor;
            std::get<idx>(relation_accumulator) += tmp;
        });
    }

    /**
     * @brief Add the value of each relation over univariates to an appropriate accumulator
     *
     * @tparam TupleOfTuplesOfUnivariates_ A tuple of univariate accumulators, where the univariates may be
     * optimized to avoid computation on some indices.
     * @tparam ExtendedUnivariates_ T
     * @tparam Parameters relation parameters type
     * @tparam relation_idx The index of the relation
     * @param univariate_accumulators
     * @param extended_univariates
     * @param relation_parameters
     * @param scaling_factor
     */
    template <typename TupleOfTuplesOfUnivariates_,
              typename ExtendedUnivariates_,
              typename Parameters,
              typename LagrangePowers,
              size_t relation_idx = 0>
    static void accumulate_relation_univariates(TupleOfTuplesOfUnivariates_& full_accumulator,
                                                const ExtendedUnivariates_& extended_univariates,
                                                const Parameters& relation_parameters,
                                                const FF& scaling_factor,
                                                const LagrangePowers& L_0_pows,
                                                const RelationEvaluations& evaluations_on_accumulator)
    {
        using Relation = std::tuple_element_t<relation_idx, Relations>;
        auto& accumulator_for_one_relation = std::get<relation_idx>(full_accumulator);

        //  Check if the relation is skippable to speed up accumulation
        if constexpr (!isSkippable<Relation, decltype(extended_univariates)>) {
            // If not, accumulate normally
            Relation::accumulate(
                accumulator_for_one_relation, extended_univariates, relation_parameters, scaling_factor);
        } else {
            // If so, only compute the contribution if the relation is active
            if (!Relation::skip(extended_univariates)) {
                if constexpr (std::same_as<Flavor, MegaFlavor>) {
                    if (Relation::incoming_contribution_is_zero(extended_univariates)) {
                        static_assert(
                            NUM_KEYS == 2,
                            "Sparse Protogalaxy is not implemented for folding more than one decider key at a time.");
                        auto& subrelation_evaluations = std::get<relation_idx>(evaluations_on_accumulator);
                        accumulate_zero_incoming_contribution(
                            accumulator_for_one_relation, L_0_pows, subrelation_evaluations, scaling_factor);
                    } else {
                        Relation::accumulate(
                            accumulator_for_one_relation, extended_univariates, relation_parameters, scaling_factor);
                    }
                } else {
                    Relation::accumulate(
                        accumulator_for_one_relation, extended_univariates, relation_parameters, scaling_factor);
                }
            }
        }

        // Repeat for the next relation.
        if constexpr (relation_idx + 1 < Flavor::NUM_RELATIONS) {
            accumulate_relation_univariates<TupleOfTuplesOfUnivariates_,
                                            ExtendedUnivariates_,
                                            Parameters,
                                            LagrangePowers,
                                            relation_idx + 1>(full_accumulator,
                                                              extended_univariates,
                                                              relation_parameters,
                                                              scaling_factor,
                                                              L_0_pows,
                                                              evaluations_on_accumulator);
        }
    }

    template <typename FF, size_t DEG, size_t SKIP_COUNT>
    static std::array<Univariate<FF, DEG, 0, SKIP_COUNT>, DEG> compute_lagrange_powers()
    {
        using LagrangePower = Univariate<FF, DEG, 0, SKIP_COUNT>;
        std::array<LagrangePower, DEG> result;

        // Generate the powers of the L_0, the Lagrange polynomial centered at 0, needed for Sparse Protogalaxy
        const LagrangePower L_0 =
            Univariate<FF, 2, 0, SKIP_COUNT>(std::array<FF, 2>{ 1, 0 }).template extend_to<DEG, SKIP_COUNT>();
        std::fill(result[0].begin(), result[0].end(), 1);
        result[1] = L_0;
        auto tmp = L_0;
        std::generate(result.begin() + 2, result.end(), [&tmp, &L_0] {
            tmp *= L_0;
            return tmp;
        });
        return result;
    }

    /**
     * @brief Compute the combiner polynomial $G$ in the Protogalaxy paper
     * @details We have implemented an optimization that (eg in the case where we fold one instance-witness pair at a
     * time) assumes the value G(1) is 0, which is true in the case where the witness to be folded is valid.
     * @todo (https://github.com/AztecProtocol/barretenberg/issues/968) Make combiner tests better
     *
     * @tparam skip_zero_computations whether to use the optimization that skips computing zero.
     * @param
     * @param gate_separators
     * @return ExtendedUnivariateWithRandomization
     */
    template <typename Parameters, typename TupleOfTuples>
    static ExtendedUnivariateWithRandomization compute_combiner(
        const DeciderPKs& keys,
        const GateSeparatorPolynomial<FF>& gate_separators,
        const Parameters& relation_parameters,
        const UnivariateRelationSeparator& alphas,
        TupleOfTuples& univariate_accumulators,
        const std::shared_ptr<RelationEvaluations[]>& subrelation_relation_values_on_accumulator)
    {
        BB_OP_COUNT_TIME();

        // Whether to use univariates whose operators ignore some values which an honest prover would compute to be zero
        constexpr bool skip_zero_computations = std::same_as<TupleOfTuples, TupleOfTuplesOfUnivariates>;

        const size_t common_polynomial_size = keys[0]->proving_key.circuit_size;
        // Determine number of threads for multithreading.
        // Note: Multithreading is "on" for every round but we reduce the number of threads from the max available based
        // on a specified minimum number of iterations per thread. This eventually leads to the use of a
        // single thread. For now we use a power of 2 number of threads simply to ensure the round size is evenly
        // divided.
        const size_t max_num_threads = get_num_cpus_pow2(); // number of available threads (power of 2)
        const size_t min_iterations_per_thread =
            1 << 6; // min number of iterations for which we'll spin up a unique thread
        const size_t desired_num_threads = common_polynomial_size / min_iterations_per_thread;
        size_t num_threads = std::min(desired_num_threads, max_num_threads);       // fewer than max if justified
        num_threads = num_threads > 0 ? num_threads : 1;                           // ensure num threads is >= 1
        const size_t iterations_per_thread = common_polynomial_size / num_threads; // actual iterations per thread

        // Univariates are optimised for usual PG, but we need the unoptimised version for tests (it's a version that
        // doesn't skip computation), so we need to define types depending on the template instantiation
        using ThreadAccumulators = TupleOfTuples;
        using ExtendedUnivatiatesType =
            std::conditional_t<skip_zero_computations, ExtendedUnivariates, ExtendedUnivariatesNoOptimisticSkipping>;

        // Construct univariate accumulator containers; one per thread
        std::vector<ThreadAccumulators> thread_univariate_accumulators(num_threads);
        for (auto& accum : thread_univariate_accumulators) {
            // just normal relation lengths
            RelationUtils::zero_univariates(accum);
        }

        auto lagrange_powers =
            compute_lagrange_powers<FF,
                                    Flavor::MAX_TOTAL_RELATION_LENGTH + 10,
                                    std::tuple_element_t<0, std::tuple_element_t<0, TupleOfTuples>>::SKIP_COUNT>();

        // Construct extended univariates containers; one per thread
        std::vector<ExtendedUnivatiatesType> extended_univariates;
        extended_univariates.resize(num_threads);

        // Accumulate the contribution from each sub-relation
        parallel_for(num_threads, [&](size_t thread_idx) {
            const size_t start = thread_idx * iterations_per_thread;
            const size_t end = (thread_idx + 1) * iterations_per_thread;

            for (size_t idx = start; idx < end; idx++) {
                // Instantiate univariates, possibly with skipping to ignore computation in
                // those indices (they are still available for skipping relations, but all derived
                // univariate will ignore those evaluations) No need to initialise
                // extended_univariates to 0, as it's assigned to.
                constexpr size_t skip_count = skip_zero_computations ? DeciderPKs::NUM - 1 : 0;

                // WORKTODO: At this point we can identify which relations vanish and only extend
                // those univariates that will be needed for nonvanishing relations.  But I think
                // this would be very manual? Still need to zero memory in any case. We could at
                // least check whether all skip conditions hold and avoid extending univariates in
                // that case...
                extend_univariates<skip_count>(extended_univariates[thread_idx], keys, idx);

                const FF pow_challenge = gate_separators[idx];

                // WORKTODO: maybe the skippability should move up here.

                // Accumulate the i-th row's univariate contribution. Note that the relation
                // parameters passed to this function have already been folded. Moreover,
                // linear-dependent relations that act over the entire execution trace rather than
                // on rows will not be multiplied by the pow challenge.
                accumulate_relation_univariates(
                    thread_univariate_accumulators[thread_idx],
                    extended_univariates[thread_idx],
                    relation_parameters, // these parameters have already been folded
                    pow_challenge,
                    lagrange_powers,
                    subrelation_relation_values_on_accumulator[static_cast<std::ptrdiff_t>(idx)]);
            }
        });

        RelationUtils::zero_univariates(univariate_accumulators);
        // Accumulate the per-thread univariate accumulators into a single set of accumulators
        for (auto& accumulators : thread_univariate_accumulators) {
            RelationUtils::add_nested_tuples(univariate_accumulators, accumulators);
        }
        // This does nothing if TupleOfTuples is TupleOfTuplesOfUnivariates
        TupleOfTuplesOfUnivariatesNoOptimisticSkipping deoptimized_univariates =
            deoptimise_univariates(univariate_accumulators);
        //  Batch the univariate contributions from each sub-relation to obtain the round univariate
        return batch_over_relations(deoptimized_univariates, alphas);
    }

    /**
     * @brief Compute combiner using univariates that do not avoid zero computation in case of valid incoming indices.
     * @details This is only used for testing the combiner calculation.
     */
    static ExtendedUnivariateWithRandomization compute_combiner_no_optimistic_skipping(
        const DeciderPKs& keys,
        const GateSeparatorPolynomial<FF>& gate_separators,
        const UnivariateRelationParametersNoOptimisticSkipping& relation_parameters,
        const UnivariateRelationSeparator& alphas,
        const std::shared_ptr<RelationEvaluations[]>& subrelation_relation_values_on_accumulator)
    {
        TupleOfTuplesOfUnivariatesNoOptimisticSkipping accumulators;
        return compute_combiner(keys,
                                gate_separators,
                                relation_parameters,
                                alphas,
                                accumulators,
                                subrelation_relation_values_on_accumulator);
    }

    static ExtendedUnivariateWithRandomization compute_combiner(
        const DeciderPKs& keys,
        const GateSeparatorPolynomial<FF>& gate_separators,
        const UnivariateRelationParameters& relation_parameters,
        const UnivariateRelationSeparator& alphas,
        const std::shared_ptr<RelationEvaluations[]>& subrelation_relation_values_on_accumulator)
    {
        TupleOfTuplesOfUnivariates accumulators;
        return compute_combiner(keys,
                                gate_separators,
                                relation_parameters,
                                alphas,
                                accumulators,
                                subrelation_relation_values_on_accumulator);
    }

    /**
     * @brief Convert univariates from optimised form to regular
     * @details We need to convert before we batch relations, since optimised versions don't have enough information to
     * extend the univariates to maximum length
     */
    template <typename TupleOfTuplesOfUnivariatePossiblyOptimistic>
    static TupleOfTuplesOfUnivariatesNoOptimisticSkipping deoptimise_univariates(
        const TupleOfTuplesOfUnivariatePossiblyOptimistic& tup)
    {
        // If input does not have optimized operators, return the input
        if constexpr (std::same_as<TupleOfTuplesOfUnivariatePossiblyOptimistic,
                                   TupleOfTuplesOfUnivariatesNoOptimisticSkipping>) {
            return tup;
        }

        const auto deoptimise = [&]<size_t outer_idx, size_t inner_idx>(auto& element) {
            auto& element_with_skipping = std::get<inner_idx>(std::get<outer_idx>(tup));
            element = element_with_skipping.convert();
        };

        TupleOfTuplesOfUnivariatesNoOptimisticSkipping result;
        RelationUtils::template apply_to_tuple_of_tuples<0, 0>(result, deoptimise);
        return result;
    }

    static ExtendedUnivariateWithRandomization batch_over_relations(
        TupleOfTuplesOfUnivariatesNoOptimisticSkipping& univariate_accumulators,
        const UnivariateRelationSeparator& alpha)
    {
        auto result =
            std::get<0>(std::get<0>(univariate_accumulators)).template extend_to<DeciderPKs::BATCHED_EXTENDED_LENGTH>();
        size_t idx = 0;
        const auto scale_and_sum = [&]<size_t outer_idx, size_t inner_idx>(auto& element) {
            auto extended = element.template extend_to<DeciderPKs::BATCHED_EXTENDED_LENGTH>();
            extended *= alpha[idx];
            result += extended;
            idx++;
        };

        RelationUtils::template apply_to_tuple_of_tuples<0, 1>(univariate_accumulators, scale_and_sum);
        RelationUtils::zero_univariates(univariate_accumulators);

        return result;
    }

    static std::pair<typename DeciderPKs::FF, std::array<typename DeciderPKs::FF, DeciderPKs::NUM>>
    compute_vanishing_polynomial_and_lagranges(const FF& challenge)
    {
        FF vanishing_polynomial_at_challenge;
        std::array<FF, DeciderPKs::NUM> lagranges;
        constexpr FF inverse_two = FF(2).invert();

        if constexpr (DeciderPKs::NUM == 2) {
            vanishing_polynomial_at_challenge = challenge * (challenge - FF(1));
            lagranges = { FF(1) - challenge, challenge };
        } else if constexpr (DeciderPKs::NUM == 3) {
            vanishing_polynomial_at_challenge = challenge * (challenge - FF(1)) * (challenge - FF(2));
            lagranges = { (FF(1) - challenge) * (FF(2) - challenge) * inverse_two,
                          challenge * (FF(2) - challenge),
                          challenge * (challenge - FF(1)) / FF(2) };
        } else if constexpr (DeciderPKs::NUM == 4) {
            constexpr FF inverse_six = FF(6).invert();
            vanishing_polynomial_at_challenge =
                challenge * (challenge - FF(1)) * (challenge - FF(2)) * (challenge - FF(3));
            lagranges = { (FF(1) - challenge) * (FF(2) - challenge) * (FF(3) - challenge) * inverse_six,
                          challenge * (FF(2) - challenge) * (FF(3) - challenge) * inverse_two,
                          challenge * (challenge - FF(1)) * (FF(3) - challenge) * inverse_two,
                          challenge * (challenge - FF(1)) * (challenge - FF(2)) * inverse_six };
        }
        static_assert(DeciderPKs::NUM < 5);

        return { vanishing_polynomial_at_challenge, lagranges };
    }

    /**
     * @brief Compute the combiner quotient defined as $K$ polynomial in the paper.
     *
     * TODO(https://github.com/AztecProtocol/barretenberg/issues/764): generalize the computation of vanishing
     * polynomials and Lagrange basis and use batch_invert.
     *
     */
    static Univariate<FF, DeciderPKs::BATCHED_EXTENDED_LENGTH, DeciderPKs::NUM> compute_combiner_quotient(
        FF perturbator_evaluation, ExtendedUnivariateWithRandomization combiner)
    {
        std::array<FF, DeciderPKs::BATCHED_EXTENDED_LENGTH - DeciderPKs::NUM> combiner_quotient_evals = {};

        constexpr FF inverse_two = FF(2).invert();
        constexpr FF inverse_six = FF(6).invert();
        for (size_t point = DeciderPKs::NUM; point < combiner.size(); point++) {
            auto idx = point - DeciderPKs::NUM;
            FF lagrange_0;
            FF vanishing_polynomial;
            if constexpr (DeciderPKs::NUM == 2) {
                lagrange_0 = FF(1) - FF(point);
                vanishing_polynomial = FF(point) * (FF(point) - 1);
            } else if constexpr (DeciderPKs::NUM == 3) {
                lagrange_0 = (FF(1) - FF(point)) * (FF(2) - FF(point)) * inverse_two;
                vanishing_polynomial = FF(point) * (FF(point) - 1) * (FF(point) - 2);
            } else if constexpr (DeciderPKs::NUM == 4) {
                lagrange_0 = (FF(1) - FF(point)) * (FF(2) - FF(point)) * (FF(3) - FF(point)) * inverse_six;
                vanishing_polynomial = FF(point) * (FF(point) - 1) * (FF(point) - 2) * (FF(point) - 3);
            }
            static_assert(DeciderPKs::NUM < 5);

            combiner_quotient_evals[idx] =
                (combiner.value_at(point) - perturbator_evaluation * lagrange_0) * vanishing_polynomial.invert();
        }

        return Univariate<FF, DeciderPKs::BATCHED_EXTENDED_LENGTH, DeciderPKs::NUM>(combiner_quotient_evals);
    }

    /**
     * @brief For each parameter, collect the value in each decider pvogin key in a univariate and extend for use in the
     * combiner compute.
     */
    template <typename ExtendedRelationParameters>
    static ExtendedRelationParameters compute_extended_relation_parameters(const DeciderPKs& keys)
    {
        using UnivariateParameter = typename ExtendedRelationParameters::DataType;
        ExtendedRelationParameters result;
        size_t param_idx = 0;
        for (auto& param : result.get_to_fold()) {
            Univariate<FF, DeciderPKs::NUM> tmp(0);
            size_t key_idx = 0;
            for (auto& key : keys) {
                tmp.value_at(key_idx) = key->relation_parameters.get_to_fold()[param_idx];
                key_idx++;
            }
            param = tmp.template extend_to<UnivariateParameter::LENGTH, UnivariateParameter::SKIP_COUNT>();
            param_idx++;
        }
        return result;
    }

    /**
     * @brief Combine the relation batching parameters (alphas) from each decider proving key into a univariate for
     * using in the combiner computation.
     */
    static UnivariateRelationSeparator compute_and_extend_alphas(const DeciderPKs& keys)
    {
        UnivariateRelationSeparator result;
        size_t alpha_idx = 0;
        for (auto& alpha : result) {
            Univariate<FF, DeciderPKs::NUM> tmp;
            size_t key_idx = 0;
            for (auto& key : keys) {
                tmp.value_at(key_idx) = key->alphas[alpha_idx];
                key_idx++;
            }
            alpha = tmp.template extend_to<DeciderPKs::BATCHED_EXTENDED_LENGTH>();
            alpha_idx++;
        }
        return result;
    }
};
} // namespace bb