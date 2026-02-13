<script setup lang="ts">
import { reactive } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks';
const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称1',
    field: 'field1',
    width: 500,
  },
  {
    label: '名称2',
    field: 'field2',
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
  <CommonTable :data="tableData" :config="config">
    <template #field1="data">
      <div style="height: 150px; white-space: normal">
        {{ data }}
      </div>
    </template>
  </CommonTable>
</template>

<style scoped></style>
