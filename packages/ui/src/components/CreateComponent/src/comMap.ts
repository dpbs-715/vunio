import { ComponentFunctionType, ComponentMap, ComponentType } from './cc.types';
import { BaseMap, HtmlTags } from './baseMap';
import { isFunction, isString } from '@vunio/utils';

/**
 * 组件注册中心
 * */
export class ComMap {
  private static instance: ComMap;
  private componentMap: ComponentMap;

  private constructor() {
    this.componentMap = new Map();
    this.registerBatch(BaseMap);
  }

  public static getInstance(): ComMap {
    if (!ComMap.instance) {
      ComMap.instance = new ComMap();
    }
    return ComMap.instance;
  }

  /** 注册单个组件 */
  public register(key: string, component: ComponentType): void {
    if (!key || typeof key !== 'string') {
      throw new Error('Component key must be a non-empty string');
    }
    this.componentMap.set(key, component);
  }

  /** 批量注册组件 - 支持对象字面量形式 */
  public registerBatch(components: Record<string, ComponentType>): void {
    for (const [key, component] of Object.entries(components)) {
      this.register(key, component);
    }
  }

  /** 获取组件 */
  public get(component: string | ComponentFunctionType | any): ComponentType | undefined | string {
    let c;
    //判断是否是函数
    if (isFunction(component)) {
      //函数获取函数结果
      c = component();
    } else {
      //其他的直接赋值
      c = component;
    }
    //判断是否是字符串
    if (isString(c)) {
      //尝试从组件映射中获取
      const com = this.componentMap.get(c);
      //存在则返回
      if (com) {
        return com;
      }
    }
    //判断是否是html标签
    if (isString(c)) {
      return HtmlTags.includes(c) ? c : undefined;
    }
    return c;
  }

  /** 是否存在组件 */
  public has(key: string): boolean {
    return this.componentMap.has(key);
  }

  /** 注销单个组件 */
  public unregister(key: string): void {
    this.componentMap.delete(key);
  }

  /** 批量注销组件 - 使用数组 */
  public unregisterBatch(keys: string[]): void {
    for (const key of keys) {
      this.unregister(key);
    }
  }

  /** 清空组件 */
  public clear(): void {
    this.componentMap.clear();
  }
}
