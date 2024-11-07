import { type AztecNodeService } from '@aztec/aztec-node';
import { deployL1Contract, sleep } from '@aztec/aztec.js';
import {
  TestERC20Abi as FeeJuiceAbi,
  GovernanceAbi,
  GovernanceProposerAbi,
  NewGovernanceProposerPayloadAbi,
  NewGovernanceProposerPayloadBytecode,
  RollupAbi,
} from '@aztec/l1-artifacts';

import fs from 'fs';
import { getAddress, getContract } from 'viem';

import { createNodes } from '../fixtures/setup_p2p_test.js';
import { P2PNetworkTest } from './p2p_network.js';

// Don't set this to a higher value than 9 because each node will use a different L1 publisher account and anvil seeds
const NUM_NODES = 4;
const BOOT_NODE_UDP_PORT = 40600;

const DATA_DIR = './data/gossip';

/**
 * This tests emulate the same test as in l1-contracts/test/governance/scenario/UpgradeGovernanceProposerTest.t.sol
 * but it does so in an end-to-end manner with multiple "real" nodes.
 */
describe('e2e_p2p_governance_proposer', () => {
  let t: P2PNetworkTest;
  let nodes: AztecNodeService[];

  beforeEach(async () => {
    t = await P2PNetworkTest.create('e2e_p2p_network', NUM_NODES, BOOT_NODE_UDP_PORT);
    await t.applyBaseSnapshots();
    await t.setup();
  });

  afterEach(async () => {
    await t.stopNodes(nodes);
    await t.teardown();
    for (let i = 0; i < NUM_NODES; i++) {
      fs.rmSync(`${DATA_DIR}-${i}`, { recursive: true, force: true });
    }
  });

  /**
   * There is some flaky behavior in here, likely similar to what is in the gossip test.
   * For this reason we are not running it as part of the CI.
   * TODO(https://github.com/AztecProtocol/aztec-packages/issues/9164): Currently flakey
   */
  it('Should cast votes to upgrade governanceProposer', async () => {
    // create the bootstrap node for the network
    if (!t.bootstrapNodeEnr) {
      throw new Error('Bootstrap node ENR is not available');
    }

    const governanceProposer = getContract({
      address: getAddress(t.ctx.deployL1ContractsValues.l1ContractAddresses.governanceProposerAddress.toString()),
      abi: GovernanceProposerAbi,
      client: t.ctx.deployL1ContractsValues.publicClient,
    });

    const governance = getContract({
      address: getAddress(t.ctx.deployL1ContractsValues.l1ContractAddresses.governanceAddress.toString()),
      abi: GovernanceAbi,
      client: t.ctx.deployL1ContractsValues.publicClient,
    });

    const rollup = getContract({
      address: t.ctx.deployL1ContractsValues!.l1ContractAddresses.rollupAddress.toString(),
      abi: RollupAbi,
      client: t.ctx.deployL1ContractsValues!.walletClient,
    });

    const waitL1Block = async () => {
      await t.ctx.deployL1ContractsValues.publicClient.waitForTransactionReceipt({
        hash: await t.ctx.deployL1ContractsValues.walletClient.sendTransaction({
          to: emperor.address,
          value: 1n,
          account: emperor,
        }),
      });
    };

    const nextRoundTimestamp = await rollup.read.getTimestampForSlot([
      ((await rollup.read.getCurrentSlot()) / 10n) * 10n + 10n,
    ]);
    await t.ctx.cheatCodes.eth.warp(Number(nextRoundTimestamp));

    const { address: newPayloadAddress } = await deployL1Contract(
      t.ctx.deployL1ContractsValues.walletClient,
      t.ctx.deployL1ContractsValues.publicClient,
      NewGovernanceProposerPayloadAbi,
      NewGovernanceProposerPayloadBytecode,
      [t.ctx.deployL1ContractsValues.l1ContractAddresses.registryAddress.toString()],
    );

    t.logger.info(`Deployed new payload at ${newPayloadAddress}`);

    const emperor = t.ctx.deployL1ContractsValues.walletClient.account;

    const govInfo = async () => {
      const bn = await t.ctx.cheatCodes.eth.blockNumber();
      const slot = await rollup.read.getCurrentSlot();
      const round = await governanceProposer.read.computeRound([slot]);

      const info = await governanceProposer.read.rounds([
        t.ctx.deployL1ContractsValues.l1ContractAddresses.rollupAddress.toString(),
        round,
      ]);
      const leaderVotes = await governanceProposer.read.yeaCount([
        t.ctx.deployL1ContractsValues.l1ContractAddresses.rollupAddress.toString(),
        round,
        info[1],
      ]);
      t.logger.info(
        `Governance stats for round ${round} (Slot: ${slot}, BN: ${bn}). Leader: ${info[1]} have ${leaderVotes} votes`,
      );
      return { bn, slot, round, info, leaderVotes };
    };

    await waitL1Block();

    const govBefore = await govInfo();

    t.logger.info('Creating nodes');
    nodes = await createNodes(
      { ...t.ctx.aztecNodeConfig, governanceProposerPayload: newPayloadAddress },
      t.peerIdPrivateKeys,
      t.bootstrapNodeEnr,
      NUM_NODES,
      BOOT_NODE_UDP_PORT,
      DATA_DIR,
    );

    await sleep(4000);

    t.logger.info('Start progressing time to cast votes');
    const quorumSize = await governanceProposer.read.N();
    t.logger.info(`Quorum size: ${quorumSize}, round size: ${await governanceProposer.read.M()}`);

    let govData;
    while (true) {
      govData = await govInfo();
      if (govData.leaderVotes >= quorumSize) {
        break;
      }
      await sleep(12000);
    }

    expect(govData.leaderVotes).toBeGreaterThan(govBefore.leaderVotes);

    const nextRoundTimestamp2 = await rollup.read.getTimestampForSlot([
      ((await rollup.read.getCurrentSlot()) / 10n) * 10n + 10n,
    ]);
    await t.ctx.cheatCodes.eth.warp(Number(nextRoundTimestamp2));

    await waitL1Block();

    const txHash = await governanceProposer.write.pushProposal([govData.round], { account: emperor, gas: 1_000_000n });
    await t.ctx.deployL1ContractsValues.publicClient.waitForTransactionReceipt({ hash: txHash });

    const token = getContract({
      address: t.ctx.deployL1ContractsValues.l1ContractAddresses.feeJuiceAddress.toString(),
      abi: FeeJuiceAbi,
      client: t.ctx.deployL1ContractsValues.walletClient,
    });

    await token.write.mint([emperor.address, 10000n * 10n ** 18n], { account: emperor });
    await token.write.approve([governance.address, 10000n * 10n ** 18n], { account: emperor });
    const depositTx = await governance.write.deposit([emperor.address, 10000n * 10n ** 18n], { account: emperor });
    await t.ctx.deployL1ContractsValues.publicClient.waitForTransactionReceipt({ hash: depositTx });

    const proposal = await governance.read.getProposal([0n]);

    const timeToActive = proposal.creation + proposal.config.votingDelay;
    await t.ctx.cheatCodes.eth.warp(Number(timeToActive + 1n));

    await waitL1Block();

    const voteTx = await governance.write.vote([0n, 10000n * 10n ** 18n, true], { account: emperor });
    await t.ctx.deployL1ContractsValues.publicClient.waitForTransactionReceipt({ hash: voteTx });

    const timeToExecutable = timeToActive + proposal.config.votingDuration + proposal.config.executionDelay + 1n;
    await t.ctx.cheatCodes.eth.warp(Number(timeToExecutable));

    await waitL1Block();

    expect(await governance.read.governanceProposer()).toEqual(
      getAddress(t.ctx.deployL1ContractsValues.l1ContractAddresses.governanceProposerAddress.toString()),
    );

    const executeTx = await governance.write.execute([0n], { account: emperor });
    await t.ctx.deployL1ContractsValues.publicClient.waitForTransactionReceipt({ hash: executeTx });

    const newGovernanceProposer = await governance.read.governanceProposer();
    expect(newGovernanceProposer).not.toEqual(
      getAddress(t.ctx.deployL1ContractsValues.l1ContractAddresses.governanceProposerAddress.toString()),
    );

    expect(await governance.read.getProposalState([0n])).toEqual(5);
  }, 1_000_000);
});