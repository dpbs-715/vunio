<template>
  <div class="demo-button">
    <CommonButton>按钮</CommonButton>
    <CommonButton type="primary">
      按钮
    </CommonButton>
    <CommonButton type="success">
      按钮
    </CommonButton>
    <CommonButton type="warning">
      按钮
    </CommonButton>
    <CommonButton type="danger">
      按钮
    </CommonButton>
    <CommonButton type="info">
      按钮
    </CommonButton>
    <CommonButton type="normal">
      按钮
    </CommonButton>
  </div>
  <div class="demo-button" style="margin-top: 20px">
    <CommonButton plain type="primary">
      按钮
    </CommonButton>
    <CommonButton plain type="success">
      按钮
    </CommonButton>
    <CommonButton plain type="warning">
      按钮
    </CommonButton>
    <CommonButton plain type="danger">
      按钮
    </CommonButton>
    <CommonButton plain type="info">
      按钮
    </CommonButton>
  </div>
  <div class="demo-button" style="margin-top: 20px">
    <CommonButton plain disabled type="primary">
      按钮
    </CommonButton>
    <CommonButton plain disabled type="success">
      按钮
    </CommonButton>
    <CommonButton plain disabled type="warning">
      按钮
    </CommonButton>
    <CommonButton plain disabled type="danger">
      按钮
    </CommonButton>
    <CommonButton plain disabled type="info">
      按钮
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
