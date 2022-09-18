import { Module } from '@nestjs/common';
import { PubSubClient } from './pubsub.client';
import { ConfigurableModuleClass } from './pubsub.module-definition';

@Module({
  providers: [PubSubClient],
  exports: [PubSubClient],
})
export class PubSubModule extends ConfigurableModuleClass {}
