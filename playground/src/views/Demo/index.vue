<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useConfigs } from 'dlib-hooks/src/useConfigs';
import type { CommonFormConfig } from '~/components';
const options = ref([
  {
    label: 'label1',
    value: 1,
  },
]);
function mockFun() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: 'label1',
          value: 1,
        },
        {
          label: 'label3',
          value: 3,
        },
      ]);
    }, 1000);
  });
}
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
    component: 'commonSelect',
    model: {
      label: 'label',
    },
    props: {
      api: mockFun,
      multiple: true,
      joinSplit: ',',
      appendOptions: [
        {
          label: 'label5',
          value: 5,
        },
      ],
    },
  },
  {
    field: 'test2',
    label: '测试2',
    component: 'commonSelect',
    props: {
      options: options,
      multiple: true,
      appendOptions: [
        {
          label: 'label5',
          value: 5,
        },
      ],
    },
  },
  {
    field: 'test3',
    label: '测试3',
    component: 'checkboxGroup',
    props: {
      options: options,
    },
  },
  {
    field: 'test4',
    label: '测试4',
    component: 'commonSelectOrDialog',
    props: {
      options: options,
      dialogFieldsConfig: [
        {
          label: '文字',
          field: 'label',
          table: true,
          search: true,
        },
        {
          label: '值',
          field: 'value',
          table: true,
        },
      ],
    },
  },
]);
const loading = ref(false);
const formData = reactive({ test1: 1 });

const readonlyFlg = ref(false);

setTimeout(() => {
  options.value = [
    {
      label: 'label2',
      value: 2,
    },
    {
      label: 'label4',
      value: 4,
    },
  ];
}, 1000);
</script>

<template>
  {{ formData }}

  <CommonForm v-model="formData" :readonly="readonlyFlg" :loading="loading" :config="config" />
</template>

<style scoped></style>
