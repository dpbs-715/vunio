import { Component, defineAsyncComponent, MaybeRef, VNode } from 'vue';
export type Props = Record<string, any>;

export type SlotContent = () => string | number | VNode | (string | number | VNode)[];
export type Slots = Record<string, SlotContent>;
export interface Config {
  component: string | ComponentFunctionType | ComponentType;
  props?: Props;
  children?: string | string[] | Config[];
  slots?: Slots;
  label?: MaybeRef<string>;
}

type AsyncComponent = ReturnType<typeof defineAsyncComponent>;
export type ComponentType = Component | AsyncComponent;
export type ComponentFunctionType = (...args: unknown[]) => ComponentType | undefined | string;
export type ComponentMap = Map<string, ComponentType>;
export type registerMap = Record<string, ComponentType>;
export type registerPropsMap = Record<string, Record<string, any>>;
export type registerEventsMap = Record<string, Record<string, any>>;
export type registerSlotsMap = Record<string, Record<string, any>>;
export type registerKeysMap = Record<string, string | number>;
export interface baseConfig extends Config {
  field: string;
  label?: MaybeRef<string>;
  group?: any;
  model?: Record<string, string>;
}
