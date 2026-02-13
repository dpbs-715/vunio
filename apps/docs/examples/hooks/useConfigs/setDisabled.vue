<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm, CommonButton } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';

const formData = ref({});
const { config, setDisabled, setDisabledAll } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
  },
  {
    field: 'test2',
    label: '字段2',
  },
  {
    field: 'test3',
    label: '字段3',
  },
]);
//设置保持禁用
setDisabled(['*test3'], true);
function disabledFun(flg: boolean) {
  setDisabledAll(flg);
}
function disabledField(flg: boolean) {
  setDisabled(['field1'], flg);
}
</script>

<template>
  <CommonForm v-model="formData" :config="config" />
  <CommonButton type="primary" @click="() => disabledField(true)">
    禁用field1
  </CommonButton>
  <CommonButton style="margin-left: 5px" type="primary" @click="() => disabledField(false)">
    启用field1
  </CommonButton>
  <CommonButton style="margin-left: 5px" type="primary" @click="() => disabledFun(true)">
    禁用全部
  </CommonButton>
  <CommonButton style="margin-left: 5px" type="primary" @click="() => disabledFun(false)">
    启用全部
  </CommonButton>
</template>

<style scoped></style>
