import { FlowControlOptions } from '@google-cloud/pubsub/build/src/lease-manager'
import { ClientConfig } from '@google-cloud/pubsub';

import {
  PubSubAckStrategy,
  PubSubNackStrategy,
} from './pubsub-strategy.interface';

export interface PubSubOptions {
  client: ClientConfig;
  autoAck?: boolean;
  autoNack?: boolean;
  ackStrategy?: PubSubAckStrategy;
  nackStrategy?: PubSubNackStrategy;
  additionalPatternProperties?: string[];
  flowControl: FlowControlOptions;
}
