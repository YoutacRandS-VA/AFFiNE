import { DynamicModule, FactoryProvider } from '@nestjs/common';
import { merge } from 'lodash-es';

import { ApplyType } from '../utils/types';
import { NewAFFiNEConfig } from './def';

/**
 * @example
 *
 * import { Config } from '@affine/server'
 *
 * class TestConfig {
 *   constructor(private readonly config: Config) {}
 *   test() {
 *     return this.config.env
 *   }
 * }
 */
export class NewConfig extends ApplyType<NewAFFiNEConfig>() {}

function createConfigProvider(
  override?: DeepPartial<NewConfig>
): FactoryProvider<NewConfig> {
  return {
    provide: NewConfig,
    useFactory: () => {
      return Object.freeze(merge({}, globalThis.NEW_AFFiNE, override));
    },
  };
}

export class NewConfigModule {
  static forRoot = (override?: DeepPartial<NewConfig>): DynamicModule => {
    const provider = createConfigProvider(override);

    return {
      global: true,
      module: NewConfigModule,
      providers: [provider],
      exports: [provider],
    };
  };
}
