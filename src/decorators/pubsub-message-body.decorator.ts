import { Message } from '@google-cloud/pubsub';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PubSubContext } from '../pubsub.context';

export const getMessageBody = (
  key: string | undefined,
  ctx: ExecutionContext,
): Record<string, unknown> | unknown => {
  const message: Message = ctx
    .switchToRpc()
    .getContext<PubSubContext>()
    .getMessage();
  try {
    const body = JSON.parse(message.data.toString());
    if (key) {
      return body[key];
    }
    return body;
  } catch (error) {
    return null;
  }
};

export const PubSubMessageBody = createParamDecorator<string | undefined>(
  getMessageBody,
);
