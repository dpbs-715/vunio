<script setup lang="ts">
import { ref } from 'vue';
import {
  CreateComponent,
  type Config,
  registerComponentDefaultSlotsMap,
  registerComponent,
} from '@vunio/ui';
import { ElInput } from 'element-plus';

registerComponent({
  demo: ElInput,
});
const config = ref<Config>({
  component: 'demo',
});

registerComponentDefaultSlotsMap({
  demo: {
    append: () => 'append',
  },
});
</script>

<template>
  <CreateComponent :config="config" />
  <el-button>注册插槽</el-button>
</template>

<style scoped></style>
