<script setup lang="ts">
import { ref } from 'vue';
import { CommonColorPicker } from '@vunio/ui';

const color = ref('#67C23A');
const predefine = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  'rgba(64, 158, 255, 0.5)',
  'transparent',
];
</script>

<template>
  <div class="color-picker-demo">
    <CommonColorPicker v-model="color" show-alpha :predefine="predefine" />
  </div>
</template>

<style scoped>
.color-picker-demo {
  max-width: 420px;
}
</style>
