<script setup lang="ts">
import { ref, h } from 'vue';
import { CreateComponent, type Config } from '@vunio/ui';
const config = ref<Config>({
  component: 'input',
  slots: {
    append: () => h('span', {}, 5555),
  },
});
</script>

<template>
  <CreateComponent :config="config" />
</template>

<style scoped></style>
