import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PubSubContext } from '../pubsub.context';

export const getNackFn = (
  data: unknown,
  ctx: ExecutionContext,
): (() => void) => {
  const pubSubCtx: PubSubContext = ctx.switchToRpc().getContext();
  return pubSubCtx.getNackFunction();
};

export const PubSubMessageNack = createParamDecorator(getNackFn);
