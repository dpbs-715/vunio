import { useConfigs, useConfigsResultType } from '../useConfigs';
import { CommonFormConfig, CommonTableConfig, CommonTableLayoutConfig } from '@vunio/ui';
import { deepClone } from '@vunio/utils';
import { Reactive, reactive, Ref, ref } from 'vue';

export interface mixResultType {
  table: useConfigsResultType<CommonTableConfig>;
  form: useConfigsResultType<CommonFormConfig>;
  search: useConfigsResultType<CommonFormConfig>;
  data: {
    tableData: Reactive<any[]>;
    queryParams: Reactive<Record<string, any>>;
    total: Ref<number>;
  };
}
export function useMixConfig(configData?: CommonTableLayoutConfig[]): mixResultType {
  type BucketKey = 'table' | 'form' | 'search';
  const buckets: Record<BucketKey, any[]> = {
    table: [],
    form: [],
    search: [],
  };

  configData?.forEach((item) => {
    (Object.keys(buckets) as BucketKey[]).forEach((key) => {
      const specificConfig = (item as any)[key];
      if (specificConfig) {
        const { table, form, search, ...baseConfig } = deepClone(item);
        const mergedConfig = {
          ...baseConfig,
          ...specificConfig,
        };
        buckets[key].push(mergedConfig);
      }
    });
  });

  const table = useConfigs(buckets.table);
  const form = useConfigs(buckets.form);
  const search = useConfigs(buckets.search);

  const tableData: Reactive<any[]> = reactive([]);
  const queryParams = reactive<Record<string, any>>({});
  const total = ref(0);

  return {
    table,
    form,
    search,
    data: {
      tableData,
      queryParams,
      total,
    },
  };
}
