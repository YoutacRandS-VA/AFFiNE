import { defineStartupConfig, ModuleConfig } from '../config-new';

declare module '../config-new' {
  interface AppConfig {
    metrics: ModuleConfig<{
      /**
       * Enable metric and tracing collection
       */
      enabled: boolean;
    }>;
  }
}

defineStartupConfig('metrics', {
  enabled: false,
});
