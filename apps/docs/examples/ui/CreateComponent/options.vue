<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CreateComponent, type Config } from '@vunio/ui';

const configValue = ref();
const options = reactive<Record<any, any>>([
  { label: 'test1', value: '1' },
  { label: 'test2', value: '2' },
  { label: 'test2', value: '3' },
]);
const config = ref<Config>({
  component: 'radioGroup',
  props: {
    options: options,
  },
});
const config2 = ref<Config>({
  component: 'select',
  props: {
    options: options,
  },
});

const configValue2 = ref();
const config3 = ref<Config>({
  component: 'checkboxGroup',
  props: {
    options: options,
  },
});

function createOption() {
  options.push({
    label: 'test' + (options.length + 1),
    value: (options.length + 1).toString(),
  });
}
</script>

<template>
  <el-divider>单选与下拉</el-divider>
  值:{{ configValue }}<br>
  <CreateComponent v-model="configValue" :config="config" /><br>
  <CreateComponent v-model="configValue" :config="config2" /><br>
  <el-divider>多选</el-divider>
  值:{{ configValue2 }}<br>
  <CreateComponent v-model="configValue2" :config="config3" /><br>
  <el-divider />
  <el-button @click="createOption">
    追加option
  </el-button>
</template>

<style scoped></style>
