import { RedisOptions } from 'ioredis';

import {
  defineStartupConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

declare module '../config' {
  interface PluginConfig {
    redis: ModuleConfig<RedisOptions>;
  }
}

defineStartupConfig('plugins.redis', {});
