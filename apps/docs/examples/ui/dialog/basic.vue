<template>
  <CommonDialog v-model="open">
    <div>弹窗测试2222</div>
  </CommonDialog>
  <button @click="open = true">
    弹窗
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CommonDialog } from '@vunio/ui';
const open = ref(false);
</script>
<style scoped lang="scss">
button {
  all: revert;
}
</style>
