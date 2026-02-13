<script setup lang="ts">
import { reactive } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks';
const { config, getConfigByField } = useConfigs<CommonTableConfig>([
  {
    label: '名称1',
    field: 'field1',
    hidden: true,
  },
  {
    label: '名称2',
    field: 'field2',
    hidden: false,
  },
  {
    label: '名称3',
    field: 'field3',
    component: 'select',
    props: {
      options: [
        { label: '显示名称2', value: false },
        { label: '隐藏名称2', value: true },
      ],
      onChange: (val: boolean) => {
        getConfigByField('field2').hidden = val;
      },
    },
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
const tableData = reactive([
  {
    field1: '1',
    field2: '名称2',
    field3: 'true',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '2',
    field2: '名称2',
    field3: 'true',
    field4: '名称4',
    field5: '名称5',
  },
]);
</script>

<template>
  <CommonTable :data="tableData" :config="config" />
</template>

<style scoped></style>
