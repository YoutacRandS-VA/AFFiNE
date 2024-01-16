import { get, merge, set } from 'lodash-es';

import {
  AppModulesConfigDef,
  AppStartupConfig,
  ModuleRuntimeConfigDescriptions,
  ModuleStartupConfigDescriptions,
  RuntimeConfigDescription,
} from './types';

export const staticConfigsDefault: AppStartupConfig = {} as any;
export const runtimeConfigsDefault: Array<{
  module: string;
  name: string;
  value: any;
}> = [];

function registerRuntimeConfig(
  module: string,
  configs: Record<string, any>,
  parent = ''
) {
  Object.entries(configs).forEach(([key, value]) => {
    if (parent) {
      key = `${parent}.${key}`;
    }

    // config item
    if ('desc' in value && typeof value.desc === 'string') {
      const item = value as RuntimeConfigDescription<any>;

      runtimeConfigsDefault.push({
        module,
        name: 'key',
        value: item.default,
      });
    } else {
      parent = key;
      registerRuntimeConfig(module, value, parent);
    }
  });
}

export function defineStartupConfig<T extends keyof AppModulesConfigDef>(
  module: T,
  configs: ModuleStartupConfigDescriptions<AppModulesConfigDef[T]>
) {
  set(
    staticConfigsDefault,
    module,
    merge(get(staticConfigsDefault, module, {}), configs)
  );
}

export function defineRuntimeConfig<T extends keyof AppModulesConfigDef>(
  module: T,
  configs: ModuleRuntimeConfigDescriptions<AppModulesConfigDef[T]>
) {
  registerRuntimeConfig(module, configs);
}
