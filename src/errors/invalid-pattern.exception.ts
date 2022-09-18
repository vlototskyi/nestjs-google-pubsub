import { RpcException } from '@nestjs/microservices';

export class InvalidPatternException extends RpcException {
  public pattern: string;
  constructor(pattern: string) {
    super(`The supplied pattern metadata is invalid: ${pattern}`);
    this.pattern = pattern;
  }
}
