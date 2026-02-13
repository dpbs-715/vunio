<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';
const formData = ref({});
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    span: 12,
    rules: [
      {
        required: true,
        validator: (_rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入'));
          }
          callback();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'test2',
    label: '字段2',
    rules: ({ formData, configItem }) => {
      return [
        {
          required: true,
          validator: (_rule, value, callback) => {
            console.log(formData, configItem);
            if (!value) {
              callback(new Error('请输入'));
            }
            callback();
          },
          trigger: 'blur',
        },
      ];
    },
  },
]);

//演示使用这个展示 开发中要去用收集器hook
const formRef: any = ref();
function submit() {
  formRef.value.validateForm();
}
</script>

<template>
  <CommonForm ref="formRef" v-model="formData" :config="config" />
  <el-divider />
  <el-button @click="submit">
    提交
  </el-button>
</template>

<style scoped></style>
