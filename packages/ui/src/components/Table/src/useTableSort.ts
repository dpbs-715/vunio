import { watchDebounced } from '@vueuse/core';
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';

import { componentDefaultPropsMap } from '~/components/CreateComponent/src/defaultMap.ts';

export const SORT_ORDERS = computed(() => componentDefaultPropsMap.CommonTable.sortOrders);
export const SORTABLE = computed(() => componentDefaultPropsMap.CommonTable.sortable);

/**
 * 基础table
 * */
export const sortChange = ({ prop, order }: any, tableData: any) => {
  //排序方式
  const sort = order;
  //排序字段
  const propertyName = prop;
  //对数据进行排序 - 原始数据排序
  tableData.sort((obj1: any, obj2: any) => {
    const value1 = String(obj1[propertyName] || '');
    const value2 = String(obj2[propertyName] || '');
    const res = value1.localeCompare(value2, 'zh');
    return sort === 'ascending' || sort === 'asc' ? res : -res;
  });
};
/**
 * tableV2排序
 */
export const useTableV2Sort = (data: MaybeRefOrGetter<any>) => {
  const sortState = ref({ key: '', order: 'asc' });
  //设置排序状态
  function setSortState({ key, order }: any) {
    sortState.value = {
      key,
      order: sortState.value.key === key ? order || 'asc' : 'desc',
    };
  }
  //监听排序状态
  watchDebounced(
    () => sortState.value,
    () => {
      sortChange({ prop: sortState.value.key, order: sortState.value.order }, toValue(data));
    },
    {
      deep: true,
      debounce: 50,
      maxWait: 100,
    },
  );
  return {
    sortState,
    setSortState,
  };
};
