<script setup lang="ts">
import { CommonFoma } from '@vunio/ui';
import { ElButton, ElDivider } from 'element-plus';
import { ref } from 'vue';
const model = ref('code1+code2');
const error = ref('');
const CommonFomaRef = ref();

const funs = [
  { label: '函数1', value: 'MIX' },
  { label: '函数2', value: 'SUM' },
];
const vars = [
  { label: '变量1', value: 'code1' },
  { label: '变量2', value: 'code2' },
];
function insertFun(item: any) {
  CommonFomaRef.value.insertFunction(item, []);
}
function insertVar(item: any) {
  CommonFomaRef.value.insertVariable(item);
}
</script>

<template>
  <ElDivider>变量</ElDivider>
  <ElButton v-for="item in vars" :key="item.value" @click="insertVar(item)">
    {{ item.label }}
  </ElButton>
  <ElDivider>函数</ElDivider>
  <ElButton v-for="item in funs" :key="item.value" @click="insertFun(item)">
    {{ item.label }}
  </ElButton>
  <ElDivider>编辑器内容</ElDivider>
  {{ model }}
  <ElDivider />
  <CommonFoma
    ref="CommonFomaRef"
    v-model="model"
    v-model:error="error"
    :allowed-funs="funs"
    :allowed-vars="vars"
  />

  <div v-if="error" class="error">
    {{ error }}
  </div>
</template>

<style scoped>
.error {
  margin-top: 5px;
  color: var(--el-color-error);
}
</style>
