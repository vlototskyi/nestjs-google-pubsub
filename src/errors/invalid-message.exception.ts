import { RpcException } from '@nestjs/microservices';

export class InvalidMessageException extends RpcException {
  public messageData: string;
  constructor(messageData: string) {
    super(`The supplied message data can't be parsed: ${messageData}`);
    this.messageData = messageData;
  }
}
