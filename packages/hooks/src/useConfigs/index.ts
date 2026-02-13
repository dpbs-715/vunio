import {
  computed,
  ComputedRef,
  getCurrentInstance,
  onUnmounted,
  Reactive,
  reactive,
  isReactive,
  isRef,
  MaybeRef,
  unref,
  watch,
} from 'vue';
import type { baseConfig } from '@vunio/ui';

export interface useConfigsResultType<
  T extends Omit<baseConfig, 'component'>,
> extends UseConfigsTuple<T> {
  config: Reactive<T[]>;
  setHidden: (fields: string[], state: boolean) => void;
  setDisabled: (fields: string[], state: boolean) => void;
  setDisabledAll: (state?: boolean) => void;
  setPropsByField: (field: string, props: Record<string, any>) => void;
  getConfigByField: (field: string) => T | undefined;
  filterConfigs: (predicate: (item: T) => boolean) => T[];
  cleanup: () => void;
}

type UseConfigsTuple<T> = [
  Reactive<T[]>,
  (fields: string[], state: boolean) => void,
  (fields: string[], state: boolean) => void,
  (state?: boolean) => void,
  (field: string, props: Record<string, any>) => void,
  (field: string) => T | undefined,
  (predicate: (item: T) => boolean) => T[],
  () => void,
];

/**
 * 创建配置管理器（工厂函数）
 */
export function createConfigsManager<T extends Omit<baseConfig, 'component'>>(
  initialConfig: MaybeRef<T[]>,
): useConfigsResultType<T> {
  const unwrapped = unref(initialConfig);
  const config = isReactive(unwrapped)
    ? (unwrapped as Reactive<T[]>)
    : (reactive(unwrapped as unknown as T[]) as Reactive<T[]>);

  if (isRef(initialConfig)) {
    watch(
      () => initialConfig.value,
      (newValue) => {
        config.splice(0, config.length, ...(newValue as any[]));
      },
      { deep: true },
    );
  }

  const configMap: ComputedRef<Map<string, T>> = computed(() => {
    return new Map<string, any>(config.map((item) => [item.field as string, item as any]));
  });

  const alwaysDisabled = new Set<string>();

  const setHidden: useConfigsResultType<T>['setHidden'] = (fields, hidden) => {
    fields.forEach((field) => {
      const item: any = configMap.value.get(field);
      if (item) item.hidden = hidden;
    });
  };

  const setDisabled: useConfigsResultType<T>['setDisabled'] = (fields, disabled) => {
    fields.forEach((key) => {
      let field = key as string;
      const isAlways = key.startsWith('*');
      if (isAlways) field = key.slice(1);

      const item = configMap.value.get(field);
      if (!item) return;

      item.props ||= {};
      item.props.disabled = disabled;

      if (isAlways) {
        disabled ? alwaysDisabled.add(field) : alwaysDisabled.delete(field);
      }
    });
  };

  const setDisabledAll: useConfigsResultType<T>['setDisabledAll'] = (disabled = true) => {
    config.forEach((item) => {
      item.props ||= {};
      if (!alwaysDisabled.has(item.field)) {
        item.props.disabled = disabled;
      }
    });
  };

  const setPropsByField: useConfigsResultType<T>['setPropsByField'] = (field, props) => {
    const item = configMap.value.get(field);
    if (!item) return;
    item.props ||= {};
    Object.assign(item.props, props);
  };

  const getConfigByField: useConfigsResultType<T>['getConfigByField'] = (field) =>
    configMap.value.get(field);

  const filterConfigs: useConfigsResultType<T>['filterConfigs'] = (predicate) => {
    return config.filter(predicate as any) as T[];
  };

  const cleanup: useConfigsResultType<T>['cleanup'] = () => config.splice(0);

  // 核心：使用对象封装 + iterator 支持 tuple 解构
  const api = {
    config,
    setHidden,
    setDisabled,
    setDisabledAll,
    setPropsByField,
    getConfigByField,
    filterConfigs,
    cleanup,

    // tuple iterator（保持你的原有数组返回结构）
    *[Symbol.iterator](): Iterator<any> {
      yield config;
      yield setHidden;
      yield setDisabled;
      yield setDisabledAll;
      yield setPropsByField;
      yield getConfigByField;
      yield filterConfigs;
      yield cleanup;
    },
  };

  return api as useConfigsResultType<T>;
}

/**
 * 配置管理组合式函数（支持自动清理）
 * 应在 Vue 组件的 setup 中调用
 */
export function useConfigs<T extends Omit<baseConfig, 'component'>>(
  initialConfig: MaybeRef<T[]>,
  autoCleanup = true,
): useConfigsResultType<T> {
  const manager = createConfigsManager(initialConfig);

  if (autoCleanup && getCurrentInstance()) {
    onUnmounted(manager.cleanup);
  }

  return manager;
}
