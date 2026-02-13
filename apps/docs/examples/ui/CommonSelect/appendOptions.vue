<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});
const options = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]);
const appendOptions = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]);

const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      options,
      appendOptions,
    },
    form: true,
  },
]);
</script>

<template>
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
