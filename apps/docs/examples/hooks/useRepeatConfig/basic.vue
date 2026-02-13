<script setup lang="ts">
import { reactive, nextTick } from 'vue';
import { useRepeatConfig } from '@vunio/hooks';
import { CommonForm } from '@vunio/ui';
const formDataList = reactive([{ rowKey: 1 }, { rowKey: 2 }]);

const { getConfig, collect } = useRepeatConfig([
  {
    label: '字段1',
    field: 'field1',
    component: 'commonSelect',
    props: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
      ],
      onChange: (_val: string, { configItem }: any) => {
        nextTick(() => {
          getConfig(configItem.$key)?.setDisabled(['field2'], true);
        });
      },
    },
    span: 12,
  },
  {
    label: '字段2',
    field: 'field2',
    span: 12,
  },
]);

setTimeout(() => {
  formDataList.push({ rowKey: new Date().getTime() });
}, 2000);
</script>

<template>
  <template v-for="(item, index) in formDataList" :key="item.rowKey">
    <CommonForm v-model="formDataList[index]" :config="collect(index)" />
  </template>
</template>

<style scoped></style>
