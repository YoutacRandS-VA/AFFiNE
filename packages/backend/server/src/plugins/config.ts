import { ModuleStartupConfigDescriptions } from '../fundamentals/config-new/types';
import { CopilotConfig } from './copilot';
import { GCloudConfig } from './gcloud';
import { OAuthConfig } from './oauth';
import { PaymentConfig } from './payment';
import { RedisOptions } from './redis';
import { R2StorageConfig, S3StorageConfig } from './storage';

export interface PluginsConfig {
  readonly copilot: CopilotConfig;
  readonly payment: PaymentConfig;
  readonly redis: RedisOptions;
  readonly gcloud: GCloudConfig;
  readonly 'cloudflare-r2': R2StorageConfig;
  readonly 'aws-s3': S3StorageConfig;
  readonly oauth: OAuthConfig;
}

export type AvailablePlugins = keyof PluginsConfig;

declare module '../fundamentals/config' {
  interface AFFiNEConfig {
    readonly plugins: {
      enabled: Set<AvailablePlugins>;
      use<Plugin extends AvailablePlugins>(
        plugin: Plugin,
        config?: DeepPartial<PluginsConfig[Plugin]>
      ): void;
    } & Partial<PluginsConfig>;
  }
}

declare module '../fundamentals/config-new' {
  interface AppPluginConfig {
    use<Plugin extends AvailablePlugins>(
      plugin: Plugin,
      config: ModuleStartupConfigDescriptions<PluginConfig[Plugin]>
    ): void;
  }
}

export interface PluginConfig {}

declare module '../fundamentals/config-new' {
  interface AppConfig {
    plugins: PluginConfig;
  }
}
