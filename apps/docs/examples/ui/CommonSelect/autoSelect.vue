<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});

function mockApi() {
  return new Promise((resolve) => {
    resolve([{ label: '选项1', value: '1' }]);
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
      autoSelect: true,
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
