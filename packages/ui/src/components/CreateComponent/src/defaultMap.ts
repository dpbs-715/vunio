import { reactive } from 'vue';
import defaultComponentProps from '~/components/CreateComponent/src/defaultComponentProps.ts';
import type {
  registerEventsMap,
  registerKeysMap,
  registerPropsMap,
  registerSlotsMap,
} from './cc.types';

export let componentDefaultEventsMap: registerEventsMap = reactive({});
// 组件默认属性配置
export let componentDefaultPropsMap: registerPropsMap = reactive(defaultComponentProps);
// 组件默认插槽配置
export let componentDefaultSlotsMap: registerSlotsMap = reactive({});
// 默认组件键值对
export let commonKeysMap: registerKeysMap = {
  page: 'pageNo',
  size: 'pageSize',
  total: 'total',
  list: 'list',

  defaultSize: 10,
};
