import { defineComponent, h, PropType, VNode, getCurrentInstance, reactive } from 'vue';
import type { Config, Props } from './cc.types';
import { ComMap } from './comMap';
import { ComponentInternalInstance } from '@vue/runtime-core';
import { ExpandHandler } from '~/components/CreateComponent/src/factoryTool.tsx';
import { isString } from '@vunio/utils';
import {
  componentDefaultEventsMap,
  componentDefaultPropsMap,
  componentDefaultSlotsMap,
} from '~/components/CreateComponent/src/defaultMap.ts';
/**
 * 渲染配置函数
 * 根据提供的配置对象渲染一个组件或返回相应的字符串
 * 主要用于动态组件的渲染，处理组件属性、事件、和插槽
 * @param config 配置对象，包含组件信息、属性和插槽
 * @param comSlots 可选参数，组件的插槽
 * @param baseProps 基础参数
 * @param emit 事件
 * @returns 返回渲染后的虚拟节点、字符串或null
 */
function renderConfig(
  config: Config | string,
  comSlots?: any,
  baseProps?: any,
  emit?: any,
): VNode | string | null {
  // 如果配置为空，返回null
  if (!config) return null;
  // 如果配置是字符串，直接返回该字符串
  if (typeof config === 'string') return config;

  // 从配置中解构出组件、属性、子组件和插槽
  const { component, props = {}, children, slots } = config;
  // 从组件映射中获取组件构造函数
  const Comp = ComMap.getInstance().get(component);
  // 如果组件未注册，返回一个错误提示的虚拟节点
  if (!Comp) {
    if (baseProps.emptyText) {
      return baseProps.emptyText;
    } else {
      return h('div', `组件未注册: ${component}`);
    }
  }

  let componentKey;
  if (!isString(component)) {
    componentKey = 'self';
  } else {
    componentKey = component;
  }
  // 初始化事件属性和普通属性对象
  const eventProps: Props = {
    ...componentDefaultEventsMap[componentKey],
  };
  const normalProps: Props = {
    ...componentDefaultPropsMap[componentKey],
  };

  // 分离事件属性和普通属性 方便后期有处理
  Object.entries(props).forEach(([key, val]) => {
    // 如果是事件属性（以'on'开头且值为函数），则加入事件属性对象，否则加入普通属性对象
    if (key.startsWith('on') && typeof val === 'function') {
      eventProps[key] = val;
    } else {
      normalProps[key] = val;
    }
  });

  // 处理默认插槽（children）
  let childrenSlot: VNode[] | string | undefined;
  // 如果子组件是字符串，直接将其作为默认插槽
  if (typeof children === 'string') {
    childrenSlot = children;
  } else if (Array.isArray(children)) {
    // 如果子组件是数组，递归渲染每个子组件，并过滤掉null值
    childrenSlot = children.map((child) => renderConfig(child)).filter(Boolean) as VNode[];
  }

  const vm: ComponentInternalInstance | null = getCurrentInstance();
  function getRef(instance: any) {
    if (vm) {
      vm.exposeProxy = vm.exposed = instance || {};
    }
  }

  /**
   * 设置默认插槽和其他插槽
   * */
  const slotsMap = reactive<Record<string, any>>({
    //系统注册的默认插槽
    ...componentDefaultSlotsMap[componentKey],
    //组件正常插槽
    ...comSlots,
    //来自config的插槽
    ...slots,
    //处理默认插槽  config的slots > children[]的config > comSlots(正常传入的插槽)
    default: slots?.default || (childrenSlot && (() => childrenSlot)) || comSlots?.default,
  });

  //扩展配置
  ExpandHandler({ config, slotsMap, normalProps });
  /**
   * 使用h函数创建并返回虚拟节点
   * 这里使用vue特性 将默认参数继承到了根节点  所以不用再声明了
   * */

  const handleInput = (value: any) => {
    emit('update:modelValue', value);
  };
  return h(
    Comp,
    {
      ...normalProps,
      ...eventProps,
      ref: getRef,
      modelValue: baseProps.modelValue,
      'onUpdate:modelValue': handleInput,
    },
    slotsMap,
  );
}

export default defineComponent({
  name: 'CreateComponent',
  emits: ['update:modelValue'],
  props: {
    config: {
      type: [Object, String] as PropType<Config | string>,
      required: true,
    },
    emptyText: {
      type: String,
      required: false,
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array, null] as PropType<any>,
      default: undefined,
    },
  },
  setup(props, { slots, emit }) {
    return () => renderConfig(props.config, slots, props, emit);
  },
});
