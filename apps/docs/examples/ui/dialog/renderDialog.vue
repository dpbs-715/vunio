<script setup lang="ts">
import { CommonForm, CommonButton, type CommonFormConfig, renderDialog } from '@vunio/ui';
import { h, reactive } from 'vue';
import { useConfigs } from '@vunio/hooks';

const formData = reactive({
  test: '',
});
const { config } = useConfigs<CommonFormConfig>([
  {
    label: '测试',
    field: 'test',
    component: 'commonSelect',
    props: {
      options: [
        {
          label: '1',
          value: 1,
        },
        {
          label: '2',
          value: 2,
        },
      ],
    },
  },
]);
function openDialog() {
  renderDialog(
    h(CommonForm),
    {
      modelValue: formData,
      config: config,
    },
    {
      title: '测试',
      onConfirm: (close: Function) => {
        close();
      },
    },
  );
}
</script>

<template>
  {{ formData }}
  <el-divider />
  <CommonButton type="primary" @click="openDialog">
    打开弹窗
  </CommonButton>
</template>

<style scoped></style>
