import type { ClientOptions as OpenAIClientOptions } from 'openai';

import {
  defineStartupConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';
import type { FalConfig } from './providers/fal';

export interface CopilotStartupConfigurations {
  openai?: OpenAIClientOptions;
  fal?: FalConfig;
  unsplashKey?: string;
}

declare module '../config' {
  interface PluginConfig {
    copilot: ModuleConfig<CopilotStartupConfigurations>;
  }
}

defineStartupConfig('plugins.copilot', {});
