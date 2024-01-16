import { ApolloDriverConfig } from '@nestjs/apollo';

import {
  defineStartupConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

declare module '../../fundamentals/config-new' {
  interface AppConfig {
    graphql: ModuleConfig<ApolloDriverConfig>;
  }
}

defineStartupConfig('graphql', {
  buildSchemaOptions: {
    numberScalarMode: 'integer',
  },
  introspection: true,
  playground: true,
});
