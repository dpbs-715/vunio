<script setup lang="ts">
import { useEventListener } from '@vunio/hooks/src/useEventListener';
import { ref } from 'vue';

const divRef = ref();
const clickCount = ref(0);

// 使用新的控制对象 API
const { pause, resume, isActive, stop } = useEventListener(divRef, 'click', () => {
  clickCount.value++;
  console.log('click', clickCount.value);
});
</script>

<template>
  <div style="padding: 20px">
    <h3>useEventListener Demo</h3>
    <p>点击次数: {{ clickCount }}</p>
    <p>监听状态: {{ isActive ? '激活' : '暂停' }}</p>

    <!-- 红色区域：被监听的元素 -->
    <div
      ref="divRef"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 500px;
        height: 200px;
        margin: 10px 0;
        font-size: 20px;
        color: white;
        background: red;
      "
    >
      点击我（红色区域）
    </div>

    <!-- 控制按钮 -->
    <div style="display: flex; gap: 10px">
      <button
        :disabled="!isActive"
        style="padding: 10px 20px; color: white; cursor: pointer; background: #ff9800; border: none"
        @click="pause"
      >
        暂停监听
      </button>
      <button
        :disabled="isActive"
        style="padding: 10px 20px; color: white; cursor: pointer; background: #4caf50; border: none"
        @click="resume"
      >
        恢复监听
      </button>
      <button
        :disabled="!isActive"
        style="padding: 10px 20px; color: white; cursor: pointer; background: red; border: none"
        @click="stop"
      >
        停用监听
      </button>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}
</style>
