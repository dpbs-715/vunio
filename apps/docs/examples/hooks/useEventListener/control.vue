<template>
  <div class="demo">
    <div class="demo-title">
      Control Listener
    </div>
    <p>
      Click count: <strong>{{ clickCount }}</strong>
    </p>
    <p>
      Listener status:
      <span :class="['status', isActive ? 'active' : 'paused']">{{
        isActive ? 'Active' : 'Paused'
      }}</span>
    </p>

    <div ref="boxRef" class="click-box">
      Click me!
    </div>

    <div class="controls">
      <button :disabled="!isActive" @click="pause">
        Pause
      </button>
      <button :disabled="isActive" @click="resume">
        Resume
      </button>
      <button @click="stop">
        Stop (Cannot Resume)
      </button>
    </div>
  </div>
</template>

<script setup>
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const boxRef = ref();
const clickCount = ref(0);

const { pause, resume, isActive, stop } = useEventListener(boxRef, 'click', () => {
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

  .status {
    padding: 2px 8px;
    font-weight: bold;
    border-radius: 4px;

    &.active {
      color: #52c41a;
      background: #f6ffed;
    }

    &.paused {
      color: #faad14;
      background: #fffbe6;
    }
  }

  .click-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    margin: 15px 0;
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

  .controls {
    display: flex;
    gap: 10px;

    button {
      padding: 8px 16px;
      color: white;
      cursor: pointer;
      background: #1890ff;
      border: none;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        background: #40a9ff;
      }

      &:disabled {
        cursor: not-allowed;
        background: #d9d9d9;
      }
    }
  }

  strong {
    color: #1890ff;
  }
}
</style>
