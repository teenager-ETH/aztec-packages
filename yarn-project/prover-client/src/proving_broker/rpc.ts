import { ProvingJobConsumer, ProvingJobProducer } from '@aztec/circuit-types';
import { createSafeJsonRpcClient, makeFetch } from '@aztec/foundation/json-rpc/client';
import { createSafeJsonRpcServer } from '@aztec/foundation/json-rpc/server';

import { type ProvingBroker } from './proving_broker.js';

export function createProvingBrokerServer(broker: ProvingBroker) {
  return createSafeJsonRpcServer(broker, {
    ...ProvingJobConsumer,
    ...ProvingJobProducer,
  } as any); // 😭
}

export function createProvingJobProducer(url: string, fetch = makeFetch([1, 2, 3], false)): ProvingJobProducer {
  return createSafeJsonRpcClient(url, ProvingJobProducer, false, 'provingJobProducer', fetch);
}

export function createProvingJobConsumer(url: string, fetch = makeFetch([1, 2, 3], false)): ProvingJobConsumer {
  return createSafeJsonRpcClient(
    url,
    ProvingJobConsumer as any, // 😭
    false,
    'provingJobConsumer',
    fetch,
  );
}
