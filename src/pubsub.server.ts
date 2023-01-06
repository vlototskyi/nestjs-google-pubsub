import {
  CustomTransportStrategy,
  ReadPacket,
  Server,
} from '@nestjs/microservices';
import { Topic, Subscription, Message } from '@google-cloud/pubsub';
import { MESSAGE_EVENT } from '@nestjs/microservices/constants';
import { PubSubContext } from './pubsub.context';
import { PubSubClient } from './pubsub.client';
import { PubSubDeserializer } from './deserializers';
import { BasicPubSubAckStrategy, BasicPubSubNackStrategy } from './strategies';
import { PubSubOptions, PubSubPattern } from './interfaces';
import { InvalidPatternException, TransportError } from './errors';
import { isObservable, lastValueFrom } from 'rxjs';

export class PubSubServer extends Server implements CustomTransportStrategy {
  private readonly pubSubClient: PubSubClient;
  private readonly subscriptions: Map<string, Subscription> = new Map();
  protected readonly deserializer: PubSubDeserializer;
  private readonly autoAck: boolean;
  private readonly autoNack: boolean;
  private readonly ackStrategy: BasicPubSubAckStrategy;
  private readonly nackStrategy: BasicPubSubNackStrategy;

  constructor(protected readonly options: PubSubOptions) {
    super();

    this.pubSubClient = new PubSubClient(options.client, { flowControl: options?.flowControl });
    this.deserializer = new PubSubDeserializer();
    this.autoAck = options?.autoAck ?? true;
    this.autoNack = options?.autoNack ?? false;
    this.ackStrategy = options?.ackStrategy ?? new BasicPubSubAckStrategy();
    this.nackStrategy = options?.nackStrategy ?? new BasicPubSubNackStrategy();
  }

  async listen(callback: () => void) {
    this.bindHandlers(callback);
  }

  async bindHandlers(callback: () => void) {
    for (const messageHandler of this.messageHandlers) {
      await this.getSubscriptionFromPattern(messageHandler[0]);
    }

    this.subscriptions.forEach((subscription, pattern) => {
      subscription.on(MESSAGE_EVENT, async (message: Message) => {
        const packet = this.deserializer.deserialize(message, {
          pattern,
          additionalPatternProperties: this.options.additionalPatternProperties,
        });
        const ctx = new PubSubContext({
          message,
          pattern: packet.pattern,
          autoAck: this.autoAck,
          autoNack: this.autoNack,
        });
        this.handleMessage(packet, ctx);
      });
    });

    callback();
  }

  private async getSubscriptionFromPattern(pattern: string): Promise<void> {
    const { subscription: subscriptionName, topic: topicName } =
      this.parsePattern(pattern);

    const subscription: Subscription | null =
      await this.getOrCreateSubscription(subscriptionName, topicName);

    if (subscription) {
      this.logger.log(`Mapped {${subscription.name}} handler`);
      this.subscriptions.set(
        JSON.stringify({ topic: topicName, subscription: subscriptionName }),
        subscription,
      );
    }
  }

  private async getOrCreateSubscription(
    subscriptionName: string,
    topicName: string | undefined,
  ): Promise<Subscription | null> {
    const subscriptionExists = await this.pubSubClient.subscriptionExists(
      subscriptionName,
    );

    if (subscriptionExists)
      return this.pubSubClient.getSubscription(subscriptionName);

    const topic: Topic | null = this.pubSubClient.getTopic(topicName);

    return this.pubSubClient.createSubscription(subscriptionName, topic);
  }

  private parsePattern(pattern: string): PubSubPattern {
    try {
      return JSON.parse(pattern);
    } catch (error) {
      throw new InvalidPatternException(pattern);
    }
  }

  private async handleMessage(
    packet: ReadPacket<Message>,
    ctx: PubSubContext,
  ): Promise<void> {
    const handler = this.getHandlerByPattern(packet.pattern);
    const ack = packet.data.ack.bind(packet.data);
    const nack = packet.data.nack.bind(packet.data);
    try {
      if (!handler) {
        throw new TransportError(
          'Handler should never be nullish.',
          packet.pattern,
          Array.from(this.messageHandlers.keys()),
        );
      }
      const result = await handler(packet.data, ctx);
      if (isObservable(result)) {
        await lastValueFrom(result);
      }
      await this.ackStrategy.ack(ack, nack, ctx);
    } catch (err) {
      await this.nackStrategy.nack(err, ack, nack, ctx);
    }
  }

  public async close(): Promise<void> {
    for (const subscription of this.subscriptions) {
      await subscription[1].close();
    }
    await this.pubSubClient.close();
  }
}
