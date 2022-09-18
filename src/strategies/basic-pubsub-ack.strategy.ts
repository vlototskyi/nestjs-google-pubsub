import { PubSubContext } from '../pubsub.context';
import {
  PubSubAckFunction,
  PubSubAckStrategy,
  PubSubNackFunction,
} from '../interfaces';

export class BasicPubSubAckStrategy implements PubSubAckStrategy {
  public ack(
    ack: PubSubAckFunction,
    nack: PubSubNackFunction,
    ctx: PubSubContext,
  ): Promise<void> {
    if (ctx.getAutoAck()) {
      ack();
    }
    return Promise.resolve();
  }
}
