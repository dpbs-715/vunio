<script setup lang="ts">
import { CommonSearch, type CommonFormConfig, registerComponentDefaultPropsMap } from '@vunio/ui';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { ref } from 'vue';
registerComponentDefaultPropsMap({
  CommonSearch: {
    col: {
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
    },
    actionCol: 12,
  },
});

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
});
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
    component: 'select',
  },
]);
</script>

<template>
  <CommonSearch v-model="queryParams" :config="config" />
  <el-divider />
  {{ queryParams }}
  <el-divider />
  <el-button @click="queryParams.pageNo++">
    下一页
  </el-button>
</template>

<style scoped></style>
