<template>
  <div class="demo">
    <div class="demo-title">
      Listening to Window Events
    </div>
    <p>Press any key to see the result</p>
    <p class="result">
      Last key pressed: <strong>{{ lastKey || 'None' }}</strong>
    </p>
  </div>
</template>

<script setup>
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const lastKey = ref('');

useEventListener('keydown', (event) => {
  lastKey.value = event.key;
});
</script>

<style scoped lang="scss">
.demo {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;

  .demo-title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: bold;
  }

  .result {
    padding: 10px;
    margin-top: 10px;
    color: #333;
    background: #f5f5f5;
    border-radius: 4px;

    strong {
      color: #1890ff;
    }
  }
}
</style>
