<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});
const loading = ref(false);
function mockApi(queryParams: any) {
  loading.value = true;
  return new Promise((resolve) => {
    loading.value = false;
    resolve([
      { label: queryParams.param1 || '无', value: '1' },
      { label: queryParams.param2 || '无', value: '2' },
    ]);
  });
}
const { form } = useMixConfig([
  {
    label: '条件1',
    field: 'param1',
    span: 12,
    props: {},
    form: true,
  },
  {
    label: '条件2',
    field: 'param2',
    span: 12,
    props: {},
    form: true,
  },
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi,
      query: ({ formData }: any) => ({ param1: formData.param1, param2: formData.param2 }),
      needAllQueryParams: true,
    },
    form: true,
  },
]);
</script>

<template>
  <el-divider>等待全部参数加载完成,获取选项</el-divider>
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
