<script setup lang="ts">
import { ref } from 'vue';
import {
  CreateComponent,
  type Config,
  registerComponentDefaultPropsMap,
  registerComponent,
} from '@vunio/ui';
import { ElInput } from 'element-plus';

registerComponent({
  demo: ElInput,
});
const config = ref<Config>({
  component: 'demo',
});
registerComponentDefaultPropsMap({
  demo: {
    placeholder: 'placeholder测试',
  },
});

const config2 = ref<Config>({
  component: 'demo',
  props: {
    placeholder: '复写1',
  },
});
</script>

<template>
  <CreateComponent :config="config" />
  <el-divider />
  <CreateComponent :config="config2" />
  <el-divider />
  <CreateComponent :config="config" placeholder="复写2" />
</template>

<style scoped></style>
