import { S3ClientConfigType } from '@aws-sdk/client-s3';

import {
  defineStartupConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

type WARNING = '__YOU_SHOULD_NOT_MANUALLY_CONFIGURATE_THIS_TYPE__';
declare module '../../fundamentals/storage/config' {
  interface StorageProvidersConfig {
    // the type here is only existing for extends [StorageProviderType] with better type inference and checking.
    'cloudflare-r2'?: WARNING;
    'aws-s3'?: WARNING;
  }
}

declare module '../config' {
  interface PluginConfig {
    'aws-s3': ModuleConfig<S3ClientConfigType>;
    'cloudflare-r2': ModuleConfig<
      S3ClientConfigType & {
        accountId?: string;
      }
    >;
  }
}

defineStartupConfig('plugins.aws-s3', {});
defineStartupConfig('plugins.cloudflare-r2', {});
