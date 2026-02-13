import { createContext } from '@vunio/hooks';

/**
 * Form Context 类型定义
 */
export interface FormContextValue {
  /**
   * 注册子组件的 ready Promise
   * 子组件（如 Select）在初始化时调用此方法注册自己的异步准备状态
   *
   * @param promise - 子组件准备就绪的 Promise
   */
  registerComponentReady: (promise: Promise<void>) => void;
}

/**
 * 创建 Form Context
 *
 * 用于父组件（Form）和子组件（Select）之间的通信
 * 解决 Select options 异步加载时序问题
 */
export const [injectFormContext, provideFormContext] = createContext<FormContextValue>(
  'CommonForm',
  'FormContext',
);
