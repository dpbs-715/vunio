<script setup lang="ts">
import { ref } from 'vue';
import { CommonColorPicker } from '@vunio/ui';

const color = ref('#07111F');
</script>

<template>
  <div class="color-picker-states">
    <label>禁用 <CommonColorPicker v-model="color" disabled /></label>
    <label>只读 <CommonColorPicker v-model="color" readonly /></label>
  </div>
</template>

<style scoped>
.color-picker-states {
  display: grid;
  gap: 16px;
  max-width: 420px;
}

label {
  display: grid;
  gap: 6px;
  color: var(--el-text-color-regular);
}
</style>
