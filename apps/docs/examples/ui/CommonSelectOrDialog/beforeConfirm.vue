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
    search: {
      component: 'commonSelect',
      props: {
        options: [
          {
            label: 'label1',
            value: 'label1',
          },
          {
            label: 'label2',
            value: 'label2',
          },
        ],
      },
    },
  },
  {
    label: '值',
    field: 'value',
    table: true,
  },
];

const options: Record<string, string>[] = [];
for (let i = 0; i < 10; i++) {
  options.push({
    label: `label${i}`,
    value: `value${i}`,
  });
}
function beforeConfirm(selections: any[], _labelSelections: any[]) {
  if (selections.length === 0) {
    alert('请选择数据');
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
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
    :dialog-fields-config="fieldConfig"
    :options="options"
    :dialog-props="{
      title: '选择数据',
    }"
    :before-confirm="beforeConfirm"
  />
</template>

<style scoped></style>
