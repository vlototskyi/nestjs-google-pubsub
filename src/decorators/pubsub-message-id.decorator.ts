import { Message } from '@google-cloud/pubsub';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PubSubContext } from '../pubsub.context';

export const getMessageId = (
  key: string | undefined,
  ctx: ExecutionContext,
): string => {
  const message: Message = ctx
    .switchToRpc()
    .getContext<PubSubContext>()
    .getMessage();
  return message.id;
};

export const PubSubMessageId = createParamDecorator<string | undefined>(
  getMessageId,
);
