import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Cache } from '../cache';
import { Config } from '../config';
import { EventEmitter } from '../event';
import {
  DefaultRuntimeConfigs,
  type RuntimeConfig,
  RuntimeConfigByScope,
  type RuntimeConfigKey,
  RuntimeConfigs,
  RuntimeConfigScope,
} from './def';

/**
 * runtime.get(k)
 * runtime.set(k, v)
 * runtime.update(k, (v) => {
 *   v.xxx = 'yyy';
 *   return v
 * })
 */

@Injectable()
export class Runtime {
  constructor(
    public config: Config,
    private readonly defaultConfig: DefaultRuntimeConfigs,
    private readonly db: PrismaClient,
    private readonly cache: Cache,
    private readonly event: EventEmitter
  ) {}

  private parseKey<K extends RuntimeConfigKey>(key: K) {
    const [scope, name] = key.split('/');

    return {
      scope: scope as RuntimeConfigScope,
      name: name as string,
    };
  }

  async get<K extends RuntimeConfigKey, V extends RuntimeConfig<K>>(
    k: K
  ): Promise<V> {
    const cached = await this.loadCache<K, V>(k);

    if (cached) {
      return cached;
    }

    const dbValue = await this.loadDb<K, V>(k);

    if (!dbValue) {
      throw new Error(`Runtime config ${k} not found`);
    }

    await this.setCache(k, dbValue);

    return dbValue;
  }

  async list(): Promise<RuntimeConfigs>;
  async list<S extends RuntimeConfigScope>(
    scope: S
  ): Promise<RuntimeConfigByScope<S>>;
  async list(scope?: RuntimeConfigScope): Promise<any> {
    const records = await this.db.applicationSetting.findMany({
      where: scope ? { scope } : undefined,
    });

    return records.reduce(
      (configs, record) => {
        configs[`${record.scope}/${record.name}`] = record.value;

        return configs;
      },
      {} as Record<string, any>
    );
  }

  async set<K extends RuntimeConfigKey, V extends RuntimeConfig<K>>(
    key: K,
    value: V
  ) {
    const parsedKey = this.parseKey(key);
    const setting = await this.db.applicationSetting.upsert({
      where: {
        scope_name: parsedKey,
      },
      create: {
        ...parsedKey,
        value,
      },
      update: {
        value,
      },
    });

    await this.setCache(key, setting.value as V);
    this.event.emit(`runtimeConfig.${parsedKey.scope}.changed`, {
      [key]: setting.value,
    });
    this.event.emit(`runtimeConfig.${key}.changed`, setting.value as V);
    return setting;
  }

  async update<K extends RuntimeConfigKey, V extends RuntimeConfig<K>>(
    k: K,
    modifier: (v: V) => V | Promise<V>
  ) {
    const data = await this.loadDb<K, V>(k);

    const updated = await modifier(data);

    await this.set(k, updated);

    return updated;
  }

  async loadDb<K extends RuntimeConfigKey, V extends RuntimeConfig<K>>(
    k: K
  ): Promise<V> {
    const v = await this.db.applicationSetting.findUnique({
      where: {
        scope_name: this.parseKey(k),
      },
    });

    if (v) {
      return v.value as V;
    } else {
      return this.defaultConfig[k] as V;
    }
  }

  async loadCache<K extends RuntimeConfigKey, V extends RuntimeConfig<K>>(
    k: K
  ): Promise<V | undefined> {
    return this.cache.get<V>(`SERVER_RUNTIME:${k}`);
  }

  async setCache<K extends RuntimeConfigKey, V extends RuntimeConfig<K>>(
    k: K,
    v: V
  ): Promise<boolean> {
    return this.cache.set<V>(`SERVER_RUNTIME:${k}`, v, { ttl: 60 * 1000 });
  }
}
