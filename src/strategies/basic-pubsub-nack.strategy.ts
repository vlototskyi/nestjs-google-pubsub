import { PubSubContext } from '../pubsub.context';
import {
  PubSubAckFunction,
  PubSubNackFunction,
  PubSubNackStrategy,
} from '../interfaces';

export class BasicPubSubNackStrategy implements PubSubNackStrategy {
  public nack(
    error: unknown,
    ack: PubSubAckFunction,
    nack: PubSubNackFunction,
    ctx: PubSubContext,
  ): Promise<void> {
    if (ctx.getAutoNack()) {
      nack();
    }
    return Promise.resolve();
  }
}
