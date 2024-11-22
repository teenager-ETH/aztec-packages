import { BBNativeRollupProver, TestCircuitProver } from '@aztec/bb-prover';
import { ProverAgentApiSchema, type ServerCircuitProver } from '@aztec/circuit-types';
import { type NamespacedApiHandlers } from '@aztec/foundation/json-rpc/server';
import { type LogFn } from '@aztec/foundation/log';
import {
  InlineProofStore,
  type ProverClientConfig,
  ProvingAgent,
  createProvingJobConsumer,
  proverClientConfigMappings,
} from '@aztec/prover-client';
import {
  type TelemetryClientConfig,
  createAndStartTelemetryClient,
  telemetryClientConfigMappings,
} from '@aztec/telemetry-client/start';

import { extractRelevantOptions } from '../util.js';

export async function startProverAgent(
  options: any,
  signalHandlers: (() => Promise<void>)[],
  services: NamespacedApiHandlers,
  logger: LogFn,
) {
  const proverConfig = extractRelevantOptions<ProverClientConfig>(options, proverClientConfigMappings, 'prover');
  const proverJobSourceUrl = proverConfig.proverBrokerUrl ?? proverConfig.nodeUrl;
  if (!proverJobSourceUrl) {
    throw new Error('Starting prover without PROVER_JOB_SOURCE_URL is not supported');
  }

  logger(`Connecting to prover at ${proverJobSourceUrl}`);
  const source = createProvingJobConsumer(proverJobSourceUrl);

  const telemetryConfig = extractRelevantOptions<TelemetryClientConfig>(options, telemetryClientConfigMappings, 'tel');
  const telemetry = await createAndStartTelemetryClient(telemetryConfig);

  let circuitProver: ServerCircuitProver;
  if (!proverConfig.proverAgentFakeProofs) {
    if (!proverConfig.acvmBinaryPath || !proverConfig.bbBinaryPath) {
      throw new Error('Cannot start prover without simulation or native prover options');
    }
    circuitProver = await BBNativeRollupProver.new(proverConfig, telemetry);
  } else {
    circuitProver = new TestCircuitProver(telemetry, undefined, {
      proverTestDelayMs: proverConfig.proverAgentFakeProofDelay ? 1000 : 0,
    });
  }

  const { proverAgentPollIntervalMs } = proverConfig;
  const agent = new ProvingAgent(
    source,
    new InlineProofStore(),
    circuitProver,
    proverConfig.proverAgentProofTypes,
    proverAgentPollIntervalMs,
  );

  agent.start();

  logger(`Started prover agent`);

  services.prover = [agent, ProverAgentApiSchema];
  signalHandlers.push(() => agent.stop());
}
