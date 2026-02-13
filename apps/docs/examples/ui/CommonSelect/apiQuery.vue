<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});
function mockApi(queryParams: any) {
  return new Promise((resolve) => {
    const res = [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
    ];
    if (queryParams.field) {
      res.push({ label: `${JSON.stringify(queryParams)}`, value: '3' });
    }
    setTimeout(() => {
      resolve(res);
    }, 3000);
  });
}
const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi,
    },
    form: true,
  },
  {
    label: '字段',
    field: 'field2',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi,
      query: ({ formData }: any) => {
        return {
          field: formData.field,
        };
      },
    },
    form: true,
  },
]);
</script>

<template>
  <el-divider>第一个字段是第二个字段的搜索条件</el-divider>
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
