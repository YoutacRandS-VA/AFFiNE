import {
  defineStartupConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

export interface GCloudConfig {
  enabled: boolean;
}
declare module '../config' {
  interface PluginConfig {
    gcloud: ModuleConfig<GCloudConfig>;
  }
}

defineStartupConfig('plugins.gcloud', {
  enabled: false,
});
