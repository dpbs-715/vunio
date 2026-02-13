<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});

function mockApi() {
  return new Promise((resolve) => {
    resolve([
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
    ]);
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
]);
</script>

<template>
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
