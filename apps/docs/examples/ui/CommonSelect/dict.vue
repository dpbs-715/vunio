<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm, registerComponentDefaultPropsMap } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

function getDictOptions(dictKey: string) {
  switch (dictKey) {
    case 'DICT1':
      return Promise.resolve([
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ]);
    case 'DICT2':
      return Promise.resolve([
        { label: '选项3', value: '3' },
        { label: '选项4', value: '4' },
      ]);
    default:
      return Promise.resolve([]);
  }
}
registerComponentDefaultPropsMap({
  commonSelect: {
    getDictOptions: getDictOptions,
  },
});

const formData = ref({});

const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      dict: 'DICT1',
    },
    form: true,
  },
  {
    label: '字段2',
    field: 'field2',
    component: 'commonSelect',
    span: 12,
    props: {
      dict: 'DICT2',
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
