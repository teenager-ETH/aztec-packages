#pragma once
#include "barretenberg/relations/relation_types.hpp"

namespace bb {

template <typename FF_, bool HOMOGENIZED> class UltraArithmeticRelationImplBase {
  public:
    using FF = FF_;

    static constexpr std::array<size_t, 2> SUBRELATION_PARTIAL_LENGTHS{
        6, // primary arithmetic sub-relation
        5  // secondary arithmetic sub-relation
    };

    static constexpr size_t HOMOGENIZED_LENGTH{ 7 };

    /**
     * @brief For ZK-Flavors: The degrees of subrelations considered as polynomials only in witness polynomials,
     * i.e. all selectors and public polynomials are treated as constants.
     */
    static constexpr std::array<size_t, 2> SUBRELATION_WITNESS_DEGREES{ 2, 2 };

    /**
     * @brief Returns true if the contribution from all subrelations for the provided inputs is identically zero
     */
    template <typename AllEntities> inline static bool skip(const AllEntities& in) { return in.q_arith.is_zero(); }

    template <typename AllEntities>
    inline static bool incoming_contribution_is_zero(const AllEntities& in)
        requires HOMOGENIZED && ArrayAccessOnEntity<AllEntities>
    {
        // For folding multiple instances, we would do a constexpr loop over { idx = 1; idx < NUM_KEYS }
        return in.w_l.value_at(1).is_zero() && in.w_r.value_at(1).is_zero() && in.w_o.value_at(1).is_zero() &&
               in.w_4.value_at(1).is_zero() && in.w_4_shift.value_at(1).is_zero() && in.q_m.value_at(1).is_zero() &&
               in.q_l.value_at(1).is_zero() && in.q_r.value_at(1).is_zero() && in.q_o.value_at(1).is_zero() &&
               in.q_4.value_at(1).is_zero() && in.q_c.value_at(1).is_zero() && in.q_arith.value_at(1).is_zero() &&
               in.w_l_shift.value_at(1).is_zero() /* && in.homogenizer.value_at(1) == 0 */;
    }
};

template <typename FF_, bool HOMOGENIZED> class UltraArithmeticRelationImpl;

template <typename FF_>
class UltraArithmeticRelationImpl<FF_, /* HOMOGENIZED */ false>
    : public UltraArithmeticRelationImplBase<FF_, /* HOMOGENIZED */ false> {
  public:
    using FF = FF_;

    /**
     * @brief Expression for the Ultra Arithmetic gate.
     * @details This relation encapsulates several idenitities, toggled by the value of q_arith in [0, 1, 2, 3, ...].
     * The following description is reproduced from the Plonk analog 'plookup_arithmetic_widget':
     * The whole formula is:
     *
     * q_arith * ( ( (-1/2) * (q_arith - 3) * q_m * w_l * w_r + q_l * w_l + q_r * w_r + q_o * w_o + q_4 * w_4 + q_c ) +
     * (q_arith - 1)*( α * (q_arith - 2) * (w_l + w_4 - w_l_shift + q_m) + w_4_shift) ) = 0
     *
     * This formula results in several cases depending on q_arith:
     * 1. q_arith == 0: Arithmetic gate is completely disabled
     *
     * 2. q_arith == 1: Everything in the minigate on the right is disabled. The equation is just a standard plonk
     * equation with extra wires: q_m * w_l * w_r + q_l * w_l + q_r * w_r + q_o * w_o + q_4 * w_4 + q_c = 0
     *
     * 3. q_arith == 2: The (w_l + w_4 - ...) term is disabled. The equation is:
     * 2 * ((1/2) * q_m * w_l * w_r + q_l * w_l + q_r * w_r + q_o * w_o + q_4 * w_4 + q_c + w_4_shift) = 0
     * It allows defining w_4 at next index (w_4_shift) in terms of current wire values
     *
     * 4. q_arith == 3: The product of w_l and w_r is disabled, but a mini addition gate is enabled. α² allows us to
     * split the equation into two:
     *
     * q_l * w_l + q_r * w_r + q_o * w_o + q_4 * w_4 + q_c + 2 * w_4_shift = 0
     *
     * w_l + w_4 - w_l_shift + q_m = 0  (we are reusing q_m here)
     *
     * 5. q_arith > 3: The product of w_l and w_r is scaled by (q_arith - 3), while the w_4_shift term is scaled by
     * (q_arith
     * - 1). The equation can be split into two:
     *
     * (q_arith - 3)* q_m * w_l * w_ 2 + q_l * w_l + q_r * w_r + q_o * w_o + q_4 * w_4 + q_c + (q_arith - 1) * w_4_shift
     * = 0
     *
     * w_l + w_4 - w_l_shift + q_m = 0
     *
     * The problem that q_m is used both in both equations can be dealt with by appropriately changing selector values
     * at the next gate. Then we can treat (q_arith - 1) as a simulated q_6 selector and scale q_m to handle (q_arith -
     * 3) at product.
     *
     * The relation is
     * defined as C(in(X)...) = q_arith * [ -1/2(q_arith - 3)(q_m * w_r * w_l) + (q_l * w_l) + (q_r * w_r) +
     * (q_o * w_o) + (q_4 * w_4) + q_c + (q_arith - 1)w_4_shift ]
     *
     *    q_arith *
     *      (q_arith - 2) * (q_arith - 1) * (w_l + w_4 - w_l_shift + q_m)
     *
     * @param evals transformed to `evals + C(in(X)...)*scaling_factor`
     * @param in an std::array containing the fully extended Univariate edges.
     * @param parameters contains beta, gamma, and public_input_delta, ....
     * @param scaling_factor optional term to scale the evaluation before adding to evals.
     */
    template <typename ContainerOverSubrelations, typename AllEntities, typename Parameters>
    inline static void accumulate(ContainerOverSubrelations& evals,
                                  const AllEntities& in,
                                  const Parameters&,
                                  const FF& scaling_factor)
    {
        BB_OP_COUNT_TIME_NAME("Arithmetic::accumulate");
        {
            using Accumulator = std::tuple_element_t<0, ContainerOverSubrelations>;
            using View = typename Accumulator::View;
            auto w_l = View(in.w_l);
            auto w_r = View(in.w_r);
            auto w_o = View(in.w_o);
            auto w_4 = View(in.w_4);
            auto w_4_shift = View(in.w_4_shift);
            auto q_m = View(in.q_m);
            auto q_l = View(in.q_l);
            auto q_r = View(in.q_r);
            auto q_o = View(in.q_o);
            auto q_4 = View(in.q_4);
            auto q_c = View(in.q_c);
            auto q_arith = View(in.q_arith);

            static const FF neg_half = FF(-2).invert();

            auto tmp = (q_arith - 3) * (q_m * w_r * w_l) * neg_half;
            tmp += (q_l * w_l) + (q_r * w_r) + (q_o * w_o) + (q_4 * w_4) + q_c;
            tmp += (q_arith - 1) * w_4_shift;
            tmp *= q_arith;
            // 10 muls
            tmp *= scaling_factor; // WORKTODO: mul by pow_i(beta) done _could_ be done later...
            std::get<0>(evals) += tmp;
        }
        {
            using Accumulator = std::tuple_element_t<1, ContainerOverSubrelations>;
            using View = typename Accumulator::View;
            auto w_l = View(in.w_l);
            auto w_4 = View(in.w_4);
            auto w_l_shift = View(in.w_l_shift);
            auto q_m = View(in.q_m);
            auto q_arith = View(in.q_arith);

            auto tmp = w_l + w_4 - w_l_shift + q_m;
            tmp *= (q_arith - 2);
            tmp *= (q_arith - 1);
            tmp *= q_arith;
            tmp *= scaling_factor;
            std::get<1>(evals) += tmp;
        };
    };
};

template <typename FF_>
class UltraArithmeticRelationImpl<FF_, /* HOMOGENIZED */ true>
    : public UltraArithmeticRelationImplBase<FF_, /* HOMOGENIZED */ true> {
  public:
    using FF = FF_;
    using Base = UltraArithmeticRelationImplBase<FF_, /* HOMOGENIZED */ true>;

    static constexpr auto HOMOGENINZED_ADJUSTMENTS =
        compute_homogenized_subrelation_lengths(Base::HOMOGENIZED_LENGTH, Base::SUBRELATION_PARTIAL_LENGTHS);

    static constexpr std::array<size_t, 2> SUBRELATION_PARTIAL_LENGTHS{
        7, // primary arithmetic sub-relation
        7  // secondary arithmetic sub-relation
    };

    template <typename T, typename S> static T bad_pow(const S& x, const size_t d)
    {
        T result{ x };
        for (size_t idx = 1; idx < d; idx++) {
            result *= x;
        }
        return result;
    };

    /**
     * @brief The polynomial relation that checks whether a prover has provided a valid arithmetic gate.
     * @details This is the homogenization of the relation.
     *
     * @param evals transformed to `evals + C(in(X)...)*scaling_factor`
     * @param in an std::array containing the fully extended Univariate edges.
     * @param scaling_factor optional term to scale the evaluation before adding to evals.
     */
    template <typename ContainerOverSubrelations, typename AllEntities, typename Parameters>
    inline static void accumulate(ContainerOverSubrelations& evals,
                                  const AllEntities& in,
                                  const Parameters&,
                                  const FF& scaling_factor)
    {
        // WORKTODO: There is now no reason not to fuse these. In fact it would save muls by the homogenizer.

        BB_OP_COUNT_TIME_NAME("Arithmetic::accumulate");
        {
            using Accumulator = std::tuple_element_t<0, ContainerOverSubrelations>;
            using View = typename Accumulator::View;
            auto w_l = View(in.w_l);
            auto w_r = View(in.w_r);
            auto w_o = View(in.w_o);
            auto w_4 = View(in.w_4);
            auto w_4_shift = View(in.w_4_shift);
            auto q_m = View(in.q_m);
            auto q_l = View(in.q_l);
            auto q_r = View(in.q_r);
            auto q_o = View(in.q_o);
            auto q_4 = View(in.q_4);
            auto q_c = View(in.q_c);
            auto q_arith = View(in.q_arith);

            static const FF neg_half = FF(-2).invert();

            auto hom = View(in.homogenizer);
            auto term = q_c - w_4_shift;
            term *= hom;
            term += (w_l * q_l) + (w_r * q_r) + (w_o * q_o) + (w_4 * q_4) + (w_4_shift * q_arith);
            term *= hom;
            auto tmp = w_l * w_r * q_m * neg_half;
            term -= tmp + tmp + tmp;
            term *= hom;
            term += tmp * q_arith;
            term *= q_arith;
            // 13 muls
            static constexpr size_t HOMOGENIZER_POWER = std::get<0>(HOMOGENINZED_ADJUSTMENTS);
            if constexpr (HOMOGENIZER_POWER > 0) {
                term *= bad_pow<Accumulator, View>(hom, HOMOGENIZER_POWER);
            }
            term *= scaling_factor;
            std::get<0>(evals) += term;
        }
        {
            using Accumulator = std::tuple_element_t<1, ContainerOverSubrelations>;
            using View = typename Accumulator::View;
            auto w_l = View(in.w_l);
            auto w_4 = View(in.w_4);
            auto w_l_shift = View(in.w_l_shift);
            auto q_m = View(in.q_m);
            auto q_arith = View(in.q_arith);

            auto hom = View(in.homogenizer);

            auto tmp = (w_l + w_4 - w_l_shift + q_m) * q_arith;
            auto prod = q_arith * hom;
            auto term = tmp * (q_arith * q_arith - prod - prod - prod);
            tmp += tmp;
            tmp *= hom.sqr();
            term += tmp;
            static constexpr size_t HOMOGENIZER_POWER = std::get<1>(HOMOGENINZED_ADJUSTMENTS);
            if constexpr (HOMOGENIZER_POWER > 0) {
                term *= bad_pow<Accumulator, View>(hom, HOMOGENIZER_POWER);
            }
            term *= scaling_factor;
            std::get<1>(evals) += term;
        };
    };
};

template <typename FF, bool HOMOGENIZED = false>
using UltraArithmeticRelation = Relation<UltraArithmeticRelationImpl<FF, HOMOGENIZED>>;
} // namespace bb