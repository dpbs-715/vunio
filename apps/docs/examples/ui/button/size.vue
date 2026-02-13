<template>
  <el-divider>默认</el-divider>
  <CommonButton type="normal">
    按钮
  </CommonButton>
  <el-divider>small</el-divider>
  <CommonButton type="normal" size="small">
    按钮
  </CommonButton>
  <el-divider>medium</el-divider>
  <CommonButton type="normal" size="medium">
    按钮
  </CommonButton>
  <el-divider>large</el-divider>
  <CommonButton type="normal" size="large">
    按钮
  </CommonButton>
</template>

<script setup lang="ts">
import { CommonButton } from '@vunio/ui';
</script>

<style scoped></style>
