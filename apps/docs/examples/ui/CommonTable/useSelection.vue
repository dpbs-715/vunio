<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks';
const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称1',
    field: 'field1',
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

const tableRef = ref();
function getSelection() {
  console.log(tableRef.value.getSelectionRows());
}
</script>

<template>
  <el-divider>表格多选</el-divider>
  <CommonTable ref="tableRef" use-selection :data="tableData" :config="config" />
  <el-divider />
  <el-button @click="getSelection">
    获取选中数据
  </el-button>
  <el-divider>表格单选</el-divider>
  <CommonTable use-selection single-selection :data="tableData" :config="config" />
</template>

<style scoped></style>
