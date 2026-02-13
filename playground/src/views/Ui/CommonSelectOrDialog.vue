<script setup lang="ts">
import { ElDivider } from 'element-plus';
import type { CommonTableLayoutConfig } from '@vunio/ui';
import { ref } from 'vue';

const model = ref('');
const modelLabel = ref('');
const dictType = ref('');
const fieldConfig: CommonTableLayoutConfig[] = [
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
];
setTimeout(() => {
  model.value = 'value1';
  modelLabel.value = 'label1';
  dictType.value = 'DICT1';
}, 2000);

function getDictOptions(dictType: string) {
  return [
    {
      label: `${dictType}-1`,
      value: 'value1',
    },
    {
      label: `${dictType}-2`,
      value: 'value2',
    },
  ];
}
</script>

<template>
  字典名称：<el-input v-model="dictType" />
  <el-divider />
  值:{{ model || '-' }}
  <br>
  文字:{{ modelLabel || '-' }}
  <el-divider />
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    :dict="dictType"
    :dialog-fields-config="fieldConfig"
    :get-dict-options="getDictOptions"
    :dialog-props="{
      title: '选择数据',
    }"
  />
</template>

<style scoped></style>
