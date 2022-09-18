import { EventPattern } from '@nestjs/microservices';
import { PubSubPattern } from '../interfaces';

export function PubSubMessageHandler(pattern: PubSubPattern): MethodDecorator {
  return EventPattern(pattern);
}
