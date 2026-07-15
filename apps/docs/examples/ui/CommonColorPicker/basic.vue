<script setup lang="ts">
import { ref } from 'vue';
import { CommonColorPicker } from '@vunio/ui';

const color = ref('#07111F');
</script>

<template>
  <div class="color-picker-demo">
    <CommonColorPicker v-model="color" placeholder="请输入颜色值" />
    <span>当前颜色：{{ color }}</span>
  </div>
</template>

<style scoped>
.color-picker-demo {
  display: grid;
  gap: 12px;
  max-width: 420px;
}
</style>
