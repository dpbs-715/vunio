<script setup lang="ts">
import { ref, reactive } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});
const options: any = reactive([
  { label: '选项1', value: 1 },
  { label: '选项3', value: 3 },
  { label: '选项2', value: 2 },
  { label: '选项5', value: 5 },
  { label: '选项6', value: 6 },
]);

function mockApi() {
  return new Promise((resolve) => {
    const res = [
      { label: '选项1', value: 1 },
      { label: '选项3', value: 3 },
      { label: '选项2', value: 2 },
      { label: '选项5', value: 5 },
      { label: '选项6', value: 6 },
    ];
    resolve(res);
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
      orderBy: 'value',
      options,
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
      orderBy: 'value',
      orderType: 'desc',
      options,
    },
    form: true,
  },
]);
</script>

<template>
  原始数据: {{ options }}
  <el-divider />
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
