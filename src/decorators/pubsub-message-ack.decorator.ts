import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PubSubContext } from '../pubsub.context';

export const getAckFn = (
  data: unknown,
  ctx: ExecutionContext,
): (() => void) => {
  const pubSubCtx: PubSubContext = ctx
    .switchToRpc()
    .getContext<PubSubContext>();
  return pubSubCtx.getAckFunction();
};

export const PubSubMessageAck = createParamDecorator(getAckFn);
