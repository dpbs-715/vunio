<template>
  <div class="demo">
    <div class="demo-title">
      Listening to Element Click Events
    </div>
    <p>
      Click count: <strong>{{ clickCount }}</strong>
    </p>

    <div ref="boxRef" class="click-box">
      Click me!
    </div>
  </div>
</template>

<script setup>
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const boxRef = ref();
const clickCount = ref(0);

useEventListener(boxRef, 'click', () => {
  clickCount.value++;
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

  .click-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    margin-top: 10px;
    font-size: 18px;
    color: white;
    cursor: pointer;
    background: #1890ff;
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background: #40a9ff;
    }

    &:active {
      background: #096dd9;
    }
  }

  strong {
    color: #1890ff;
  }
}
</style>
