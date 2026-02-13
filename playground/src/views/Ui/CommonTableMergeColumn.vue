<script setup lang="ts">
import { reactive } from 'vue';
import type { CommonTableConfig } from '~/@vunio/ui';
import { useConfigs } from '@vunio/hooks';
import { spanMethodBuilder } from '@vunio/utils/src';

const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称',
    field: 'field1',
  },
  {
    label: '名称2',
    field: 'field2',
    align: 'center',
  },
  {
    label: '名称3',
    field: 'field3',
  },
  {
    label: '名称4',
    field: 'field4',
  },
]);
const tableData = reactive([
  {
    field1: '1',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '1',
    field2: '名称21',
    field3: '名称33',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '1',
    field2: '名称21',
    field3: '名称32',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '2',
    field2: '名称21',
    field3: '名称32',
    field4: '名称4',
    field5: '名称6',
  },
]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['field1', 'field2', 'field3'])
  .build();
</script>

<template>
  <CommonTable :data="tableData" :config="config" :span-method="spanMethod" />
</template>

<style scoped></style>
