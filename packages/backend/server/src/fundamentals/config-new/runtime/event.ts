import { OnEvent } from '../../event';
import { Payload } from '../../event/def';
import {
  RuntimeConfig,
  RuntimeConfigByScope,
  RuntimeConfigKey,
  RuntimeConfigScope,
} from './def';

declare module '../../event/def' {
  interface EventDefinitions {
    runtimeConfig: {
      [K in RuntimeConfigKey | RuntimeConfigScope]: {
        changed: Payload<
          K extends RuntimeConfigScope
            ? Partial<RuntimeConfigByScope<K>>
            : // @ts-expect-error allow
              RuntimeConfig<K>
        >;
      };
    };
  }
}

export const OnRuntimeConfigChange = (
  scopeOrName: RuntimeConfigKey | RuntimeConfigScope
) => {
  return OnEvent(`runtimeConfig.${scopeOrName}.changed`);
};
