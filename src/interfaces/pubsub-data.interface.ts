import { ReadPacket } from '@nestjs/microservices';
import { Attributes } from '@google-cloud/pubsub';

export type PubSubPublishData = Buffer | Record<string, any>;

export interface PubSubOutgoingRequestData {
  message: PubSubPublishData;
  attributes?: Attributes;
}

export interface PubSubOutgoingRequestSerializedData extends ReadPacket {
  data: PubSubOutgoingRequestData;
}
