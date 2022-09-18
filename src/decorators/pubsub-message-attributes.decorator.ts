import { Message } from '@google-cloud/pubsub';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PubSubContext } from '../pubsub.context';

export const getMessageAttrs = (
  key: string | undefined,
  ctx: ExecutionContext,
): (string | undefined) | Record<string, string> => {
  const message: Message = ctx
    .switchToRpc()
    .getContext<PubSubContext>()
    .getMessage();
  const attrs = message.attributes;
  if (attrs && key) {
    return attrs[key];
  }
  return attrs;
};

export const PubSubMessageAttributes = createParamDecorator<string | undefined>(
  getMessageAttrs,
);
