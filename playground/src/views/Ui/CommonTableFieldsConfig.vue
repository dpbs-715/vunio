<script setup lang="ts">
import { reactive } from 'vue';
import { useMixConfig } from '@vunio/hooks/src/useMixConfig';
const { table } = useMixConfig([
  {
    label: '名称1',
    field: 'field1',
    table: true,
  },
  {
    label: '名称2',
    field: 'field2',
    table: true,
  },
  {
    label: '名称3',
    field: 'field3',
    table: true,
  },
  {
    label: '名称4',
    field: 'field4',
    table: true,
  },
  {
    label: '名称5',
    field: 'field5',
    table: true,
  },
]);
const tableData = reactive([
  {
    field1: '1',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '2',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
]);
</script>

<template>
  <CommonTableFieldsConfig :config="table.config" />
  <CommonTable :data="tableData" :config="table.config" />
</template>

<style scoped></style>
