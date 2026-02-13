<script setup lang="ts">
import { reactive } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks';
const { config } = useConfigs<CommonTableConfig>([
  {
    label: 'config名称',
    field: 'field1',
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
    <el-table-column width="150" label="默认插槽">
      111
    </el-table-column>
    <el-table-column fixed="right" width="150" label="操作">
      <template #default>
        <el-button type="primary">
          操作
        </el-button>
      </template>
    </el-table-column>
  </CommonTable>
</template>

<style scoped></style>
