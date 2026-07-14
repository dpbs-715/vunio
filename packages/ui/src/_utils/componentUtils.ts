import type { CommonFormConfig, CommonTableConfig } from '~/components';
import { isArray, isFunction, isObject } from '@vunio/utils/src';
import {
  computed,
  getCurrentInstance,
  isRef,
  onBeforeUpdate,
  shallowRef,
  type ComputedRef,
  unref,
} from 'vue';
import { componentDefaultPropsMap } from '~/components/CreateComponent/src/defaultMap';
import type { registerPropsMap } from '~/components';

const ignoreFunction = ['api'];
const referenceConfigKeys = new Set(['data', 'options']);
const VUNIO_WRAPPED = Symbol('vunio_wrapped');

type WrappedFn = ((...args: any[]) => any) & {
  [VUNIO_WRAPPED]?: true;
};

function wrapWithCtx(fn: WrappedFn, getCtx: () => Record<string, any>) {
  if (fn[VUNIO_WRAPPED]) return fn;

  const wrapped = ((...args: any[]) => fn(...args, getCtx())) as WrappedFn;
  wrapped[VUNIO_WRAPPED] = true;

  return wrapped;
}

type GetConfigContext = () => Record<string, any>;

function cloneConfigArray(
  config: any[],
  getCtx: GetConfigContext,
  visited: WeakMap<object, any>,
): any[] {
  const cached = visited.get(config);
  if (cached) return cached;

  const cloned: any[] = [];
  visited.set(config, cloned);

  for (let index = 0; index < config.length; index++) {
    const configItem = unref(config[index]);

    if (isObject(configItem)) {
      cloned[index] = cloneConfigObject({}, configItem, getCtx, visited);
    } else if (isArray(configItem)) {
      cloned[index] = cloneConfigArray(configItem, getCtx, visited);
    } else {
      cloned[index] = configItem;
    }
  }

  return cloned;
}

function cloneConfigObject(
  aimConfig: Record<string, any>,
  config: Record<string, any>,
  getCtx: GetConfigContext,
  visited: WeakMap<object, any>,
): Record<string, any> {
  const cached = visited.get(config);
  if (cached) return cached;

  visited.set(config, aimConfig);

  for (const key in config) {
    const configValue = unref(config[key]);

    if (referenceConfigKeys.has(key)) {
      aimConfig[key] = configValue;
    } else if (isObject(configValue) && key !== 'component') {
      aimConfig[key] = cloneConfigObject({}, configValue, getCtx, visited);
    } else if (isArray(configValue)) {
      aimConfig[key] = cloneConfigArray(configValue, getCtx, visited);
    } else if (isFunction(configValue) && !configValue[`__D__`] && !ignoreFunction.includes(key)) {
      aimConfig[key] = wrapWithCtx(configValue, getCtx);
    } else {
      aimConfig[key] = configValue;
    }
  }

  const isDisabled = unref(config.isDisabled);
  if (isDisabled) {
    if (!aimConfig.props) {
      aimConfig.props = {};
    }
    const disabled = unref(unref(config.props)?.['disabled']);
    if (isFunction(isDisabled)) {
      aimConfig.props['disabled'] = isDisabled(getCtx()) || disabled;
    } else {
      aimConfig.props['disabled'] = isDisabled || disabled;
    }
  }

  return aimConfig;
}

/**
 * 配置迭代器 给函数式配置追加参数等
 * */
export const configIterator = (
  aimConfig: Record<string, any>,
  {
    config,
    writeArgs,
    getWriteArgs,
  }: {
    config?: CommonFormConfig | CommonTableConfig | any;
    writeArgs?: Record<string, any>;
    getWriteArgs?: () => Record<string, any>;
  },
): Record<string, any> => {
  const getCtx = getWriteArgs || (() => writeArgs || {});
  const resolvedConfig = unref(config);

  if (!isObject(resolvedConfig)) return aimConfig;

  return cloneConfigObject(aimConfig, resolvedConfig, getCtx, new WeakMap());
};

/**
 * 处理组件接收的默认插槽对象进行追加参数等操作
 * */
export const setDefaultSlotColumnProps = (defaultSlot: any, cb: Function) => {
  defaultSlot?.forEach((item: any) => {
    if (item.props && item.props.prop) {
      cb(item.props);
    }
    if (Array.isArray(item.children)) {
      item.children.forEach((children: any) => {
        children.props && cb(children.props);
      });
    }
  });
};

/**
 * 处理是否hidden
 * */
export function isHidden(
  item: CommonFormConfig | CommonTableConfig,
  otherCallBackArgs?: Record<string, any>,
): boolean {
  if (typeof item.hidden === 'function') {
    return item.hidden({ configItem: item, ...otherCallBackArgs }) as boolean;
  }
  return Boolean(isRef(item.hidden) ? item.hidden.value : item.hidden);
}
export function getRules(
  item: CommonFormConfig | CommonTableConfig,
  otherCallBackArgs?: Record<string, any>,
): any {
  if (Array.isArray(item.rules)) {
    return item.rules;
  } else if (typeof item.rules === 'function') {
    return item.rules({ configItem: item, ...otherCallBackArgs });
  }
}

export function useComponentProps<T extends Record<string, any>>(
  props: T,
  componentName: keyof registerPropsMap,
  excludeKeys: (keyof T)[] = [],
): ComputedRef<Partial<T>> {
  const excludeSet = new Set(excludeKeys);
  const instance = getCurrentInstance();
  const explicitProps = shallowRef<Record<string, true>>({});

  const hasOwn = (target: Record<string, any>, key: string) =>
    Object.prototype.hasOwnProperty.call(target, key);

  const hyphenate = (key: string) => key.replace(/\B([A-Z])/g, '-$1').toLowerCase();

  const collectExplicitProps = () => {
    const rawProps = instance?.vnode.props ?? {};
    const nextExplicitProps: Record<string, true> = {};

    for (const key in rawProps) {
      nextExplicitProps[key] = true;
    }

    explicitProps.value = nextExplicitProps;
  };

  collectExplicitProps();
  onBeforeUpdate(collectExplicitProps);

  const isExplicitProp = (key: string) => {
    const currentExplicitProps = explicitProps.value;

    return hasOwn(currentExplicitProps, key) || hasOwn(currentExplicitProps, hyphenate(key));
  };

  return computed(() => {
    const defaults = componentDefaultPropsMap[componentName] || {};
    const result: any = { ...defaults };

    for (const key in props) {
      if (!excludeSet.has(key) && props[key] !== undefined) {
        if (props[key] === false && defaults[key] === true && !isExplicitProp(key)) {
          continue;
        }

        result[key] = props[key];
      }
    }

    return result;
  });
}
