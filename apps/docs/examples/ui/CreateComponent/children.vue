<script setup lang="ts">
import { ref } from 'vue';
import { CreateComponent, type Config } from '@vunio/ui';
const config = ref<Config>({
  component: 'button',
  props: { type: 'success' },
  children: '按钮',
});
</script>

<template>
  <CreateComponent :config="config" />
</template>

<style scoped></style>
