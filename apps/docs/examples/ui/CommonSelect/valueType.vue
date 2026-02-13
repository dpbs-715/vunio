<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});

const sourceData = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
];

function mockApi() {
  return new Promise((resolve) => {
    resolve(sourceData);
  });
}
const { form } = useMixConfig([
  {
    label: '字段',
    field: 'card',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi,
      valueType: 'int',
    },
    form: true,
  },
]);
</script>

<template>
  数据源：{{ sourceData }}
  <el-divider />
  {{ formData }}
  <el-divider />
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
