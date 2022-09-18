import { ClientConfig } from '@google-cloud/pubsub';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ClientConfig>()
    .setClassMethodName('forRoot')
    .build();
