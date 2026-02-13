import { deepClone } from '@vunio/utils';
import { createConfigsManager, useConfigsResultType } from '../useConfigs';
import { onUnmounted, Reactive } from 'vue';
import { baseConfig } from '@vunio/ui';

/**
 * 带有 $key 属性的配置项类型
 */
export type ConfigWithKey<T> = T & { $key?: any };

/**
 * useRepeatConfig 返回值类型
 */
export interface UseRepeatConfigResult<T extends Omit<baseConfig, 'component'>> {
  /** 收集的配置映射 */
  collectConfigs: Map<any, useConfigsResultType<T>>;
  /** 收集配置的方法，返回带有 $key 的配置数组 */
  collect: (key: any) => Reactive<ConfigWithKey<T>[]>;
  /** 获取指定 key 的配置实例 */
  getConfig: (key: any) => useConfigsResultType<T> | undefined;
}

export function useRepeatConfig<T extends Omit<baseConfig, 'component'>>(
  configData: T[],
): UseRepeatConfigResult<T> {
  const collectConfigs = new Map<any, useConfigsResultType<T>>();

  function collect(key: any): Reactive<ConfigWithKey<T>[]> {
    const existing = getConfig(key);
    if (existing) {
      return existing.config as Reactive<ConfigWithKey<T>[]>;
    }

    // 使用工厂函数创建配置管理器（符合 Vue 3 规范）
    const manager = createConfigsManager<T>(deepClone(configData));
    manager.config.forEach((item: any) => {
      item.$key = key;
    });

    collectConfigs.set(key, manager);
    return manager.config as Reactive<ConfigWithKey<T>[]>;
  }

  function getConfig(key: any) {
    return collectConfigs.get(key);
  }

  onUnmounted(() => {
    collectConfigs.forEach((configInstance) => {
      configInstance.cleanup();
    });
    collectConfigs.clear();
  });

  return {
    collectConfigs,
    collect,
    getConfig,
  };
}
