import { PubSubContext } from '../pubsub.context';

export type PubSubAckFunction = () => void;
export type PubSubNackFunction = () => void;

export type PubSubAckHandler = (
  ack: PubSubAckFunction,
  nack: PubSubNackFunction,
  ctx: PubSubContext,
) => Promise<void>;

export interface PubSubAckStrategy {
  ack: PubSubAckHandler;
}

export type PubSubNackHandler<T = unknown> = (
  error: T,
  ack: PubSubAckFunction,
  nack: PubSubNackFunction,
  ctx: PubSubContext,
) => Promise<void>;

export interface PubSubNackStrategy {
  nack: PubSubNackHandler;
}
