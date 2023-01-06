import {
  ClientConfig,
  PubSub,
  Subscription,
  Topic,
  Attributes,
  SubscriberOptions,
} from '@google-cloud/pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MODULE_OPTIONS_TOKEN } from './pubsub.module-definition';
import {
  PubSubOutgoingRequestSerializedData,
  PubSubClientHealthInfo,
  PubSubPublishData,
} from './interfaces';

@Injectable()
export class PubSubClient extends ClientProxy {
  private pubSubClient: PubSub;
  private subOptions: SubscriberOptions;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) options: ClientConfig,
    subOptions: SubscriberOptions,
  ) {
    super();
    this.pubSubClient = new PubSub(options);
    this.subOptions = subOptions || {};
  }

  public connect(): Promise<void> {
    return Promise.resolve();
  }

  async close(): Promise<void> {
    await this.pubSubClient.close();
  }

  public publishToTopic(
    topic: string,
    publishData: PubSubPublishData,
    attributes?: Attributes,
  ): Promise<string> {
    const request = {
      message: publishData,
      attributes: attributes,
    };
    return lastValueFrom(this.emit(topic, request));
  }

  getSubscription(subscription: string | Subscription): Subscription {
    if (this.isSubscriptionInstance(subscription)) {
      return subscription;
    } else {
      return this.pubSubClient.subscription(subscription, this.subOptions);
    }
  }

  async subscriptionExists(
    subscription: string | Subscription,
  ): Promise<boolean> {
    const existsResponse = await this.getSubscription(subscription).exists();
    return existsResponse[0];
  }

  async createSubscription(
    subscription: string | Subscription,
    topic?: string | Topic,
  ): Promise<Subscription | null> {
    subscription = this.getSubscription(subscription);

    if (subscription.topic === null && topic === null) return null;

    topic = this.getTopic(subscription.topic ?? topic);

    const createSubscriptionResposne = await topic.createSubscription(
      subscription.name,
      this.subOptions,
    );
    return createSubscriptionResposne[0];
  }

  async deleteSubscription(subscription: string | Subscription): Promise<void> {
    await this.getSubscription(subscription).delete();
  }

  getTopic(topic: string | Topic): Topic {
    if (this.isTopicInstance(topic)) {
      return topic;
    } else {
      return this.pubSubClient.topic(topic);
    }
  }

  async topicExists(topic: string | Topic): Promise<boolean> {
    const existsResponse = await this.getTopic(topic).exists();
    return existsResponse[0];
  }

  async createTopic(topic: string | Topic): Promise<Topic> {
    const createResponse = await this.getTopic(topic).create();
    return createResponse[0];
  }

  async deleteTopic(topic: string | Topic): Promise<void> {
    await this.getTopic(topic).delete();
  }

  public getHealth(): PubSubClientHealthInfo {
    return {
      isOpen: this.pubSubClient.isOpen,
      isEmulator: this.pubSubClient.isEmulator,
      projectId: this.pubSubClient.projectId,
    };
  }

  protected dispatchEvent(
    packet: PubSubOutgoingRequestSerializedData,
  ): Promise<any> {
    const topic = this.pubSubClient.topic(packet.pattern);
    if (Buffer.isBuffer(packet.data.message)) {
      return topic.publishMessage({
        data: packet.data.message,
        attributes: packet.data.attributes,
      });
    }
    return topic.publishMessage({
      json: packet.data.message,
      attributes: packet.data.attributes,
    });
  }

  private isTopicInstance(topic?: Topic | string | null): topic is Topic {
    return topic instanceof Topic;
  }

  private isSubscriptionInstance(
    subscription?: Subscription | string | null,
  ): subscription is Subscription {
    return subscription instanceof Subscription;
  }

  protected publish(): any {
    throw new Error('Method intentionally not implemented.');
  }
}
