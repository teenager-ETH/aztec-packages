mod lib;
mod state;
mod test;

use dep::aztec::macros::aztec;

/// ## Overview
/// This contract demonstrates how to implement an **Automated Market Maker (AMM)** that maintains **public state**
/// while still achieving **identity privacy**. However, it does **not provide function privacy**:
/// - Anyone can observe **what actions** were performed.
/// - All amounts involved are visible, but **who** performed the action remains private.
///
/// **Note:**
/// This is purely a demonstration. The **Aztec team** does not consider this the optimal design for building a DEX.
///
/// ## Reentrancy Guard Considerations
///
/// ### 1. Private Functions:
/// Reentrancy protection is typically necessary if entering an intermediate state that is only valid when
/// the action completes uninterrupted. This follows the **Checks-Effects-Interactions** pattern.
///
/// - In this contract, **private functions** do not introduce intermediate states.
/// - All operations will be fully executed in **public** without needing intermediate checks.
///
/// ### 2. Public Functions:
/// No **reentrancy guard** is required for public functions because:
/// - All public functions are marked as **internal** with a **single callsite** - from a private function.
/// - Public functions **cannot call private functions**, eliminating the risk of reentering into them from private.
/// - Since public functions are internal-only, **external contracts cannot access them**, ensuring no external
///   contract can trigger a reentrant call. This eliminates the following attack vector:
///   `AMM.private_fn --> AMM.public_fn --> ExternalContract.fn --> AMM.public_fn`.
#[aztec]
contract AMM {
    use crate::{lib::{get_amount_in, get_amount_out, get_amounts_to_add}, state::State};
    use dep::aztec::{
        macros::{
            events::event,
            functions::{initializer, internal, private, public, view},
            storage::storage,
        },
        prelude::{AztecAddress, SharedImmutable},
    };
    use dep::token::Token;

    #[storage]
    struct Storage<Context> {
        // The following is only needed in private but we use ShareImmutable here instead of PrivateImmutable because
        // the value can be publicly known and SharedImmutable provides us with a better devex here because we don't
        // have to bother with sharing the note between pixies of users.
        state: SharedImmutable<State, Context>,
    }

    /// Amount of liquidity which gets locked token_contract0l when liquidity is provided for the first ttoken_contract0purpose
    /// is to prevent the pool from ever emptying which could lead to undefined behavior.
    global MINIMUM_LIQUIDITY = U128::from_integer(1000);
    // We set it to 9 times the minimum liquidity. That way the first LP gets 90% of the value of his deposit.
    global INITIAL_LIQUIDITY = U128::from_integer(9000);

    // Note: Since we don't have inheritance it seems the easiest to deploy the standard token and use it as
    // a liquidity tracking contract. This contract would be an admin of the liquidity contract.
    // TODO(#9480): Either deploy the liquidity contract in the constructor or verify it that it corresponds to what
    // this contract expects.
    #[public]
    #[initializer]
    fn constructor(token0: AztecAddress, token1: AztecAddress, liquidity_token: AztecAddress) {
        storage.state.initialize(State { token0, token1, liquidity_token });
    }

    /// Privately adds liquidity to the pool (identity of liquidity provider not revealed). `amount0_desired`
    /// and `amount1_desired` are the amounts of tokens we ideally want to add. `amount0_min` and `amount1_min`
    /// are the minimum amounts we are willing to add. `nonce` can be arbitrary non-zero value and it's here to
    /// isolate authwits to this specific call.
    #[private]
    fn add_liquidity(
        amount0_desired: Field,
        amount1_desired: Field,
        amount0_min: Field,
        amount1_min: Field,
        nonce: Field,
    ) {
        // TODO(#8271): Type the args as U128 and nuke these ugly casts
        let amount0_desired = U128::from_integer(amount0_desired);
        let amount1_desired = U128::from_integer(amount1_desired);

        assert(
            amount0_desired > U128::zero() & amount1_desired > U128::zero(),
            "INSUFFICIENT_INPUT_AMOUNTS",
        );

        let state = storage.state.read_private();

        let token0 = Token::at(state.token0);
        let token1 = Token::at(state.token1);
        let liquidity_token = Token::at(state.liquidity_token);

        // We transfer the desired amounts of tokens to this contract.
        token0
            .transfer_to_public(
                context.msg_sender(),
                context.this_address(),
                amount0_desired.to_integer(),
                nonce,
            )
            .call(&mut context);
        token1
            .transfer_to_public(
                context.msg_sender(),
                context.this_address(),
                amount1_desired.to_integer(),
                nonce,
            )
            .call(&mut context);
    }
}
