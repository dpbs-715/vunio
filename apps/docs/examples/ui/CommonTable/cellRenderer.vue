<script setup lang="ts">
import { reactive, h } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks';
const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称1',
    field: 'field1',
    width: 300,
    cellRenderer: ({ cellData, column, rowData, rowIndex, tableData }: any) => {
      const value = JSON.stringify({ cellData, column, rowData, rowIndex, tableData });
      return h(
        'div',
        {
          style: { height: '100%', width: '100%', whiteSpace: 'normal' },
        },
        [value],
      );
    },
  },
  {
    label: '名称2',
    field: 'field2',
  },
  {
    label: '名称3',
    field: 'field3',
  },
  {
    label: '名称4',
    field: 'field4',
  },
  {
    label: '名称5',
    field: 'field5',
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
    field1: '2',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
]);
</script>

<template>
  <CommonTable :data="tableData" :config="config" />
</template>

<style scoped></style>
