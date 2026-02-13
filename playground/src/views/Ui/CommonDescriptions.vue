<script setup lang="ts">
import type { DescriptionsConfig } from '@vunio/ui';
import { reactive } from 'vue';
import CommonDescriptions from '~/components/Descriptions/src/Descriptions.vue';

const formData = reactive({
  name: '张三',
  age: 18,
  sex: 1,
});
const config: DescriptionsConfig[] = reactive([
  {
    label: '姓名',
    field: 'name',
    component: 'input',
    props: {
      disabled: false,
      placeholder: '请输入姓名',
    },
  },
  {
    label: '年龄',
    field: 'age',
    slots: {
      label: () => 131231,
    },
  },
  {
    label: '性别',
    field: 'sex',
    formatter: (...args: any) => {
      console.log(args);
      return 12312;
    },
  },
]);
</script>

<template>
  {{ formData }}
  <CommonDescriptions v-model="formData" :config="config" />
</template>

<style scoped></style>
