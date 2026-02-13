<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';
const formData = ref({});
const { config, getConfigByField } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    span: 24,
  },
  {
    field: 'test2',
    label: '字段2',
    count: 0,
    span: 24,
  },
]);

function change() {
  const getConfig: CommonFormConfig = getConfigByField('test2');
  getConfig.count++;
  getConfig.label = `字段2修改了${getConfig.count}`;
}
</script>

<template>
  <CommonForm v-model="formData" :label-width="'auto'" :config="config" />
  <el-divider />
  <el-button @click="change">
    提交
  </el-button>
</template>

<style scoped></style>
