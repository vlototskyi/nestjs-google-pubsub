import { ClientConfig } from '@google-cloud/pubsub';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ClientConfig>()
    .setExtras<{ isGlobal?: boolean }>(
      { isGlobal: true },
      (definition, extras) => {
        console.log('extras', extras);
        return { ...definition, global: extras.isGlobal };
      },
    )
    .setClassMethodName('forRoot')
    .build();
