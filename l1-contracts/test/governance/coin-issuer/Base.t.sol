// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.27;

import {Test} from "forge-std/Test.sol";

import {IMintableERC20} from "@aztec/governance/interfaces/IMintableERC20.sol";

import {TestERC20} from "@aztec/mock/TestERC20.sol";
import {CoinIssuer} from "@aztec/governance/CoinIssuer.sol";

contract CoinIssuerBase is Test {
  IMintableERC20 internal token;

  CoinIssuer internal nom;

  function _deploy(uint256 _rate) internal {
    token = IMintableERC20(address(new TestERC20()));
    nom = new CoinIssuer(token, _rate, address(this));
  }
}