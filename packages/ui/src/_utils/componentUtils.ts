import type { CommonFormConfig, CommonTableConfig } from '~/components';
import { isArray, isFunction, isObject } from '@vunio/utils/src';
import { computed, type ComputedRef } from 'vue';
import { componentDefaultPropsMap } from '~/components/CreateComponent/src/defaultMap';
import type { registerPropsMap } from '~/components';

const ignoreFunction = ['api'];
/**
 * 配置迭代器 给函数式配置追加参数等
 * */
export const configIterator = (
  aimConfig: Record<string, any>,
  {
    config,
    writeArgs,
  }: { config?: CommonFormConfig | CommonTableConfig | any; writeArgs?: Record<string, any> },
) => {
  for (const key in config) {
    if (isObject(config[key]) && key != 'component') {
      //处理对象递归调用
      aimConfig[key] = {};
      configIterator(aimConfig[key], { config: config[key], writeArgs });
    } else if (isArray(config[key])) {
      aimConfig[key] = [];
      for (let index = 0; index < config[key].length; index++) {
        if (isObject(config[key][index])) {
          aimConfig[key][index] = {};
          configIterator(aimConfig[key][index], { config: config[key][index], writeArgs });
        } else {
          aimConfig[key][index] = config[key][index];
        }
      }
    } else if (isFunction(config[key]) && !config[key][`__D__`] && !ignoreFunction.includes(key)) {
      //处理函数追加参数
      aimConfig[key] = (...args: any) => config[key](...args, writeArgs);
    } else {
      //其他情况直接赋值
      aimConfig[key] = config[key];
    }
  }
  /**
   * 处理其他扩展属性
   * */
  if (config.isDisabled) {
    if (!aimConfig.props) {
      aimConfig.props = {};
    }
    if (isFunction(config.isDisabled)) {
      aimConfig.props['disabled'] = config.isDisabled?.(writeArgs) || config.props?.['disabled'];
    } else {
      aimConfig.props['disabled'] = config.isDisabled || config.props?.['disabled'];
    }
  }
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
  //判断是否为布尔值
  if (typeof item.hidden === 'boolean') {
    return item.hidden;
  } else if (typeof item.hidden === 'function') {
    return item.hidden({ configItem: item, ...otherCallBackArgs }) as boolean;
  }
  return false;
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

  return computed(() => {
    const defaults = componentDefaultPropsMap[componentName] || {};
    const result: any = { ...defaults };

    for (const key in props) {
      if (!excludeSet.has(key) && props[key] !== undefined) {
        result[key] = props[key];
      }
    }

    return result;
  });
}
