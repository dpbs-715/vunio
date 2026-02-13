<script setup lang="ts">
import { CommonForm, type CommonFormConfig, renderDialog } from '~/@vunio/ui';
import { h, ref } from 'vue';
import { useConfigs } from '~/@vunio/hooks';

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
const formRef = ref();
function openDialog() {
  renderDialog(
    h(CommonForm),
    {
      config: config,
      ref: (el: any) => (formRef.value = el),
    },
    {
      title: '测试',
      onConfirm: (close: Function) => {
        console.log(formRef.value.getFormData());
        close();
      },
    },
  );
}
</script>

<template>
  <button @click="openDialog">
    打开弹窗
  </button>
</template>

<style scoped></style>
