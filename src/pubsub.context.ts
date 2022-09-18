import { Message } from '@google-cloud/pubsub';
import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import { PubSubAckFunction, PubSubNackFunction } from './interfaces';

interface PubSubContextArgs {
  message: Message;
  pattern: string;
  autoAck: boolean;
  autoNack: boolean;
}

export class PubSubContext extends BaseRpcContext<PubSubContextArgs> {
  constructor(args: PubSubContextArgs) {
    super(args);
  }

  public getMessage(): Message {
    return this.args.message;
  }

  public getPattern(): string {
    return this.args.pattern;
  }

  public getAckFunction(): PubSubAckFunction {
    this.setAutoAck(false);
    return () => this.args.message.ack();
  }

  public getAutoAck(): boolean {
    return this.args.autoAck;
  }

  private setAutoAck(value: boolean): void {
    this.args.autoAck = value;
  }

  public getNackFunction(): PubSubNackFunction {
    this.setAutoNack(false);
    return () => this.args.message.nack();
  }

  public getAutoNack(): boolean {
    return this.args.autoNack;
  }

  private setAutoNack(value: boolean): void {
    this.args.autoNack = value;
  }
}
