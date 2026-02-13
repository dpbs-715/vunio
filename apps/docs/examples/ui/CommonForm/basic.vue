<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';
const formData = ref({ field1: '1' });
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    component: 'select',
    props: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'test2',
    label: '字段2',
  },
]);
</script>

<template>
  <el-divider>默认</el-divider>
  <CommonForm v-model="formData" :config="config" />
  <el-divider>small</el-divider>
  <CommonForm v-model="formData" size="small" :config="config" />
  <el-divider>default</el-divider>
  <CommonForm v-model="formData" size="default" :config="config" />
  <el-divider>large</el-divider>
  <CommonForm v-model="formData" size="large" :config="config" />
  <el-divider>loading</el-divider>
  <CommonForm v-model="formData" loading :config="config" />
  <el-divider>readonly</el-divider>
  <CommonForm v-model="formData" empty readonly :config="config" />
</template>

<style scoped></style>
