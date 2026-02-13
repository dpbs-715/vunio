<script setup lang="ts">
import { CommonDescriptions, type DescriptionsConfig } from '@vunio/ui';
import { reactive, ref } from 'vue';

const descriptionsData = ref({
  name: '张三',
  age: 18,
  sex: '男',
});
const config: DescriptionsConfig[] = reactive([
  {
    label: '姓名',
    field: 'name',
  },
  {
    label: '年龄',
    field: 'age',
    formatter: (value: any) => {
      return `${value}岁`;
    },
  },
  {
    label: '性别',
    field: 'sex',
  },
]);
</script>

<template>
  <CommonDescriptions v-model="descriptionsData" :config="config" />
</template>

<style scoped>
/* 因vitepress文档样式影响 正常使用不需要下面样式 */
:deep(.el-descriptions__body .el-descriptions__table) {
  display: inline-table !important;
}
</style>
