<script setup lang="ts">
import { ref } from 'vue';
import { CommonColorPicker } from '@vunio/ui';

const color = ref('#07111F');
const invalidValue = ref('');
</script>

<template>
  <div class="color-picker-demo">
    <CommonColorPicker v-model="color" @invalid="invalidValue = $event" />
    <span>输入无效颜色后按 Enter 或移出焦点。</span>
    <span v-if="invalidValue" class="error">“{{ invalidValue }}”不是有效颜色。</span>
  </div>
</template>

<style scoped>
.color-picker-demo {
  display: grid;
  gap: 8px;
  max-width: 420px;
}

.error {
  color: var(--el-color-danger);
}
</style>
