import { Join, PathType } from '../utils/types';

export type ConfigItem<T> = T & { __type: 'ConfigItem' };

type ConfigDef = Record<string, any> | never;

export interface ModuleConfig<
  Startup extends ConfigDef = never,
  Runtime extends ConfigDef = never,
> {
  startup: Startup;
  runtime: Runtime;
}

export type RuntimeConfigDescription<T> = {
  desc: string;
  default: T;
};

type RuntimeConfigDescriptions<T extends ConfigDef> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends ConfigItem<infer V>
      ? RuntimeConfigDescription<V>
      : RuntimeConfigDescriptions<T[K]>
    : RuntimeConfigDescription<T[K]>;
};

type StartupConfigDescriptions<T extends ConfigDef> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends ConfigItem<infer V>
      ? V
      : T[K]
    : T[K];
};

export type ModuleStartupConfigDescriptions<T extends ModuleConfig<any, any>> =
  T extends ModuleConfig<infer S, any>
    ? S extends never
      ? undefined
      : StartupConfigDescriptions<S>
    : never;
export type ModuleRuntimeConfigDescriptions<T extends ModuleConfig<any, any>> =
  T extends ModuleConfig<any, infer R>
    ? R extends never
      ? undefined
      : RuntimeConfigDescriptions<R>
    : never;

export type Leaves<T, P extends string = ''> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends ModuleConfig<any, any>
            ? K
            : Join<K, Leaves<T[K], P>>
          : never;
      }[keyof T]
    : never;

export type Flatten<T extends Record<string, any>> = {
  // @ts-expect-error allow
  [K in Leaves<T>]: PathType<T, K>;
};

type _AppStartupConfig<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends ModuleConfig<infer S, any>
    ? S
    : _AppStartupConfig<T[K]>;
};

export interface AppConfig {}
export type AppModulesConfigDef = Flatten<AppConfig>;
export type AppStartupConfig = _AppStartupConfig<AppConfig>;
