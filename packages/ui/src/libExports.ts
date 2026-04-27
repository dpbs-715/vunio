import {
  ComMap,
  commonKeysMap,
  componentDefaultEventsMap,
  componentDefaultPropsMap,
  componentDefaultSlotsMap,
} from '~/components';
import { deepMerge } from '~/_utils';
import type {
  registerEventsMap,
  registerKeysMap,
  registerMap,
  registerPropsMap,
  registerSlotsMap,
} from './components/CreateComponent/src/cc.types';

/**
 * 抛出map注册组件方法
 * @param userMap {
 *   [key: string]: ComponentType;
 * }
 * */
function registerComponent(userMap: registerMap) {
  ComMap.getInstance().registerBatch(userMap);
}

/**
 * 抛出自定义的 组件props对照表
 * */
function registerComponentDefaultPropsMap(userPropsMap: registerPropsMap) {
  deepMerge(componentDefaultPropsMap, userPropsMap);
}

/**
 * 抛出自定义的 组件events对照表
 * */
function registerComponentDefaultEventsMap(userEventsMap: registerEventsMap) {
  deepMerge(componentDefaultEventsMap, userEventsMap);
}

/**
 * 抛出自定义的 组件slots对照表
 * */
function registerComponentDefaultSlotsMap(userSlotsMap: registerSlotsMap) {
  deepMerge(componentDefaultSlotsMap, userSlotsMap);
}

/**
 * 抛出自定义的 关键字对照表
 * */
function registerCommonKeysMap(userKeysMap: registerKeysMap) {
  deepMerge(commonKeysMap, userKeysMap);
}

export {
  registerComponentDefaultSlotsMap,
  registerComponentDefaultEventsMap,
  registerComponentDefaultPropsMap,
  registerComponent,
  registerCommonKeysMap,
};
