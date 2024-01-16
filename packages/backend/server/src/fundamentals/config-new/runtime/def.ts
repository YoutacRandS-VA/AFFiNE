export interface RuntimeConfigs {
  // auth
  'auth/allowRegistration': boolean;
  'auth/allowEmailLogin': boolean;
  'auth/allowOAuthLogin': boolean;
  'auth/requireEmailVerification': boolean;

  // feature flags
  'feature/copilot': boolean;
}

export type RuntimeConfigKey = keyof RuntimeConfigs;
export type RuntimeConfig<T extends RuntimeConfigKey> = RuntimeConfigs[T];
type Scope<T extends string> = T extends `${infer S}/${infer _}` ? S : never;
export type RuntimeConfigScope = Scope<RuntimeConfigKey>;
export type RuntimeConfigByScope<T extends RuntimeConfigScope> = {
  [K in RuntimeConfigKey as Scope<K> extends T ? K : never]: RuntimeConfig<K>;
};
