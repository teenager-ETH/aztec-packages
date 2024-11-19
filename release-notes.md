:robot: I have created a release *beep* *boop*
---


<details><summary>aztec-package: 0.63.0</summary>

## [0.63.0](https://github.com/AztecProtocol/aztec-packages/compare/aztec-package-v0.62.0...aztec-package-v0.63.0) (2024-11-19)


### Features

* Extract gossipsub / discv5 dependency gauge prometheus metrics ([#9710](https://github.com/AztecProtocol/aztec-packages/issues/9710)) ([58e75cd](https://github.com/AztecProtocol/aztec-packages/commit/58e75cdcc13de19bf5c1aedf7e66ce16e8cd4aaf))


### Bug Fixes

* Telemetry stopping on shutdown ([#9740](https://github.com/AztecProtocol/aztec-packages/issues/9740)) ([23b8d8b](https://github.com/AztecProtocol/aztec-packages/commit/23b8d8b15e2a8f5473e6bfedf62e9f1b35c9919c))


### Miscellaneous

* Clean up data configuration ([#9973](https://github.com/AztecProtocol/aztec-packages/issues/9973)) ([b660739](https://github.com/AztecProtocol/aztec-packages/commit/b66073986827731ce59e6f962ff1fb051677a094))
* Move epoch and slot durations to config ([#9861](https://github.com/AztecProtocol/aztec-packages/issues/9861)) ([bfd4f2c](https://github.com/AztecProtocol/aztec-packages/commit/bfd4f2ce49393c4629563c07a89f19ebaf9aaab2))
* Revert "chore: Validate RPC inputs" ([#9875](https://github.com/AztecProtocol/aztec-packages/issues/9875)) ([dd83d52](https://github.com/AztecProtocol/aztec-packages/commit/dd83d520c9925f00de155bddf0cf95852c971995))
* Token partial notes refactor pt. 2 - bridging ([#9600](https://github.com/AztecProtocol/aztec-packages/issues/9600)) ([d513099](https://github.com/AztecProtocol/aztec-packages/commit/d51309954ab4a5ae1c829c86185b02c156baf3c7))
* Validate RPC inputs ([#9672](https://github.com/AztecProtocol/aztec-packages/issues/9672)) ([6554122](https://github.com/AztecProtocol/aztec-packages/commit/6554122bdcd6d3840d03fdf1e7896f3961021e1f)), closes [#9455](https://github.com/AztecProtocol/aztec-packages/issues/9455)
* Validate RPC inputs reloaded ([#9878](https://github.com/AztecProtocol/aztec-packages/issues/9878)) ([70ab7c4](https://github.com/AztecProtocol/aztec-packages/commit/70ab7c4a905a33b518c773aa244f4a85064cfde3))
</details>

<details><summary>barretenberg.js: 0.63.0</summary>

## [0.63.0](https://github.com/AztecProtocol/aztec-packages/compare/barretenberg.js-v0.62.0...barretenberg.js-v0.63.0) (2024-11-19)


###   BREAKING CHANGES

* Remove `recursive` from ACIR format; add them to API and CLI ([#9479](https://github.com/AztecProtocol/aztec-packages/issues/9479))

### Features

* Bb.js tests of ClientIVC ([#9412](https://github.com/AztecProtocol/aztec-packages/issues/9412)) ([90696cd](https://github.com/AztecProtocol/aztec-packages/commit/90696cd0e126d7db3c4ef396ada4bddd3ac0de73))
* Constrain App function VKs ([#9756](https://github.com/AztecProtocol/aztec-packages/issues/9756)) ([ae7cfe7](https://github.com/AztecProtocol/aztec-packages/commit/ae7cfe72b5c528fb533040c6da62c9b21f542f8b))
* Naive attempt to bind the honk solidity verifier function to the ts interface ([#9432](https://github.com/AztecProtocol/aztec-packages/issues/9432)) ([fc27eaf](https://github.com/AztecProtocol/aztec-packages/commit/fc27eafaaa471e888805c785066f361f0da15298))


### Bug Fixes

* Remove extra `number` from return type of `acirGetCircuitSizes` ([#9493](https://github.com/AztecProtocol/aztec-packages/issues/9493)) ([1aef553](https://github.com/AztecProtocol/aztec-packages/commit/1aef553d0991fca9940ed0521dab246de08a0a77))


### Miscellaneous

* Remove `recursive` from ACIR format; add them to API and CLI ([#9479](https://github.com/AztecProtocol/aztec-packages/issues/9479)) ([d2a84c4](https://github.com/AztecProtocol/aztec-packages/commit/d2a84c405291b5a04576c133b0e74327d9092db1))
</details>

<details><summary>aztec-packages: 0.63.0</summary>

## [0.63.0](https://github.com/AztecProtocol/aztec-packages/compare/aztec-packages-v0.62.0...aztec-packages-v0.63.0) (2024-11-19)


###   BREAKING CHANGES

* remove mimc from stdlib (https://github.com/noir-lang/noir/pull/6402)
* **avm:** byte indexed PC ([#9582](https://github.com/AztecProtocol/aztec-packages/issues/9582))
* Remove `recursive` from ACIR format; add them to API and CLI ([#9479](https://github.com/AztecProtocol/aztec-packages/issues/9479))

### Features

* Add bash test for transaction profiler; improve profiler output ([#9931](https://github.com/AztecProtocol/aztec-packages/issues/9931)) ([e4c3f4b](https://github.com/AztecProtocol/aztec-packages/commit/e4c3f4baf932e304151d022767b38c5dcfff35b2))
* Add canPruneAtTime ([#9751](https://github.com/AztecProtocol/aztec-packages/issues/9751)) ([0cb0343](https://github.com/AztecProtocol/aztec-packages/commit/0cb034371ad413594c60909bb4613b8f0cbb0910))
* Add epoch config ([#9884](https://github.com/AztecProtocol/aztec-packages/issues/9884)) ([7971974](https://github.com/AztecProtocol/aztec-packages/commit/79719748602571779e93084828603436bdf06b28))
* Add gate count profiling for transactions  ([#9632](https://github.com/AztecProtocol/aztec-packages/issues/9632)) ([582398f](https://github.com/AztecProtocol/aztec-packages/commit/582398fb50f362ed04dcaf7aaca946f248403a3b))
* Add miscellaneous block to handle structure trace overflow ([#9733](https://github.com/AztecProtocol/aztec-packages/issues/9733)) ([80f9cc4](https://github.com/AztecProtocol/aztec-packages/commit/80f9cc47a12ba3cd8ca2a8d1fb516fed3f4372ed))
* Add Origin Tags to cycle group ([#9879](https://github.com/AztecProtocol/aztec-packages/issues/9879)) ([de6564e](https://github.com/AztecProtocol/aztec-packages/commit/de6564e8374d6d546e0fccbb0429d6c12e828ab3))
* Add persisted database of proving jobs ([#9942](https://github.com/AztecProtocol/aztec-packages/issues/9942)) ([6a16a4b](https://github.com/AztecProtocol/aztec-packages/commit/6a16a4bb92bd3f1e31b53e09b76fb92488245ef5)), closes [#9532](https://github.com/AztecProtocol/aztec-packages/issues/9532)
* Adding tags to encrypted logs ([#9566](https://github.com/AztecProtocol/aztec-packages/issues/9566)) ([64ae6b1](https://github.com/AztecProtocol/aztec-packages/commit/64ae6b177ab565c73b5c8e2ccb223766235054dd))
* **avm:** Byte indexed PC ([#9582](https://github.com/AztecProtocol/aztec-packages/issues/9582)) ([29724f3](https://github.com/AztecProtocol/aztec-packages/commit/29724f3f2db5a3b6e399e54a9a84af8686807fb6))
* **avm:** Ephemeral avm tree ([#9798](https://github.com/AztecProtocol/aztec-packages/issues/9798)) ([41743d0](https://github.com/AztecProtocol/aztec-packages/commit/41743d07b0db26f253c969e58469672f988651c4))
* **avm:** Gas specific range check ([#9874](https://github.com/AztecProtocol/aztec-packages/issues/9874)) ([1a9c5ce](https://github.com/AztecProtocol/aztec-packages/commit/1a9c5ce385c7db2e488831dcd7dc3bedfc02f74a))
* **avm:** Hinting merkle trees ([#9658](https://github.com/AztecProtocol/aztec-packages/issues/9658)) ([8d49e59](https://github.com/AztecProtocol/aztec-packages/commit/8d49e5963092548d31a901a693a1653d3151d114))
* **avm:** Mem specific range check ([#9828](https://github.com/AztecProtocol/aztec-packages/issues/9828)) ([ada3e3a](https://github.com/AztecProtocol/aztec-packages/commit/ada3e3aba6141411a8ca931f45cc2b9b7027585e))
* **avm:** Non-field sized cmp circuit ops ([#9895](https://github.com/AztecProtocol/aztec-packages/issues/9895)) ([59376d4](https://github.com/AztecProtocol/aztec-packages/commit/59376d499278eec3ddf4ee9fbb64ba2c83f9b8df))
* **avm:** Remove rethrowable reverts hack ([#9752](https://github.com/AztecProtocol/aztec-packages/issues/9752)) ([2ab33e7](https://github.com/AztecProtocol/aztec-packages/commit/2ab33e7f741f51905542cc4f646f2451454a770b))
* **avm:** Simulator enforces integral tag for DIV and field tag for FDIV ([#9944](https://github.com/AztecProtocol/aztec-packages/issues/9944)) ([cebcc3d](https://github.com/AztecProtocol/aztec-packages/commit/cebcc3d74e229e28f8a139fee3a2bc94c4e45f2f))
* **avm:** Tag checking, raising errors and stop execution ([#9831](https://github.com/AztecProtocol/aztec-packages/issues/9831)) ([eac5fb5](https://github.com/AztecProtocol/aztec-packages/commit/eac5fb5f30997364bf45262f898cfeedb97b1a71)), closes [#9745](https://github.com/AztecProtocol/aztec-packages/issues/9745)
* Aztec multi cloud deployment ([#9980](https://github.com/AztecProtocol/aztec-packages/issues/9980)) ([d29bcf6](https://github.com/AztecProtocol/aztec-packages/commit/d29bcf6ef6d028142dff8c578b1817fe7561a3ab))
* Bb.js tests of ClientIVC ([#9412](https://github.com/AztecProtocol/aztec-packages/issues/9412)) ([90696cd](https://github.com/AztecProtocol/aztec-packages/commit/90696cd0e126d7db3c4ef396ada4bddd3ac0de73))
* Change definition of lagrange last ([#9916](https://github.com/AztecProtocol/aztec-packages/issues/9916)) ([f566503](https://github.com/AztecProtocol/aztec-packages/commit/f566503377298681ce8f1d9d9b8c3c026825e2a2))
* **ci:** Add report of Brillig opcodes executed (https://github.com/noir-lang/noir/pull/6396) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Constify eccvm and translator ([#9661](https://github.com/AztecProtocol/aztec-packages/issues/9661)) ([c95e5fd](https://github.com/AztecProtocol/aztec-packages/commit/c95e5fd5606b7f14b1e2e43ecc770d5f22d294a0))
* Constrain App function VKs ([#9756](https://github.com/AztecProtocol/aztec-packages/issues/9756)) ([ae7cfe7](https://github.com/AztecProtocol/aztec-packages/commit/ae7cfe72b5c528fb533040c6da62c9b21f542f8b))
* **deploys:** OTEL_RESOURCE_ATTRIBUTES ([#9642](https://github.com/AztecProtocol/aztec-packages/issues/9642)) ([86b2490](https://github.com/AztecProtocol/aztec-packages/commit/86b249022167762fb9558aedf579f5648097592a))
* **docs:** Add Sandbox PXE proving doc ([#9815](https://github.com/AztecProtocol/aztec-packages/issues/9815)) ([9de9e4d](https://github.com/AztecProtocol/aztec-packages/commit/9de9e4dd5ede3de8edd4b89a160d656d140a87f2))
* **docs:** Add transaction profiler docs ([#9932](https://github.com/AztecProtocol/aztec-packages/issues/9932)) ([74ed142](https://github.com/AztecProtocol/aztec-packages/commit/74ed1429f71342c8323aa690f06ba302dc270708))
* Domain separate block proposals and attestations ([#9842](https://github.com/AztecProtocol/aztec-packages/issues/9842)) ([82fd125](https://github.com/AztecProtocol/aztec-packages/commit/82fd12533fe4062c3ca7d49541e83877736463d4))
* Encode static error strings in the ABI ([#9552](https://github.com/AztecProtocol/aztec-packages/issues/9552)) ([1a41d42](https://github.com/AztecProtocol/aztec-packages/commit/1a41d42852ea2d7cdcb9f75387342783e1632b11))
* Ensure that generated ACIR is solvable (https://github.com/noir-lang/noir/pull/6415) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Extract gossipsub / discv5 dependency gauge prometheus metrics ([#9710](https://github.com/AztecProtocol/aztec-packages/issues/9710)) ([58e75cd](https://github.com/AztecProtocol/aztec-packages/commit/58e75cdcc13de19bf5c1aedf7e66ce16e8cd4aaf))
* Faster random sampling ([#9655](https://github.com/AztecProtocol/aztec-packages/issues/9655)) ([969a3f0](https://github.com/AztecProtocol/aztec-packages/commit/969a3f0b2d5bbce95126685b1a056f378a4c4d78))
* Faster randomness sampling for field elements ([#9627](https://github.com/AztecProtocol/aztec-packages/issues/9627)) ([b98e93f](https://github.com/AztecProtocol/aztec-packages/commit/b98e93f4befb985c72e8768f378face2dcc79810))
* Google Cloud Kubernetes cluster + AWS Firewall Rules ([#9915](https://github.com/AztecProtocol/aztec-packages/issues/9915)) ([b36c137](https://github.com/AztecProtocol/aztec-packages/commit/b36c1376ee009f3b1ac5003592cfd1185d17e1ed))
* Graph methods for circuit analysis (part 1) ([#7948](https://github.com/AztecProtocol/aztec-packages/issues/7948)) ([eeea55a](https://github.com/AztecProtocol/aztec-packages/commit/eeea55a39e9e1a417ddf79e44575420e5efcdfcf))
* Improve malformed test attribute error (https://github.com/noir-lang/noir/pull/6414) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Introduce avm circuit public inputs ([#9759](https://github.com/AztecProtocol/aztec-packages/issues/9759)) ([4660381](https://github.com/AztecProtocol/aztec-packages/commit/46603810b149ef7f03c220d11d6dfd395cf550e0))
* IPA Accumulation implementation ([#9494](https://github.com/AztecProtocol/aztec-packages/issues/9494)) ([1a935d0](https://github.com/AztecProtocol/aztec-packages/commit/1a935d091cfad0e4861ec840a59372fdf177518d))
* IPA Accumulator in Builder ([#9846](https://github.com/AztecProtocol/aztec-packages/issues/9846)) ([8e74cd0](https://github.com/AztecProtocol/aztec-packages/commit/8e74cd09a8b65c3903c91197d599e722518ab315))
* Lock to propose ([#9430](https://github.com/AztecProtocol/aztec-packages/issues/9430)) ([538cd47](https://github.com/AztecProtocol/aztec-packages/commit/538cd4717d3e1e6cac6366eddc074b54882728ab)), closes [#9348](https://github.com/AztecProtocol/aztec-packages/issues/9348)
* Mega memory benchmarks ([#9858](https://github.com/AztecProtocol/aztec-packages/issues/9858)) ([7e587d6](https://github.com/AztecProtocol/aztec-packages/commit/7e587d6d43cc28174d807c255f5270212a0b1c98))
* Mega zk features ([#9774](https://github.com/AztecProtocol/aztec-packages/issues/9774)) ([2096dc2](https://github.com/AztecProtocol/aztec-packages/commit/2096dc236c627cfd802ca05e0c9cb0ea6c441458))
* Mock data for IVC ([#9893](https://github.com/AztecProtocol/aztec-packages/issues/9893)) ([9325f6f](https://github.com/AztecProtocol/aztec-packages/commit/9325f6ff987022da1a4dabb771781cdc999af18e))
* Multicloud deployment using Terraform and Helm ([#9894](https://github.com/AztecProtocol/aztec-packages/issues/9894)) ([6239438](https://github.com/AztecProtocol/aztec-packages/commit/62394380ea4714edcf570b443708c5fec8ffe879))
* Multiplier oracle ([#9902](https://github.com/AztecProtocol/aztec-packages/issues/9902)) ([6456ec9](https://github.com/AztecProtocol/aztec-packages/commit/6456ec9f8ede362f33ba3774076330ffd1815634)), closes [#9804](https://github.com/AztecProtocol/aztec-packages/issues/9804)
* Naive attempt to bind the honk solidity verifier function to the ts interface ([#9432](https://github.com/AztecProtocol/aztec-packages/issues/9432)) ([fc27eaf](https://github.com/AztecProtocol/aztec-packages/commit/fc27eafaaa471e888805c785066f361f0da15298))
* Nargo command to generate shell completions (https://github.com/noir-lang/noir/pull/6413) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* New proving broker implementation ([#9400](https://github.com/AztecProtocol/aztec-packages/issues/9400)) ([da711bf](https://github.com/AztecProtocol/aztec-packages/commit/da711bf201bde1921f46728e996ddb88f0e18708))
* Origin Tags part 3 (Memory) ([#9758](https://github.com/AztecProtocol/aztec-packages/issues/9758)) ([d77e473](https://github.com/AztecProtocol/aztec-packages/commit/d77e473219d1628b2045100a55c4073f9fa32c25))
* Parallelize DIE pass ([#9933](https://github.com/AztecProtocol/aztec-packages/issues/9933)) ([2d321fa](https://github.com/AztecProtocol/aztec-packages/commit/2d321faa66e5a17d159c298a733e8b8560affe19))
* Process tagged logs ([#9623](https://github.com/AztecProtocol/aztec-packages/issues/9623)) ([2fcf94e](https://github.com/AztecProtocol/aztec-packages/commit/2fcf94eb8b3b062119c5725fc8493879e69988ce))
* **profiler:** Add Brillig procedure info to debug artifact for more informative profiling (https://github.com/noir-lang/noir/pull/6385) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Prove openings of masking polynomials in ECCVM and Translator ([#9726](https://github.com/AztecProtocol/aztec-packages/issues/9726)) ([f1cdc2d](https://github.com/AztecProtocol/aztec-packages/commit/f1cdc2d981ef01fda9b14c6803e014e546b71b66))
* Recursive verifier for decider and last folding proof ([#9626](https://github.com/AztecProtocol/aztec-packages/issues/9626)) ([d7ee6e5](https://github.com/AztecProtocol/aztec-packages/commit/d7ee6e5cffba32ef141e717aeaf83f56a9af92b5))
* Remove mimc from stdlib (https://github.com/noir-lang/noir/pull/6402) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Remove note processor and trigger sync ([#9794](https://github.com/AztecProtocol/aztec-packages/issues/9794)) ([b6c3048](https://github.com/AztecProtocol/aztec-packages/commit/b6c3048b728beaffbbef80f3e4f598cd0beee4a2))
* Removed redundant scalar muls from the verifiers using shplemini ([#9392](https://github.com/AztecProtocol/aztec-packages/issues/9392)) ([e07cac7](https://github.com/AztecProtocol/aztec-packages/commit/e07cac7fee501a752d98ebf749f6cf31a3ff74af))
* Send G_0 in proof to reduce tube size ([#9766](https://github.com/AztecProtocol/aztec-packages/issues/9766)) ([9bc5a2f](https://github.com/AztecProtocol/aztec-packages/commit/9bc5a2f02852d6187a597612e8459ee305f3e198))
* Separate bytecode logs from unencrypted logs ([#9891](https://github.com/AztecProtocol/aztec-packages/issues/9891)) ([b12d3e4](https://github.com/AztecProtocol/aztec-packages/commit/b12d3e4c653cd8e4a7daf81b2c3412b417995ee0)), closes [#9590](https://github.com/AztecProtocol/aztec-packages/issues/9590)
* Sequencer is aware of slot progression ([#9767](https://github.com/AztecProtocol/aztec-packages/issues/9767)) ([86762a1](https://github.com/AztecProtocol/aztec-packages/commit/86762a123b5f0100a030ea5d48419eaa5644eb39))
* **spartan:** Run with reth --dev underneath ([#9797](https://github.com/AztecProtocol/aztec-packages/issues/9797)) ([89101ae](https://github.com/AztecProtocol/aztec-packages/commit/89101ae4dd0677e2064d0d22830c718bdd168961))
* Split up eccvm proof into two proofs ([#9914](https://github.com/AztecProtocol/aztec-packages/issues/9914)) ([37d7cd7](https://github.com/AztecProtocol/aztec-packages/commit/37d7cd784bc6dfe366d1eabc2b7be8cca4359f7b))
* Stop with HeapVector ([#9810](https://github.com/AztecProtocol/aztec-packages/issues/9810)) ([52ae4e1](https://github.com/AztecProtocol/aztec-packages/commit/52ae4e1710d07aca497de723294f7b7c0100b479))
* Sync from aztec-packages (https://github.com/noir-lang/noir/pull/6403) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* **telemetry:** Configurable collection time ([#9741](https://github.com/AztecProtocol/aztec-packages/issues/9741)) ([48969ce](https://github.com/AztecProtocol/aztec-packages/commit/48969cedd017ffd494753cc6968177c95e0e3174))
* Track active accumulator rows and leverage in IVC folding ([#9599](https://github.com/AztecProtocol/aztec-packages/issues/9599)) ([76328eb](https://github.com/AztecProtocol/aztec-packages/commit/76328ebe88fd1d9dbb041be8cc1692516ed7d2d2))
* Track world state db versions and wipe the state upon version change ([#9946](https://github.com/AztecProtocol/aztec-packages/issues/9946)) ([209d484](https://github.com/AztecProtocol/aztec-packages/commit/209d4849a19cf4c8c6429df81c55f0363c636b3c))
* Validator stateful set load balancers ([#9765](https://github.com/AztecProtocol/aztec-packages/issues/9765)) ([452a450](https://github.com/AztecProtocol/aztec-packages/commit/452a450a9f0cded04d3b91cda7a89c31f7dd24cd))
* Zk shplemini ([#9830](https://github.com/AztecProtocol/aztec-packages/issues/9830)) ([23ff518](https://github.com/AztecProtocol/aztec-packages/commit/23ff5186a4c8905bd35753c1e6536d3b5504a5f0))


### Bug Fixes

* Add set service name for otel in local ([#9644](https://github.com/AztecProtocol/aztec-packages/issues/9644)) ([b70b6f1](https://github.com/AztecProtocol/aztec-packages/commit/b70b6f10f1a809436bb1e2712c66b12ac98118d7))
* Adding configs for Otel namespace retention  ([#9734](https://github.com/AztecProtocol/aztec-packages/issues/9734)) ([af0bf27](https://github.com/AztecProtocol/aztec-packages/commit/af0bf27ef65f070f4a5f270d885ade1ef429166a))
* Aliases in path (https://github.com/noir-lang/noir/pull/6399) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* **avm:** Derive unencrypted log in test ([#9813](https://github.com/AztecProtocol/aztec-packages/issues/9813)) ([abdd912](https://github.com/AztecProtocol/aztec-packages/commit/abdd912bd0d3cf9a8e09339a3766c61eea712ede))
* Bench e2e jobs ([#9662](https://github.com/AztecProtocol/aztec-packages/issues/9662)) ([2bdfbed](https://github.com/AztecProtocol/aztec-packages/commit/2bdfbed896d5d806f09f69bb257b83008ddbf31c))
* Bench prover test ([#9856](https://github.com/AztecProtocol/aztec-packages/issues/9856)) ([6f10be3](https://github.com/AztecProtocol/aztec-packages/commit/6f10be359f8c6fede3cbad0a55362187e7f66f3c))
* **build:** L1-contracts .rebuild_patterns did not cover test files ([#9862](https://github.com/AztecProtocol/aztec-packages/issues/9862)) ([fccbb36](https://github.com/AztecProtocol/aztec-packages/commit/fccbb36cb5e44c9a2b54976ba4d8e42420ce1f65))
* Ci.yml, use correct runner ([#9824](https://github.com/AztecProtocol/aztec-packages/issues/9824)) ([3a49cfb](https://github.com/AztecProtocol/aztec-packages/commit/3a49cfb4d053f26f6f73f342c2c457bf18ae77d2))
* Deploy l2 contracts fails on 48 validator ([#9860](https://github.com/AztecProtocol/aztec-packages/issues/9860)) ([5be770f](https://github.com/AztecProtocol/aztec-packages/commit/5be770fe4aabae2c001b600ec9f73333d87c2905))
* Distinguish TypePath with and without turbofish (https://github.com/noir-lang/noir/pull/6404) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* **docs:** Add missing dependency in token tutorial ([#9845](https://github.com/AztecProtocol/aztec-packages/issues/9845)) ([e06b192](https://github.com/AztecProtocol/aztec-packages/commit/e06b192f3e17ca5c6fbc1ba13c29b46b022a7979))
* Don't crash sequencer when it is too slow ([#9790](https://github.com/AztecProtocol/aztec-packages/issues/9790)) ([5bae479](https://github.com/AztecProtocol/aztec-packages/commit/5bae479a363957686e8244d9ae6dbba09910d016))
* Don't take down runners with faulty runner check ([#10019](https://github.com/AztecProtocol/aztec-packages/issues/10019)) ([fc88517](https://github.com/AztecProtocol/aztec-packages/commit/fc88517a5b4340c387cc19c3f0530c6cd57ff51e))
* Earthly-ci in bench-e2e ([#9689](https://github.com/AztecProtocol/aztec-packages/issues/9689)) ([37473de](https://github.com/AztecProtocol/aztec-packages/commit/37473de09cc50b880238995aab830ba8a7cdf30c))
* Enable gerousia e2e test ([#9677](https://github.com/AztecProtocol/aztec-packages/issues/9677)) ([bf54da8](https://github.com/AztecProtocol/aztec-packages/commit/bf54da81e805cfbcf9ea76598b8da0246b5cf1dd)), closes [#9164](https://github.com/AztecProtocol/aztec-packages/issues/9164)
* Fix Alias and Error kinds (https://github.com/noir-lang/noir/pull/6426) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Fix bad merge ([#9892](https://github.com/AztecProtocol/aztec-packages/issues/9892)) ([b621603](https://github.com/AztecProtocol/aztec-packages/commit/b6216033b567e0d743e17c37754a20f9c893aa0e))
* Fix broken e2e_pending_note_hashes ([#9748](https://github.com/AztecProtocol/aztec-packages/issues/9748)) ([9d3b351](https://github.com/AztecProtocol/aztec-packages/commit/9d3b351d1ef79bce0fe0a9a06eacab75985ff5f2))
* Fix inclusion path ([#10034](https://github.com/AztecProtocol/aztec-packages/issues/10034)) ([29a9ae3](https://github.com/AztecProtocol/aztec-packages/commit/29a9ae3573fe1da63a2d6494a21266e20bbe22e4))
* Fix mac build by calling `count` on durations ([#9855](https://github.com/AztecProtocol/aztec-packages/issues/9855)) ([9978c97](https://github.com/AztecProtocol/aztec-packages/commit/9978c9742c7b2b27c9ba813ddb66125a0ca57e6b))
* Fix random for Mac users  ([#9670](https://github.com/AztecProtocol/aztec-packages/issues/9670)) ([bf5d62d](https://github.com/AztecProtocol/aztec-packages/commit/bf5d62d4332548ac7798085eb98cedea88131d9d))
* Fixing devcontainers to use the sandbox docker-compose file ([#9782](https://github.com/AztecProtocol/aztec-packages/issues/9782)) ([5246251](https://github.com/AztecProtocol/aztec-packages/commit/5246251a7a91874e2af5f8788aa29533c3cf77fe))
* Force inliner aggressiveness 0 in aztec nargo ([#9848](https://github.com/AztecProtocol/aztec-packages/issues/9848)) ([d880bd6](https://github.com/AztecProtocol/aztec-packages/commit/d880bd6c7031168d661e1de3738b28eda94b9424))
* Formatting ([#9979](https://github.com/AztecProtocol/aztec-packages/issues/9979)) ([a5aef86](https://github.com/AztecProtocol/aztec-packages/commit/a5aef86b97e55a39474cc5e0c4bb53b023cca8ea))
* Get_bench_jobs.sh ([#9737](https://github.com/AztecProtocol/aztec-packages/issues/9737)) ([199daeb](https://github.com/AztecProtocol/aztec-packages/commit/199daeb334c996feb13f1a850801e137e9bb2cca))
* Include 'master' version for aztec-up scripts ([#9940](https://github.com/AztecProtocol/aztec-packages/issues/9940)) ([d723e35](https://github.com/AztecProtocol/aztec-packages/commit/d723e3554248c204e823acd34ede99396ad86005))
* Include revertdata in Avm simulation errors for failures in nonrevertible ([#9744](https://github.com/AztecProtocol/aztec-packages/issues/9744)) ([5f85f5c](https://github.com/AztecProtocol/aztec-packages/commit/5f85f5c35781b286f879382315d8756867ad325b))
* Limit max block size ([#9757](https://github.com/AztecProtocol/aztec-packages/issues/9757)) ([5c5be5c](https://github.com/AztecProtocol/aztec-packages/commit/5c5be5c57d364356e4d591eeb5da0246b339db7d))
* **logs:** DEBUG env var considered unset if '' ([#9657](https://github.com/AztecProtocol/aztec-packages/issues/9657)) ([cb23cd3](https://github.com/AztecProtocol/aztec-packages/commit/cb23cd3c04263427ac1e9ff738002f5fa2fec287))
* Non state update from pub processor ([#9634](https://github.com/AztecProtocol/aztec-packages/issues/9634)) ([0d1e238](https://github.com/AztecProtocol/aztec-packages/commit/0d1e2389c483cc3a053e829d4451e97131cb8ac7))
* Numeric generic doesn't have a default type (https://github.com/noir-lang/noir/pull/6405) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Otel log batching ([#9729](https://github.com/AztecProtocol/aztec-packages/issues/9729)) ([9d8b43a](https://github.com/AztecProtocol/aztec-packages/commit/9d8b43ac16432676ecf0ffd08afec07b49f4027c))
* Path issue in k8s scripts ([#9890](https://github.com/AztecProtocol/aztec-packages/issues/9890)) ([32a546c](https://github.com/AztecProtocol/aztec-packages/commit/32a546cbabee6570a3e84bbd15cf0ab3dd58f9a3))
* Provernode needs to reference pod ip ([#9650](https://github.com/AztecProtocol/aztec-packages/issues/9650)) ([4eef7e3](https://github.com/AztecProtocol/aztec-packages/commit/4eef7e3d2a1e0539438e3e1c818e7d6c8dd4fef5))
* Publish l1-contracts on NPM ([#10029](https://github.com/AztecProtocol/aztec-packages/issues/10029)) ([d2d7334](https://github.com/AztecProtocol/aztec-packages/commit/d2d7334bb2d888dbc710aa76fd363440329c8624))
* Re-enable p2p tests ([#9777](https://github.com/AztecProtocol/aztec-packages/issues/9777)) ([f4c6f0e](https://github.com/AztecProtocol/aztec-packages/commit/f4c6f0efaccbbf68ca3a27d61672aac4a0ba9f90))
* Reenable kind 4epochs ([#9699](https://github.com/AztecProtocol/aztec-packages/issues/9699)) ([90bd954](https://github.com/AztecProtocol/aztec-packages/commit/90bd954eba9227a25c8fb3d9fc8ccef932e4482c))
* Refactored log store to avoid multimaps ([#9903](https://github.com/AztecProtocol/aztec-packages/issues/9903)) ([6507a74](https://github.com/AztecProtocol/aztec-packages/commit/6507a74644276f5fe6966b5506d694a9961e4d8b))
* Remove extra `number` from return type of `acirGetCircuitSizes` ([#9493](https://github.com/AztecProtocol/aztec-packages/issues/9493)) ([1aef553](https://github.com/AztecProtocol/aztec-packages/commit/1aef553d0991fca9940ed0521dab246de08a0a77))
* Removing test token contract artifact ([#9906](https://github.com/AztecProtocol/aztec-packages/issues/9906)) ([c366c69](https://github.com/AztecProtocol/aztec-packages/commit/c366c69ec3e3ad48206d0748b19c58c0d998be65))
* Revert changes to ci.yml ([#9863](https://github.com/AztecProtocol/aztec-packages/issues/9863)) ([5299f5f](https://github.com/AztecProtocol/aztec-packages/commit/5299f5f8f0400ca444df5eef72d930bd729c415f))
* Telemetry stopping on shutdown ([#9740](https://github.com/AztecProtocol/aztec-packages/issues/9740)) ([23b8d8b](https://github.com/AztecProtocol/aztec-packages/commit/23b8d8b15e2a8f5473e6bfedf62e9f1b35c9919c))
* Token naming issue ([#9950](https://github.com/AztecProtocol/aztec-packages/issues/9950)) ([5997c82](https://github.com/AztecProtocol/aztec-packages/commit/5997c823077d686107408caa8b4d148e115b62ac))
* Tree heights that last past 3 days ([#9760](https://github.com/AztecProtocol/aztec-packages/issues/9760)) ([23c122d](https://github.com/AztecProtocol/aztec-packages/commit/23c122d36091b3b756084584ecba59b800196d58))
* TXE fixes ([#9930](https://github.com/AztecProtocol/aztec-packages/issues/9930)) ([451feed](https://github.com/AztecProtocol/aztec-packages/commit/451feed4fb355b81acedeba05ebc62468c3c7316))
* Type-check turbofish in trait before function call (https://github.com/noir-lang/noir/pull/6416) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Update cli-wallet bash tests to reflect token contract changes ([#9927](https://github.com/AztecProtocol/aztec-packages/issues/9927)) ([3830e2a](https://github.com/AztecProtocol/aztec-packages/commit/3830e2a81cca4ff4782000847aefe011fbb6ee0c))
* Update solhint ([#9399](https://github.com/AztecProtocol/aztec-packages/issues/9399)) ([363663f](https://github.com/AztecProtocol/aztec-packages/commit/363663f755343f7530fa25d973b0741b044d29ed))
* **val:** Decrease default polling interval ([#9647](https://github.com/AztecProtocol/aztec-packages/issues/9647)) ([b880488](https://github.com/AztecProtocol/aztec-packages/commit/b880488c7ef5b2bbcc6d220f9d4ffc86537be05f))
* Wait for tx to be re-included ([#9964](https://github.com/AztecProtocol/aztec-packages/issues/9964)) ([9370c91](https://github.com/AztecProtocol/aztec-packages/commit/9370c91dbc9c7b8eb38236e2fa3637e92d7f3786))


### Miscellaneous

* Add end_gas_used to avm public inputs ([#9910](https://github.com/AztecProtocol/aztec-packages/issues/9910)) ([3889def](https://github.com/AztecProtocol/aztec-packages/commit/3889deffe372c94b2a38e465e89f6babbee18fec))
* Add regression tests for [#4372](https://github.com/AztecProtocol/aztec-packages/issues/4372) (https://github.com/noir-lang/noir/pull/6401) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Add regression tests for [#6314](https://github.com/AztecProtocol/aztec-packages/issues/6314) (https://github.com/noir-lang/noir/pull/6381) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Add unsafe comments ([#9761](https://github.com/AztecProtocol/aztec-packages/issues/9761)) ([7802fc8](https://github.com/AztecProtocol/aztec-packages/commit/7802fc8c764137ca2072cfe15af62ee8a46a9c89))
* **avm:** Bugfixing witness generation for add, sub, mul for FF ([#9938](https://github.com/AztecProtocol/aztec-packages/issues/9938)) ([d8db656](https://github.com/AztecProtocol/aztec-packages/commit/d8db656980c09ad219c375e831443bd523100d4b))
* **avm:** Minor benchmarking ([#9869](https://github.com/AztecProtocol/aztec-packages/issues/9869)) ([603b9c2](https://github.com/AztecProtocol/aztec-packages/commit/603b9c2a5dcc20dcffa81909b707a614a933888a))
* Boring names ([#9725](https://github.com/AztecProtocol/aztec-packages/issues/9725)) ([2509e2f](https://github.com/AztecProtocol/aztec-packages/commit/2509e2f132d30efa5085e9740279529ce551215a))
* Build acir test programs in parallel to e2e build step ([#9988](https://github.com/AztecProtocol/aztec-packages/issues/9988)) ([1aaee26](https://github.com/AztecProtocol/aztec-packages/commit/1aaee267127bef8b7820057e6e9118e828c57330))
* Bump runner cache disk size ([#9849](https://github.com/AztecProtocol/aztec-packages/issues/9849)) ([61c33a0](https://github.com/AztecProtocol/aztec-packages/commit/61c33a0d18f35fb750afdcb0379b9796fd634103))
* **ci:** Run `l1-contracts` CI in parallel with `build` step ([#10024](https://github.com/AztecProtocol/aztec-packages/issues/10024)) ([6ed12d9](https://github.com/AztecProtocol/aztec-packages/commit/6ed12d983da9c1b6880d16643f175b12e90d9cb8))
* **ci:** Run noir tests in parallel to building e2e tests ([#9977](https://github.com/AztecProtocol/aztec-packages/issues/9977)) ([6f3c3fe](https://github.com/AztecProtocol/aztec-packages/commit/6f3c3fead2a36e360de680aa76f68430749c877f))
* Clean up data configuration ([#9973](https://github.com/AztecProtocol/aztec-packages/issues/9973)) ([b660739](https://github.com/AztecProtocol/aztec-packages/commit/b66073986827731ce59e6f962ff1fb051677a094))
* Cleanup and address comments after refactor ([#9785](https://github.com/AztecProtocol/aztec-packages/issues/9785)) ([d11e9b3](https://github.com/AztecProtocol/aztec-packages/commit/d11e9b39677974f3685967c9f928eaf308d6f21c))
* Create a regression test for [#6420](https://github.com/AztecProtocol/aztec-packages/issues/6420) (https://github.com/noir-lang/noir/pull/6421) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Deflaker CI for testnet branch ([#9820](https://github.com/AztecProtocol/aztec-packages/issues/9820)) ([f6875ee](https://github.com/AztecProtocol/aztec-packages/commit/f6875eedd2be7354f85f652bb97c63f1ca44ce57))
* Delete accidentally added file ([#9912](https://github.com/AztecProtocol/aztec-packages/issues/9912)) ([21dccf8](https://github.com/AztecProtocol/aztec-packages/commit/21dccf8aeb15ce4a9bf5181c63a7278a157ddbdd))
* Devops for proving large blocks ([#9795](https://github.com/AztecProtocol/aztec-packages/issues/9795)) ([7a70b81](https://github.com/AztecProtocol/aztec-packages/commit/7a70b819e883cffdc24feb62cdc238e9ee0ef7e1))
* Disable bench upload until [#9692](https://github.com/AztecProtocol/aztec-packages/issues/9692) ([67b6d4a](https://github.com/AztecProtocol/aztec-packages/commit/67b6d4adc0dc1ba94335827b444f90cd7c3736ec))
* Disable broken jobs ([#9730](https://github.com/AztecProtocol/aztec-packages/issues/9730)) ([68138de](https://github.com/AztecProtocol/aztec-packages/commit/68138ded02d689c6424ce2b177f52096da9fef19))
* Disable failing 48validator kind test ([#9920](https://github.com/AztecProtocol/aztec-packages/issues/9920)) ([10c64fc](https://github.com/AztecProtocol/aztec-packages/commit/10c64fccae2205a0cfde3162b96ceca57aa5a177))
* Disable rediscovery test ([#9844](https://github.com/AztecProtocol/aztec-packages/issues/9844)) ([3a8e8bf](https://github.com/AztecProtocol/aztec-packages/commit/3a8e8bf73d27e05525ff81eda03221f74da81e25))
* **docs:** Authwit note, not simulating simulations ([#9438](https://github.com/AztecProtocol/aztec-packages/issues/9438)) ([1779c42](https://github.com/AztecProtocol/aztec-packages/commit/1779c42c3dfed9a1d433cd0c6f8400a14612e404))
* **docs:** Updates to token contract ([#9954](https://github.com/AztecProtocol/aztec-packages/issues/9954)) ([5c8c35d](https://github.com/AztecProtocol/aztec-packages/commit/5c8c35dbff43ff025488351af399b78c3659f8ae))
* Don't use submodule cache ([#9924](https://github.com/AztecProtocol/aztec-packages/issues/9924)) ([00a8787](https://github.com/AztecProtocol/aztec-packages/commit/00a8787a22cd70325ddd43d734bbdfeefede0cf6))
* Drop info to verbose in sequencer hot loop ([#9983](https://github.com/AztecProtocol/aztec-packages/issues/9983)) ([beed293](https://github.com/AztecProtocol/aztec-packages/commit/beed29383fb8e2fb7e2ecd1c394908e098a494be))
* Enqueued calls processor -&gt; public tx simulator ([#9919](https://github.com/AztecProtocol/aztec-packages/issues/9919)) ([cae7279](https://github.com/AztecProtocol/aztec-packages/commit/cae7279be8df3e12004757f1ede721452719e5ad))
* Estimate gas and fee ([#9889](https://github.com/AztecProtocol/aztec-packages/issues/9889)) ([a43c107](https://github.com/AztecProtocol/aztec-packages/commit/a43c10766ee015f894635bf03b6ea87d199c18bc))
* Even more warnings removed ([#9857](https://github.com/AztecProtocol/aztec-packages/issues/9857)) ([f961c26](https://github.com/AztecProtocol/aztec-packages/commit/f961c26fc6de8e5b6849e30a962a5feb49fb0825))
* Final token cleanup ([#9864](https://github.com/AztecProtocol/aztec-packages/issues/9864)) ([a6c1160](https://github.com/AztecProtocol/aztec-packages/commit/a6c1160d899e691b7529ab757beac08cc898646b))
* Fix bad merge on AztecLMDBStore initializer ([c8de6cf](https://github.com/AztecProtocol/aztec-packages/commit/c8de6cf883db85f8cf0c266e0996eb3f6c53345c))
* Fix for boot node pod dns in Google Kubernetes Engine ([#9818](https://github.com/AztecProtocol/aztec-packages/issues/9818)) ([2a98ebb](https://github.com/AztecProtocol/aztec-packages/commit/2a98ebb260f422403cd785055b4e87f2900eaaf1))
* Fix get_bench_jobs.sh ([#9628](https://github.com/AztecProtocol/aztec-packages/issues/9628)) ([abc424a](https://github.com/AztecProtocol/aztec-packages/commit/abc424a557ab6cfa68162400a94aef18577e9b74))
* Fixing test contract fixture ([#9909](https://github.com/AztecProtocol/aztec-packages/issues/9909)) ([4fdcc14](https://github.com/AztecProtocol/aztec-packages/commit/4fdcc1482ec920eb35fc3c8568c96c7ec4f17bb6))
* Hotfix runner wait ([#10018](https://github.com/AztecProtocol/aztec-packages/issues/10018)) ([3034936](https://github.com/AztecProtocol/aztec-packages/commit/3034936f008320a6f49849541d8e420124580e2c))
* Improve input validation in bootstrap.sh and refactor bit_traits.rs ([#9406](https://github.com/AztecProtocol/aztec-packages/issues/9406)) ([65b1cd2](https://github.com/AztecProtocol/aztec-packages/commit/65b1cd261632aae42f574580209e5d557080d6c2))
* Kind-network-test 16 validators ([#9732](https://github.com/AztecProtocol/aztec-packages/issues/9732)) ([2b93acb](https://github.com/AztecProtocol/aztec-packages/commit/2b93acbcb8ab7a57a2cfb88f15fbed392328d677))
* Lower throughput of ebs disks ([#9961](https://github.com/AztecProtocol/aztec-packages/issues/9961)) ([724c75f](https://github.com/AztecProtocol/aztec-packages/commit/724c75f4d8fb0854b5cbd4ebe6474b8478634fdd))
* **lsp:** Remove profile code lens (https://github.com/noir-lang/noir/pull/6411) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Make docker-compose tests less spammy ([#9659](https://github.com/AztecProtocol/aztec-packages/issues/9659)) ([6339dc5](https://github.com/AztecProtocol/aztec-packages/commit/6339dc5a4aaeeefe27b0e9cb59d594374ddafc72))
* Misc cleanup, docs and renaming ([#9968](https://github.com/AztecProtocol/aztec-packages/issues/9968)) ([c9894c1](https://github.com/AztecProtocol/aztec-packages/commit/c9894c1efe847f562c99843a00c1388f8e387234))
* More descriptive slack alert ([#9739](https://github.com/AztecProtocol/aztec-packages/issues/9739)) ([542cf8f](https://github.com/AztecProtocol/aztec-packages/commit/542cf8febb43ada522362acb0e44c63b41ac7ed2))
* More descriptive slack alert take 2 ([#9791](https://github.com/AztecProtocol/aztec-packages/issues/9791)) ([7bc5e56](https://github.com/AztecProtocol/aztec-packages/commit/7bc5e56e7dc5e2d8984d01be6fb623b16b190fa4))
* More permissive expected json parse error msg ([#9714](https://github.com/AztecProtocol/aztec-packages/issues/9714)) ([e5b3ec0](https://github.com/AztecProtocol/aztec-packages/commit/e5b3ec0b0f6cb2e0b9e974aa01e8f0c25d238c81))
* Move epoch and slot durations to config ([#9861](https://github.com/AztecProtocol/aztec-packages/issues/9861)) ([bfd4f2c](https://github.com/AztecProtocol/aztec-packages/commit/bfd4f2ce49393c4629563c07a89f19ebaf9aaab2))
* **nargo:** Remove old profile as part of info cmd (https://github.com/noir-lang/noir/pull/6406) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Nuking `pay_refund_with_shielded_rebate` flow ([#9639](https://github.com/AztecProtocol/aztec-packages/issues/9639)) ([2e13938](https://github.com/AztecProtocol/aztec-packages/commit/2e13938b29242b1e751d9bba77cf72661a7da397))
* Nuking ancient redundant test ([#9941](https://github.com/AztecProtocol/aztec-packages/issues/9941)) ([a1ba20f](https://github.com/AztecProtocol/aztec-packages/commit/a1ba20fdb38500db4719c4e25712990e62c391fa))
* Prove one epoch in kind ([#9886](https://github.com/AztecProtocol/aztec-packages/issues/9886)) ([44ea5fb](https://github.com/AztecProtocol/aztec-packages/commit/44ea5fbccc944a609cce7fd2a488c63ec2ed5169))
* Pull changes out of sync PR ([#9966](https://github.com/AztecProtocol/aztec-packages/issues/9966)) ([bf4176f](https://github.com/AztecProtocol/aztec-packages/commit/bf4176f9fc2ae13ddc3f3ca534bc0611f85d7aa7))
* Pull doc changes out of sync PR ([#9921](https://github.com/AztecProtocol/aztec-packages/issues/9921)) ([060a0e3](https://github.com/AztecProtocol/aztec-packages/commit/060a0e342f8df6239cf4d5669cf7038c83e76c32))
* Pull frontend changes from sync PR ([#9935](https://github.com/AztecProtocol/aztec-packages/issues/9935)) ([92a4c5d](https://github.com/AztecProtocol/aztec-packages/commit/92a4c5dea635013bb412266642b141211548bc26))
* Pull loop unrolling refactor from sync PR ([#9975](https://github.com/AztecProtocol/aztec-packages/issues/9975)) ([58761fc](https://github.com/AztecProtocol/aztec-packages/commit/58761fcf181d0a26c4e387105b1bc8a3a75b0368))
* Pull noir PR [#6461](https://github.com/AztecProtocol/aztec-packages/issues/6461) from sync PR ([#9923](https://github.com/AztecProtocol/aztec-packages/issues/9923)) ([21e07d2](https://github.com/AztecProtocol/aztec-packages/commit/21e07d2194eb1a2f0ed988f7c8ef1c325a79191c))
* Pull out `array_set` pass changes ([#9993](https://github.com/AztecProtocol/aztec-packages/issues/9993)) ([db6fdc2](https://github.com/AztecProtocol/aztec-packages/commit/db6fdc27abeba393e3c34f8ba6623c2178ddd3ef))
* Pull out reference changes from sync PR ([#9967](https://github.com/AztecProtocol/aztec-packages/issues/9967)) ([8f41bee](https://github.com/AztecProtocol/aztec-packages/commit/8f41beef025b7c28fe09bacdf5fe29d1142a5d74))
* Pull signed bitshifts from sync PR ([#9939](https://github.com/AztecProtocol/aztec-packages/issues/9939)) ([188f60a](https://github.com/AztecProtocol/aztec-packages/commit/188f60a34ee890fe7886f9582b91fb8123d0a596))
* Pull SSA parser from sync PR ([#9928](https://github.com/AztecProtocol/aztec-packages/issues/9928)) ([7661e42](https://github.com/AztecProtocol/aztec-packages/commit/7661e428161ba91d4fa978e6a5d09568c649e51f))
* Range error flake ([#9784](https://github.com/AztecProtocol/aztec-packages/issues/9784)) ([d5e9a98](https://github.com/AztecProtocol/aztec-packages/commit/d5e9a986f774bfbc80461b8a6eb2e334f28d91b1))
* Redo typo PR by cypherpepe ([#9687](https://github.com/AztecProtocol/aztec-packages/issues/9687)) ([c2455bd](https://github.com/AztecProtocol/aztec-packages/commit/c2455bd2366c7d9f55998da1992a59667a7c5a93))
* Redo typo PR by donatik27 ([#9693](https://github.com/AztecProtocol/aztec-packages/issues/9693)) ([f47cc17](https://github.com/AztecProtocol/aztec-packages/commit/f47cc17046001fd86db0324e800847d634aefc03))
* Redo typo PR by dsarfed ([#9667](https://github.com/AztecProtocol/aztec-packages/issues/9667)) ([4fc6f8b](https://github.com/AztecProtocol/aztec-packages/commit/4fc6f8b44b7e58d982151732fa6d9691e73635bc))
* Redo typo PR by leopardracer ([#9705](https://github.com/AztecProtocol/aztec-packages/issues/9705)) ([dedbe40](https://github.com/AztecProtocol/aztec-packages/commit/dedbe402640c13cfa1ec4198f35caaeb4d27e929))
* Redo typo PR by mdqst ([#9684](https://github.com/AztecProtocol/aztec-packages/issues/9684)) ([221f7d1](https://github.com/AztecProtocol/aztec-packages/commit/221f7d196b22b96336479ff2f905db63e24dd3a4))
* Redo typo PR by mdqst ([#9685](https://github.com/AztecProtocol/aztec-packages/issues/9685)) ([c594da5](https://github.com/AztecProtocol/aztec-packages/commit/c594da5cca3c31fab061a0a284efc002d9b6f34d))
* Redo typo PR by mdqst ([#9723](https://github.com/AztecProtocol/aztec-packages/issues/9723)) ([470d274](https://github.com/AztecProtocol/aztec-packages/commit/470d27488a658ba3cdaaba6b22a07cac3ec9305b))
* Redo typo PR by wooClO ([#9781](https://github.com/AztecProtocol/aztec-packages/issues/9781)) ([23d1c07](https://github.com/AztecProtocol/aztec-packages/commit/23d1c07f27a78fdeb73f0c151917458d6fff7356))
* Redo typo PR by youyyytrok ([#9686](https://github.com/AztecProtocol/aztec-packages/issues/9686)) ([8e8e16b](https://github.com/AztecProtocol/aztec-packages/commit/8e8e16b7b7697ddf1163b2269acc6b01e266977c))
* Release Noir(0.37.0) (https://github.com/noir-lang/noir/pull/6321) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Remove `recursive` from ACIR format; add them to API and CLI ([#9479](https://github.com/AztecProtocol/aztec-packages/issues/9479)) ([d2a84c4](https://github.com/AztecProtocol/aztec-packages/commit/d2a84c405291b5a04576c133b0e74327d9092db1))
* Remove duplicate and unused flavor related concepts ([#10035](https://github.com/AztecProtocol/aztec-packages/issues/10035)) ([30ca68c](https://github.com/AztecProtocol/aztec-packages/commit/30ca68c8435d7edf227206c61dd1ab4551514857))
* Remove EnqueuedCallSimulator ([#10015](https://github.com/AztecProtocol/aztec-packages/issues/10015)) ([aa949ef](https://github.com/AztecProtocol/aztec-packages/commit/aa949ef6f838ce4273cddd112358887bd6c26f9c))
* Remove public kernel inner ([#9865](https://github.com/AztecProtocol/aztec-packages/issues/9865)) ([61aa882](https://github.com/AztecProtocol/aztec-packages/commit/61aa88212cbbe596b2e3f4540fb4e353a9a84516))
* Remove public kernels ([#10027](https://github.com/AztecProtocol/aztec-packages/issues/10027)) ([1acf4cf](https://github.com/AztecProtocol/aztec-packages/commit/1acf4cfc28c72550f299d97493c7a4b33b4c5d7c))
* Remove some more warnings ([#9819](https://github.com/AztecProtocol/aztec-packages/issues/9819)) ([ddba505](https://github.com/AztecProtocol/aztec-packages/commit/ddba505bf4f875d2370a4555064aec6b09783818))
* Rename aggregation object to pairing point accumulator ([#9817](https://github.com/AztecProtocol/aztec-packages/issues/9817)) ([0ebd52e](https://github.com/AztecProtocol/aztec-packages/commit/0ebd52e5dd326fcbebe38869908dfcb4c2ba2c03))
* Replace `to_radix` directive with brillig ([#9970](https://github.com/AztecProtocol/aztec-packages/issues/9970)) ([6fec1dc](https://github.com/AztecProtocol/aztec-packages/commit/6fec1dcaf40f2d73843a12e544bae9d8028f9eed))
* Replace dead link with updated route in README (https://github.com/noir-lang/noir/pull/6392) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Replace relative paths to noir-protocol-circuits ([4552a37](https://github.com/AztecProtocol/aztec-packages/commit/4552a370700384ad7f2aad40cd90b00f0a77b1d1))
* Replace relative paths to noir-protocol-circuits ([fb15502](https://github.com/AztecProtocol/aztec-packages/commit/fb155027f46c4ceaaf2b2286f4e037637efbe1d6))
* Replace relative paths to noir-protocol-circuits ([e606c2f](https://github.com/AztecProtocol/aztec-packages/commit/e606c2f0a279a269a23a8c383ad63bec832f1028))
* Replace relative paths to noir-protocol-circuits ([05ba4a0](https://github.com/AztecProtocol/aztec-packages/commit/05ba4a06c8ea9d2898f768d0dee3a9ac024e1e67))
* Replace relative paths to noir-protocol-circuits ([34215b1](https://github.com/AztecProtocol/aztec-packages/commit/34215b1e71f19fdac137a1dfe2b63d8253275ba5))
* Replace relative paths to noir-protocol-circuits ([e044c67](https://github.com/AztecProtocol/aztec-packages/commit/e044c671f9e1b24be3c53cfa174bf251b2cd3392))
* Replace relative paths to noir-protocol-circuits ([1c6cca5](https://github.com/AztecProtocol/aztec-packages/commit/1c6cca550c335d672d2a952dc75ec93a07da7c8b))
* Replace relative paths to noir-protocol-circuits ([28d469b](https://github.com/AztecProtocol/aztec-packages/commit/28d469b5338c01da823c630982238996aa234148))
* Replace relative paths to noir-protocol-circuits ([ee060ab](https://github.com/AztecProtocol/aztec-packages/commit/ee060abb171bef52d072e1659911e4c881afacbf))
* Replace relative paths to noir-protocol-circuits ([f27c52a](https://github.com/AztecProtocol/aztec-packages/commit/f27c52a55b6ac3bd102b37017876026ab9a4a86c))
* Replace relative paths to noir-protocol-circuits ([e0ee48a](https://github.com/AztecProtocol/aztec-packages/commit/e0ee48aa5679b9cf64291ce28c56d61ed72ea0e6))
* Revert "chore: more descriptive slack alert" ([#9783](https://github.com/AztecProtocol/aztec-packages/issues/9783)) ([dd2f5f3](https://github.com/AztecProtocol/aztec-packages/commit/dd2f5f3d1dc842945047af70d71807810bdbc8dc))
* Revert "chore: Validate RPC inputs" ([#9875](https://github.com/AztecProtocol/aztec-packages/issues/9875)) ([dd83d52](https://github.com/AztecProtocol/aztec-packages/commit/dd83d520c9925f00de155bddf0cf95852c971995))
* Revert TBB default and ivc matching regression mac build ([#9901](https://github.com/AztecProtocol/aztec-packages/issues/9901)) ([3b70bf0](https://github.com/AztecProtocol/aztec-packages/commit/3b70bf035112a77701aaa08d0230e1699be7b1fc))
* Reverts "cleanup and address comments after refactor" ([#9801](https://github.com/AztecProtocol/aztec-packages/issues/9801)) ([1b41d38](https://github.com/AztecProtocol/aztec-packages/commit/1b41d3855badb318e7a37bd9e4f18d62af626184))
* Safe JSON RPC server and client ([#9656](https://github.com/AztecProtocol/aztec-packages/issues/9656)) ([e63e219](https://github.com/AztecProtocol/aztec-packages/commit/e63e21970570ef272a45723a27faa6192522c759))
* ServerCircuitProver return values ([#9391](https://github.com/AztecProtocol/aztec-packages/issues/9391)) ([ec717b5](https://github.com/AztecProtocol/aztec-packages/commit/ec717b55d17a70a0ae4d63f62145dba8258de17b))
* Share state manager and side effect tracer for all enqueued calls in tx ([#9565](https://github.com/AztecProtocol/aztec-packages/issues/9565)) ([e3756fd](https://github.com/AztecProtocol/aztec-packages/commit/e3756fdb40074791d52b953bb15725d4378d1444))
* Simplify docker compose instrumentation and native testnet metrics collection ([#9754](https://github.com/AztecProtocol/aztec-packages/issues/9754)) ([db94d2a](https://github.com/AztecProtocol/aztec-packages/commit/db94d2ad3cae74c4209df60cc9c8fabfb206e9a2))
* Stop calling public kernels ([#9971](https://github.com/AztecProtocol/aztec-packages/issues/9971)) ([d86a9d9](https://github.com/AztecProtocol/aztec-packages/commit/d86a9d98de06693538f73828b1291f9befd2529c))
* Switch to installing published binaries of foundry ([#9731](https://github.com/AztecProtocol/aztec-packages/issues/9731)) ([5cf3a2a](https://github.com/AztecProtocol/aztec-packages/commit/5cf3a2aa71af0f98a1f492b4474126ae3487c39f))
* Token naming cleanup ([#9904](https://github.com/AztecProtocol/aztec-packages/issues/9904)) ([d77fc30](https://github.com/AztecProtocol/aztec-packages/commit/d77fc307c96eaa57ea7a0cf3676490ba4704a7f3))
* Token partial notes refactor pt. 2 - bridging ([#9600](https://github.com/AztecProtocol/aztec-packages/issues/9600)) ([d513099](https://github.com/AztecProtocol/aztec-packages/commit/d51309954ab4a5ae1c829c86185b02c156baf3c7))
* Token refunds cleanup ([#9943](https://github.com/AztecProtocol/aztec-packages/issues/9943)) ([96428d1](https://github.com/AztecProtocol/aztec-packages/commit/96428d14d0b7f9ddcaa900f59eda91cc43cdefc0))
* Trace structure is an object ([#10003](https://github.com/AztecProtocol/aztec-packages/issues/10003)) ([5f83755](https://github.com/AztecProtocol/aztec-packages/commit/5f837552449d1d3283c3cfd528a7ac69825cc1aa))
* Update `redo-typo-pr` to squash multi-commit PRs ([#9706](https://github.com/AztecProtocol/aztec-packages/issues/9706)) ([d5642e8](https://github.com/AztecProtocol/aztec-packages/commit/d5642e8715d6d0055782be9eccc760f543865a8b))
* Update Barretenberg README with matching nargo versions ([#9908](https://github.com/AztecProtocol/aztec-packages/issues/9908)) ([e305f48](https://github.com/AztecProtocol/aztec-packages/commit/e305f488b1502630f299bb03cf169770f2f6af09))
* Update boundary in test ([#9728](https://github.com/AztecProtocol/aztec-packages/issues/9728)) ([f6f0be8](https://github.com/AztecProtocol/aztec-packages/commit/f6f0be8ab4be4e8a703859586780e51924a7fee6))
* Update install instructions for foundry to display version of rust to install ([#9653](https://github.com/AztecProtocol/aztec-packages/issues/9653)) ([f5d8a07](https://github.com/AztecProtocol/aztec-packages/commit/f5d8a07182d81c6a94d5b2b0a7a91bd9a09c3658))
* Update variable names in stdlib tests to be more correct (https://github.com/noir-lang/noir/pull/6419) ([379145a](https://github.com/AztecProtocol/aztec-packages/commit/379145a6fc457998ea81c6ee1678ae017cd2a37e))
* Update version numbers of noir packages ([#9922](https://github.com/AztecProtocol/aztec-packages/issues/9922)) ([723b77b](https://github.com/AztecProtocol/aztec-packages/commit/723b77ba8ef5ea6cbe01f6d1e2329ae5809b825a))
* Upload logs in kind-network-test ([#9755](https://github.com/AztecProtocol/aztec-packages/issues/9755)) ([4c51c75](https://github.com/AztecProtocol/aztec-packages/commit/4c51c7510dc5e66a4242e9e658992ee9d3f78139))
* Use stack based recursion instead of function recursion ([#9947](https://github.com/AztecProtocol/aztec-packages/issues/9947)) ([ca050b8](https://github.com/AztecProtocol/aztec-packages/commit/ca050b837a46aa870fb8850ed0d8aaaad4e758ee))
* Validate RPC inputs ([#9672](https://github.com/AztecProtocol/aztec-packages/issues/9672)) ([6554122](https://github.com/AztecProtocol/aztec-packages/commit/6554122bdcd6d3840d03fdf1e7896f3961021e1f)), closes [#9455](https://github.com/AztecProtocol/aztec-packages/issues/9455)
* Validate RPC inputs reloaded ([#9878](https://github.com/AztecProtocol/aztec-packages/issues/9878)) ([70ab7c4](https://github.com/AztecProtocol/aztec-packages/commit/70ab7c4a905a33b518c773aa244f4a85064cfde3))
* World state tech debt cleanup 1 ([#9561](https://github.com/AztecProtocol/aztec-packages/issues/9561)) ([05e4b27](https://github.com/AztecProtocol/aztec-packages/commit/05e4b2774665e744dcec169bc698cb110c749c1b))
</details>

<details><summary>barretenberg: 0.63.0</summary>

## [0.63.0](https://github.com/AztecProtocol/aztec-packages/compare/barretenberg-v0.62.0...barretenberg-v0.63.0) (2024-11-19)


###   BREAKING CHANGES

* **avm:** byte indexed PC ([#9582](https://github.com/AztecProtocol/aztec-packages/issues/9582))
* Remove `recursive` from ACIR format; add them to API and CLI ([#9479](https://github.com/AztecProtocol/aztec-packages/issues/9479))

### Features

* Add miscellaneous block to handle structure trace overflow ([#9733](https://github.com/AztecProtocol/aztec-packages/issues/9733)) ([80f9cc4](https://github.com/AztecProtocol/aztec-packages/commit/80f9cc47a12ba3cd8ca2a8d1fb516fed3f4372ed))
* Add Origin Tags to cycle group ([#9879](https://github.com/AztecProtocol/aztec-packages/issues/9879)) ([de6564e](https://github.com/AztecProtocol/aztec-packages/commit/de6564e8374d6d546e0fccbb0429d6c12e828ab3))
* **avm:** Byte indexed PC ([#9582](https://github.com/AztecProtocol/aztec-packages/issues/9582)) ([29724f3](https://github.com/AztecProtocol/aztec-packages/commit/29724f3f2db5a3b6e399e54a9a84af8686807fb6))
* **avm:** Gas specific range check ([#9874](https://github.com/AztecProtocol/aztec-packages/issues/9874)) ([1a9c5ce](https://github.com/AztecProtocol/aztec-packages/commit/1a9c5ce385c7db2e488831dcd7dc3bedfc02f74a))
* **avm:** Hinting merkle trees ([#9658](https://github.com/AztecProtocol/aztec-packages/issues/9658)) ([8d49e59](https://github.com/AztecProtocol/aztec-packages/commit/8d49e5963092548d31a901a693a1653d3151d114))
* **avm:** Mem specific range check ([#9828](https://github.com/AztecProtocol/aztec-packages/issues/9828)) ([ada3e3a](https://github.com/AztecProtocol/aztec-packages/commit/ada3e3aba6141411a8ca931f45cc2b9b7027585e))
* **avm:** Non-field sized cmp circuit ops ([#9895](https://github.com/AztecProtocol/aztec-packages/issues/9895)) ([59376d4](https://github.com/AztecProtocol/aztec-packages/commit/59376d499278eec3ddf4ee9fbb64ba2c83f9b8df))
* **avm:** Tag checking, raising errors and stop execution ([#9831](https://github.com/AztecProtocol/aztec-packages/issues/9831)) ([eac5fb5](https://github.com/AztecProtocol/aztec-packages/commit/eac5fb5f30997364bf45262f898cfeedb97b1a71)), closes [#9745](https://github.com/AztecProtocol/aztec-packages/issues/9745)
* Bb.js tests of ClientIVC ([#9412](https://github.com/AztecProtocol/aztec-packages/issues/9412)) ([90696cd](https://github.com/AztecProtocol/aztec-packages/commit/90696cd0e126d7db3c4ef396ada4bddd3ac0de73))
* Change definition of lagrange last ([#9916](https://github.com/AztecProtocol/aztec-packages/issues/9916)) ([f566503](https://github.com/AztecProtocol/aztec-packages/commit/f566503377298681ce8f1d9d9b8c3c026825e2a2))
* Constify eccvm and translator ([#9661](https://github.com/AztecProtocol/aztec-packages/issues/9661)) ([c95e5fd](https://github.com/AztecProtocol/aztec-packages/commit/c95e5fd5606b7f14b1e2e43ecc770d5f22d294a0))
* Constrain App function VKs ([#9756](https://github.com/AztecProtocol/aztec-packages/issues/9756)) ([ae7cfe7](https://github.com/AztecProtocol/aztec-packages/commit/ae7cfe72b5c528fb533040c6da62c9b21f542f8b))
* Encode static error strings in the ABI ([#9552](https://github.com/AztecProtocol/aztec-packages/issues/9552)) ([1a41d42](https://github.com/AztecProtocol/aztec-packages/commit/1a41d42852ea2d7cdcb9f75387342783e1632b11))
* Faster random sampling ([#9655](https://github.com/AztecProtocol/aztec-packages/issues/9655)) ([969a3f0](https://github.com/AztecProtocol/aztec-packages/commit/969a3f0b2d5bbce95126685b1a056f378a4c4d78))
* Faster randomness sampling for field elements ([#9627](https://github.com/AztecProtocol/aztec-packages/issues/9627)) ([b98e93f](https://github.com/AztecProtocol/aztec-packages/commit/b98e93f4befb985c72e8768f378face2dcc79810))
* Graph methods for circuit analysis (part 1) ([#7948](https://github.com/AztecProtocol/aztec-packages/issues/7948)) ([eeea55a](https://github.com/AztecProtocol/aztec-packages/commit/eeea55a39e9e1a417ddf79e44575420e5efcdfcf))
* Introduce avm circuit public inputs ([#9759](https://github.com/AztecProtocol/aztec-packages/issues/9759)) ([4660381](https://github.com/AztecProtocol/aztec-packages/commit/46603810b149ef7f03c220d11d6dfd395cf550e0))
* IPA Accumulation implementation ([#9494](https://github.com/AztecProtocol/aztec-packages/issues/9494)) ([1a935d0](https://github.com/AztecProtocol/aztec-packages/commit/1a935d091cfad0e4861ec840a59372fdf177518d))
* IPA Accumulator in Builder ([#9846](https://github.com/AztecProtocol/aztec-packages/issues/9846)) ([8e74cd0](https://github.com/AztecProtocol/aztec-packages/commit/8e74cd09a8b65c3903c91197d599e722518ab315))
* Mega memory benchmarks ([#9858](https://github.com/AztecProtocol/aztec-packages/issues/9858)) ([7e587d6](https://github.com/AztecProtocol/aztec-packages/commit/7e587d6d43cc28174d807c255f5270212a0b1c98))
* Mega zk features ([#9774](https://github.com/AztecProtocol/aztec-packages/issues/9774)) ([2096dc2](https://github.com/AztecProtocol/aztec-packages/commit/2096dc236c627cfd802ca05e0c9cb0ea6c441458))
* Mock data for IVC ([#9893](https://github.com/AztecProtocol/aztec-packages/issues/9893)) ([9325f6f](https://github.com/AztecProtocol/aztec-packages/commit/9325f6ff987022da1a4dabb771781cdc999af18e))
* Naive attempt to bind the honk solidity verifier function to the ts interface ([#9432](https://github.com/AztecProtocol/aztec-packages/issues/9432)) ([fc27eaf](https://github.com/AztecProtocol/aztec-packages/commit/fc27eafaaa471e888805c785066f361f0da15298))
* Origin Tags part 3 (Memory) ([#9758](https://github.com/AztecProtocol/aztec-packages/issues/9758)) ([d77e473](https://github.com/AztecProtocol/aztec-packages/commit/d77e473219d1628b2045100a55c4073f9fa32c25))
* Prove openings of masking polynomials in ECCVM and Translator ([#9726](https://github.com/AztecProtocol/aztec-packages/issues/9726)) ([f1cdc2d](https://github.com/AztecProtocol/aztec-packages/commit/f1cdc2d981ef01fda9b14c6803e014e546b71b66))
* Recursive verifier for decider and last folding proof ([#9626](https://github.com/AztecProtocol/aztec-packages/issues/9626)) ([d7ee6e5](https://github.com/AztecProtocol/aztec-packages/commit/d7ee6e5cffba32ef141e717aeaf83f56a9af92b5))
* Removed redundant scalar muls from the verifiers using shplemini ([#9392](https://github.com/AztecProtocol/aztec-packages/issues/9392)) ([e07cac7](https://github.com/AztecProtocol/aztec-packages/commit/e07cac7fee501a752d98ebf749f6cf31a3ff74af))
* Send G_0 in proof to reduce tube size ([#9766](https://github.com/AztecProtocol/aztec-packages/issues/9766)) ([9bc5a2f](https://github.com/AztecProtocol/aztec-packages/commit/9bc5a2f02852d6187a597612e8459ee305f3e198))
* Split up eccvm proof into two proofs ([#9914](https://github.com/AztecProtocol/aztec-packages/issues/9914)) ([37d7cd7](https://github.com/AztecProtocol/aztec-packages/commit/37d7cd784bc6dfe366d1eabc2b7be8cca4359f7b))
* Stop with HeapVector ([#9810](https://github.com/AztecProtocol/aztec-packages/issues/9810)) ([52ae4e1](https://github.com/AztecProtocol/aztec-packages/commit/52ae4e1710d07aca497de723294f7b7c0100b479))
* Track active accumulator rows and leverage in IVC folding ([#9599](https://github.com/AztecProtocol/aztec-packages/issues/9599)) ([76328eb](https://github.com/AztecProtocol/aztec-packages/commit/76328ebe88fd1d9dbb041be8cc1692516ed7d2d2))
* Zk shplemini ([#9830](https://github.com/AztecProtocol/aztec-packages/issues/9830)) ([23ff518](https://github.com/AztecProtocol/aztec-packages/commit/23ff5186a4c8905bd35753c1e6536d3b5504a5f0))


### Bug Fixes

* **avm:** Derive unencrypted log in test ([#9813](https://github.com/AztecProtocol/aztec-packages/issues/9813)) ([abdd912](https://github.com/AztecProtocol/aztec-packages/commit/abdd912bd0d3cf9a8e09339a3766c61eea712ede))
* Fix bad merge ([#9892](https://github.com/AztecProtocol/aztec-packages/issues/9892)) ([b621603](https://github.com/AztecProtocol/aztec-packages/commit/b6216033b567e0d743e17c37754a20f9c893aa0e))
* Fix inclusion path ([#10034](https://github.com/AztecProtocol/aztec-packages/issues/10034)) ([29a9ae3](https://github.com/AztecProtocol/aztec-packages/commit/29a9ae3573fe1da63a2d6494a21266e20bbe22e4))
* Fix mac build by calling `count` on durations ([#9855](https://github.com/AztecProtocol/aztec-packages/issues/9855)) ([9978c97](https://github.com/AztecProtocol/aztec-packages/commit/9978c9742c7b2b27c9ba813ddb66125a0ca57e6b))
* Fix random for Mac users  ([#9670](https://github.com/AztecProtocol/aztec-packages/issues/9670)) ([bf5d62d](https://github.com/AztecProtocol/aztec-packages/commit/bf5d62d4332548ac7798085eb98cedea88131d9d))
* Tree heights that last past 3 days ([#9760](https://github.com/AztecProtocol/aztec-packages/issues/9760)) ([23c122d](https://github.com/AztecProtocol/aztec-packages/commit/23c122d36091b3b756084584ecba59b800196d58))


### Miscellaneous

* Add end_gas_used to avm public inputs ([#9910](https://github.com/AztecProtocol/aztec-packages/issues/9910)) ([3889def](https://github.com/AztecProtocol/aztec-packages/commit/3889deffe372c94b2a38e465e89f6babbee18fec))
* **avm:** Bugfixing witness generation for add, sub, mul for FF ([#9938](https://github.com/AztecProtocol/aztec-packages/issues/9938)) ([d8db656](https://github.com/AztecProtocol/aztec-packages/commit/d8db656980c09ad219c375e831443bd523100d4b))
* **docs:** Authwit note, not simulating simulations ([#9438](https://github.com/AztecProtocol/aztec-packages/issues/9438)) ([1779c42](https://github.com/AztecProtocol/aztec-packages/commit/1779c42c3dfed9a1d433cd0c6f8400a14612e404))
* Redo typo PR by dsarfed ([#9667](https://github.com/AztecProtocol/aztec-packages/issues/9667)) ([4fc6f8b](https://github.com/AztecProtocol/aztec-packages/commit/4fc6f8b44b7e58d982151732fa6d9691e73635bc))
* Redo typo PR by leopardracer ([#9705](https://github.com/AztecProtocol/aztec-packages/issues/9705)) ([dedbe40](https://github.com/AztecProtocol/aztec-packages/commit/dedbe402640c13cfa1ec4198f35caaeb4d27e929))
* Remove `recursive` from ACIR format; add them to API and CLI ([#9479](https://github.com/AztecProtocol/aztec-packages/issues/9479)) ([d2a84c4](https://github.com/AztecProtocol/aztec-packages/commit/d2a84c405291b5a04576c133b0e74327d9092db1))
* Remove duplicate and unused flavor related concepts ([#10035](https://github.com/AztecProtocol/aztec-packages/issues/10035)) ([30ca68c](https://github.com/AztecProtocol/aztec-packages/commit/30ca68c8435d7edf227206c61dd1ab4551514857))
* Remove public kernels ([#10027](https://github.com/AztecProtocol/aztec-packages/issues/10027)) ([1acf4cf](https://github.com/AztecProtocol/aztec-packages/commit/1acf4cfc28c72550f299d97493c7a4b33b4c5d7c))
* Rename aggregation object to pairing point accumulator ([#9817](https://github.com/AztecProtocol/aztec-packages/issues/9817)) ([0ebd52e](https://github.com/AztecProtocol/aztec-packages/commit/0ebd52e5dd326fcbebe38869908dfcb4c2ba2c03))
* Replace `to_radix` directive with brillig ([#9970](https://github.com/AztecProtocol/aztec-packages/issues/9970)) ([6fec1dc](https://github.com/AztecProtocol/aztec-packages/commit/6fec1dcaf40f2d73843a12e544bae9d8028f9eed))
* Revert TBB default and ivc matching regression mac build ([#9901](https://github.com/AztecProtocol/aztec-packages/issues/9901)) ([3b70bf0](https://github.com/AztecProtocol/aztec-packages/commit/3b70bf035112a77701aaa08d0230e1699be7b1fc))
* Switch to installing published binaries of foundry ([#9731](https://github.com/AztecProtocol/aztec-packages/issues/9731)) ([5cf3a2a](https://github.com/AztecProtocol/aztec-packages/commit/5cf3a2aa71af0f98a1f492b4474126ae3487c39f))
* Trace structure is an object ([#10003](https://github.com/AztecProtocol/aztec-packages/issues/10003)) ([5f83755](https://github.com/AztecProtocol/aztec-packages/commit/5f837552449d1d3283c3cfd528a7ac69825cc1aa))
* Update Barretenberg README with matching nargo versions ([#9908](https://github.com/AztecProtocol/aztec-packages/issues/9908)) ([e305f48](https://github.com/AztecProtocol/aztec-packages/commit/e305f488b1502630f299bb03cf169770f2f6af09))
* Use stack based recursion instead of function recursion ([#9947](https://github.com/AztecProtocol/aztec-packages/issues/9947)) ([ca050b8](https://github.com/AztecProtocol/aztec-packages/commit/ca050b837a46aa870fb8850ed0d8aaaad4e758ee))
* World state tech debt cleanup 1 ([#9561](https://github.com/AztecProtocol/aztec-packages/issues/9561)) ([05e4b27](https://github.com/AztecProtocol/aztec-packages/commit/05e4b2774665e744dcec169bc698cb110c749c1b))
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).