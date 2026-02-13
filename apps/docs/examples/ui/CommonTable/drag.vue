<script setup lang="ts">
import { ref } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks';

const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称',
    field: 'field1',
    align: 'center',
  },
  {
    label: '名称2',
    field: 'field2',
    align: 'center',
  },
  {
    label: '名称3',
    field: 'field3',
  },
  {
    label: '名称4',
    field: 'field4',
  },
  {
    label: '名称5',
    field: 'field5',
  },
]);
const tableData = ref([
  {
    field1: '111',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '22222',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '33333',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '44444',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
]);
function drag(p1, p2, evt) {
  console.log(p1, p2, evt);
}
</script>

<template>
  <CommonTable v-model:data="tableData" use-drag :config="config" @drag-end="drag" />
</template>

<style scoped></style>
