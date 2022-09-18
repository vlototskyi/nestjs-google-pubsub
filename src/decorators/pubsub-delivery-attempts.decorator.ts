import { Message } from '@google-cloud/pubsub';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PubSubContext } from '../pubsub.context';

export const getDeliveryAttempts = (
  key: string | undefined,
  ctx: ExecutionContext,
): number => {
  const message: Message = ctx
    .switchToRpc()
    .getContext<PubSubContext>()
    .getMessage();
  return message.deliveryAttempt;
};

export const PubSubMessageDeliveryAttempts = createParamDecorator<
  string | undefined
>(getDeliveryAttempts);
