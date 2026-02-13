<template>
  <div class="demo-button" style="margin-top: 20px">
    <CommonButton type="delete">
      删除
    </CommonButton>
    <CommonButton type="import">
      导入
    </CommonButton>
    <CommonButton type="export">
      导出
    </CommonButton>
    <CommonButton type="create">
      新增
    </CommonButton>
  </div>
</template>

<script setup lang="ts">
import { CommonButton } from '@vunio/ui';
</script>

<style scoped>
.demo-button {
  display: flex;
  gap: 16px;
}
</style>
