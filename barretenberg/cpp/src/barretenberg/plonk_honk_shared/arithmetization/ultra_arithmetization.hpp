#pragma once

#include "barretenberg/common/ref_vector.hpp"
#include "barretenberg/numeric/bitop/get_msb.hpp"
#include "barretenberg/plonk_honk_shared/arithmetization/arithmetization.hpp"

namespace bb {

template <typename FF_> class UltraArith {

    /**
     * @brief Defines the circuit block types for the Ultra arithmetization
     * @note Its useful to define this as a template since it is used to actually store gate data (T = UltraTraceBlock)
     * but also to store corresponding block sizes (T = uint32_t) for the structured trace or dynamic block size
     * tracking in ClientIvc.
     *
     * @tparam T
     */
    template <typename T> struct UltraTraceBlocks {
        T pub_inputs;
        T arithmetic;
        T delta_range;
        T elliptic;
        T aux;
        T lookup;
        T poseidon2_external;
        T poseidon2_internal;
        T overflow;

        auto get()
        {
            return RefArray{ pub_inputs, arithmetic,         delta_range,        elliptic, aux,
                             lookup,     poseidon2_external, poseidon2_internal, overflow };
        }

        auto get_gate_blocks()
        {
            return RefArray{ arithmetic, delta_range, elliptic, aux, lookup, poseidon2_external, poseidon2_internal };
        }

        bool operator==(const UltraTraceBlocks& other) const = default;
    };

    // An arbitrary but small-ish structuring that can be used for generic unit testing with non-trivial circuits
    struct SmallTestStructuredBlockSizes : public UltraTraceBlocks<uint32_t> {
        SmallTestStructuredBlockSizes()
        {
            const uint32_t FIXED_SIZE = 1 << 10;
            this->pub_inputs = FIXED_SIZE;
            this->arithmetic = FIXED_SIZE;
            this->delta_range = FIXED_SIZE;
            this->elliptic = FIXED_SIZE;
            this->aux = FIXED_SIZE;
            this->lookup = FIXED_SIZE;
            this->poseidon2_external = FIXED_SIZE;
            this->poseidon2_internal = FIXED_SIZE;
            this->overflow = 0;
        }
    };

  public:
    static constexpr size_t NUM_WIRES = 4;
    static constexpr size_t NUM_SELECTORS = 13;
    using FF = FF_;

    class UltraTraceBlock : public ExecutionTraceBlock<FF, NUM_WIRES, NUM_SELECTORS> {
        using SelectorType = ExecutionTraceBlock<FF, NUM_WIRES, NUM_SELECTORS>::SelectorType;

      public:
        void populate_wires(const uint32_t& idx_1, const uint32_t& idx_2, const uint32_t& idx_3, const uint32_t& idx_4)
        {
#ifdef CHECK_CIRCUIT_STACKTRACES
            this->stack_traces.populate();
#endif
            this->tracy_gate();
            this->wires[0].emplace_back(idx_1);
            this->wires[1].emplace_back(idx_2);
            this->wires[2].emplace_back(idx_3);
            this->wires[3].emplace_back(idx_4);
        }

        auto& w_l() { return std::get<0>(this->wires); };
        auto& w_r() { return std::get<1>(this->wires); };
        auto& w_o() { return std::get<2>(this->wires); };
        auto& w_4() { return std::get<3>(this->wires); };

        auto& q_m() { return this->selectors[0]; };
        auto& q_c() { return this->selectors[1]; };
        auto& q_1() { return this->selectors[2]; };
        auto& q_2() { return this->selectors[3]; };
        auto& q_3() { return this->selectors[4]; };
        auto& q_4() { return this->selectors[5]; };
        auto& q_arith() { return this->selectors[6]; };
        auto& q_delta_range() { return this->selectors[7]; };
        auto& q_elliptic() { return this->selectors[8]; };
        auto& q_aux() { return this->selectors[9]; };
        auto& q_lookup_type() { return this->selectors[10]; };
        auto& q_poseidon2_external() { return this->selectors[11]; };
        auto& q_poseidon2_internal() { return this->selectors[12]; };

        RefVector<SelectorType> get_gate_selectors()
        {
            return { q_arith(),      q_delta_range(),        q_elliptic(),
                     q_aux(),        q_poseidon2_external(), q_poseidon2_internal(),
                     q_lookup_type() };
        }
    };

    struct TraceBlocks : public UltraTraceBlocks<UltraTraceBlock> {

        bool has_overflow = false;

        TraceBlocks()
        {
            this->aux.has_ram_rom = true;
            this->pub_inputs.is_pub_inputs = true;
        }

        // Set fixed block sizes for use in structured trace
        void set_fixed_block_sizes(TraceSettings settings)
        {
            UltraTraceBlocks<uint32_t> fixed_block_sizes{}; // zero initialized

            switch (settings.structure) {
            case TraceStructure::NONE:
                break;
            // We don't use Ultra in ClientIvc so no need for anything other than sizing for simple unit tests
            case TraceStructure::TINY_TEST:
            case TraceStructure::SMALL_TEST:
            case TraceStructure::CLIENT_IVC_BENCH:
            case TraceStructure::E2E_FULL_TEST:
                fixed_block_sizes = SmallTestStructuredBlockSizes();
                break;
            }
            for (auto [block, size] : zip_view(this->get(), fixed_block_sizes.get())) {
                block.set_fixed_size(size);
            }
            this->overflow.set_fixed_size(settings.overflow_capacity);
        }

        void compute_offsets(bool is_structured)
        {
            uint32_t offset = 1; // start at 1 because the 0th row is unused for selectors for Honk
            for (auto& block : this->get()) {
                block.trace_offset = offset;
                offset += block.get_fixed_size(is_structured);
            }
        }

        auto get()
        {
            return RefArray{ this->pub_inputs, this->arithmetic, this->delta_range,        this->elliptic,
                             this->aux,        this->lookup,     this->poseidon2_external, this->poseidon2_internal,
                             this->overflow };
        }

        void summarize() const
        {
            info("Gate blocks summary:");
            info("pub inputs :\t", this->pub_inputs.size());
            info("arithmetic :\t", this->arithmetic.size());
            info("delta range:\t", this->delta_range.size());
            info("elliptic   :\t", this->elliptic.size());
            info("auxiliary  :\t", this->aux.size());
            info("lookups    :\t", this->lookup.size());
            info("poseidon ext  :\t", this->poseidon2_external.size());
            info("poseidon int  :\t", this->poseidon2_internal.size());
            info("overflow :\t", this->overflow.size());
        }

        size_t get_structured_dyadic_size()
        {
            size_t total_size = 1; // start at 1 because the 0th row is unused for selectors for Honk
            for (auto block : this->get()) {
                total_size += block.get_fixed_size();
            }

            auto log2_n = static_cast<size_t>(numeric::get_msb(total_size));
            if ((1UL << log2_n) != (total_size)) {
                ++log2_n;
            }
            return 1UL << log2_n;
        }

        bool operator==(const TraceBlocks& other) const = default;
    };

    // Note: These are needed for Plonk only (for poly storage in a std::map). Must be in same order as above struct.
    inline static const std::vector<std::string> selector_names = { "q_m",
                                                                    "q_c",
                                                                    "q_1",
                                                                    "q_2",
                                                                    "q_3",
                                                                    "q_4",
                                                                    "q_arith",
                                                                    "q_sort",
                                                                    "q_elliptic",
                                                                    "q_aux",
                                                                    "table_type",
                                                                    "q_poseidon2_external",
                                                                    "q_poseidon2_internal" };
};

} // namespace bb