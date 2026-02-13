<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});

function mockApi() {
  return new Promise((resolve) => {
    resolve([
      { name: '李四', card: '182313' },
      { name: '王五', card: '212312328' },
    ]);
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
      labelField: 'name',
      valueField: 'card',
    },
    form: true,
  },
]);
</script>

<template>
  {{ formData }}
  <el-divider />
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
