<script setup lang="ts">
import { ref } from 'vue';
import { CreateComponent, type Config } from '@vunio/ui';
const config = ref<Config>({
  component: 'button',
  props: { type: 'success', onClick: () => alert('点击了') },
});
</script>

<template>
  <CreateComponent :config="config">
    测试属性
  </CreateComponent>
</template>

<style scoped></style>
