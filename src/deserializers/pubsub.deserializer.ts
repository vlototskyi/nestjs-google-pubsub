import { Message } from '@google-cloud/pubsub';
import { Deserializer, ReadPacket } from '@nestjs/microservices';
import { pick } from 'lodash';
import { InvalidMessageException } from '../errors';

export class PubSubDeserializer
  implements Deserializer<Message, ReadPacket<Message>>
{
  deserialize(
    message: Message,
    options: { pattern: string; additionalPatternProperties?: string[] },
  ): ReadPacket<Message> {
    let parsedMessage: any, parsedPattern: any;
    try {
      parsedMessage = JSON.parse(message.data.toString());
      parsedPattern = JSON.parse(options.pattern);
    } catch (error) {
      throw new InvalidMessageException(message.data.toString());
    }
    return {
      pattern: JSON.stringify({
        ...parsedPattern,
        ...pick(parsedMessage, options.additionalPatternProperties),
      }),
      data: message,
    };
  }
}
