<script setup lang="ts">
import { ref } from 'vue';
import { CommonColorPicker } from '@vunio/ui';

const color = ref('rgba(64, 158, 255, 0.45)');
</script>

<template>
  <div class="color-picker-demo">
    <CommonColorPicker v-model="color" show-alpha clearable />
    <span>当前颜色：{{ color || '已清空' }}</span>
  </div>
</template>

<style scoped>
.color-picker-demo {
  display: grid;
  gap: 12px;
  max-width: 420px;
}
</style>
