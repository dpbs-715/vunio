<script setup lang="ts">
import { ElDivider } from 'element-plus';
import { CommonSelectOrDialog, type CommonTableLayoutConfig } from '@vunio/ui';
import { ref } from 'vue';

const model = ref('');
const modelLabel = ref('');
const dictType = ref('DICT1');
const fieldConfig: CommonTableLayoutConfig[] = [
  {
    label: '文字',
    field: 'label',
    table: true,
  },
  {
    label: '值',
    field: 'value',
    table: true,
  },
];

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
function changeHandler() {
  modelLabel.value = '';
  model.value = '';
}
</script>

<template>
  字典名称：<el-input v-model="dictType" @change="changeHandler" />
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
