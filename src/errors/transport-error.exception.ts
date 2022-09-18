import { RpcException } from '@nestjs/microservices';

export class TransportError extends RpcException {
  public pattern: string;
  public knownHandlers: string[];
  constructor(message: string, pattern: string, knownHandlers: string[]) {
    super(`An error has occurred in the GooglePubSub transport: ${message}`);
    this.pattern = pattern;
    this.knownHandlers = knownHandlers;
  }
}
