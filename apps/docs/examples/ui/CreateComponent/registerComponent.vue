<script setup lang="ts">
import { ref } from 'vue';
import { CreateComponent, type Config, registerComponent } from '@vunio/ui';
import { ElInput, ElSelect } from 'element-plus';
registerComponent({
  demo: ElInput,
});
const config = ref<Config>({
  component: 'demo',
});

const config2 = ref<Config>({
  component: ElSelect,
});

const flg = ref(false);
const config3 = ref<Config>({
  component: () => {
    if (flg.value) {
      return 'input';
    } else {
      return 'select';
    }
  },
});

function change() {
  flg.value = !flg.value;
}
</script>

<template>
  <el-divider>注册私有组件</el-divider>
  <CreateComponent :config="config" />
  <el-divider>临时使用组件</el-divider>
  <CreateComponent :config="config2" />
  <el-divider>组件切换</el-divider>
  <CreateComponent :config="config3" />
  <el-divider>组件切换</el-divider>
  <el-button @click="change">
    切换input/select
  </el-button>
</template>

<style scoped></style>
