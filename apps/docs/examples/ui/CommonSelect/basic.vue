<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CommonSelect, CommonTable, CommonForm } from '@vunio/ui';
import { useMixConfig } from '@vunio/hooks';

const tableData = ref([{}]);
const formData = ref({});
const value = ref('1');
const label = ref('选项1');
const options = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]);

const { table, form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    props: {
      options,
    },
    table: true,
    form: true,
  },
]);
</script>

<template>
  直接使用:{{ value }}-{{ label }}<br>
  form中使用:{{ formData }}<br>
  table中使用:{{ tableData }}
  <el-divider>直接使用</el-divider>
  <CommonSelect v-model="value" v-model:label="label" :options="options" />
  <el-divider>form中使用</el-divider>
  <CommonForm v-model="formData" :config="form.config" />
  <el-divider>table中使用</el-divider>
  <CommonTable :data="tableData" :config="table.config" />
</template>

<style scoped></style>
