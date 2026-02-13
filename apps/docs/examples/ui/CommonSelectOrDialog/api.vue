<script setup lang="ts">
import { ElDivider } from 'element-plus';
import { CommonSelectOrDialog, type CommonTableLayoutConfig } from '@vunio/ui';
import { ref } from 'vue';

const model = ref('');
const modelLabel = ref('');
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

function CommonSelectOrDialogApi() {
  return new Promise((resolve) => {
    resolve({
      list: [
        {
          label: `label1`,
          value: 'value1',
        },
        {
          label: `label2`,
          value: 'value2',
        },
      ],
      total: 2,
    });
  });
}
</script>

<template>
  值:{{ model || '-' }}
  <br>
  文字:{{ modelLabel || '-' }}
  <el-divider />
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    :api="CommonSelectOrDialogApi"
    :dialog-fields-config="fieldConfig"
    :dialog-props="{
      title: '选择数据',
    }"
  />
</template>

<style scoped></style>
