<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const formData = ref({});

const { form } = useMixConfig([
  {
    label: '条件',
    field: 'filterField',
    span: 12,
    form: true,
    props: {
      placeholder: '输入选项1/选项2会改变字段的下拉',
    },
  },
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
      query: ({ formData }: any) => {
        return {
          label: formData.filterField,
        };
      },
    },
    form: true,
  },
  {
    label: '过滤1',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
      query: () => {
        return {
          label: ['选项1', '选项3'],
        };
      },
    },
    form: true,
  },
  {
    label: '过滤2',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
      query: () => {
        return {
          label: '选项1,选项2',
        };
      },
    },
    form: true,
  },
  {
    label: '过滤2',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
      query: () => {
        return {
          label: '选项1',
          value: '1',
        };
      },
    },
    form: true,
  },
]);
</script>

<template>
  <el-divider>绑定options配置query</el-divider>
  <CommonForm v-model="formData" :config="form.config" />
</template>

<style scoped></style>
