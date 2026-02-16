<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { h, useSlots, getCurrentInstance } from 'vue';
import type { DialogEmits, DialogPropsWithEvents } from './Dialog.types';
import { CommonButton } from '../../Button';
import { useComponentProps } from '~/_utils/componentUtils.ts';
defineOptions({
  name: 'CommonDialog',
});

const props = withDefaults(defineProps<DialogPropsWithEvents>(), {
  title: '标题',
});

const emits = defineEmits<DialogEmits>();

const dialogProps = useComponentProps(props, 'CommonDialog');

const dialogVisible = defineModel<boolean>();

function updateModel(val: boolean) {
  dialogVisible.value = val;
}

const slots = useSlots();

function close() {
  dialogVisible.value = false;
  emits('close');
}
const vm = getCurrentInstance();

function confirm() {
  const vnode = vm?.vnode;
  if (vnode?.props?.onConfirm) {
    emits('confirm', close);
  } else {
    close();
  }
}

const comSlots = {
  footer: () => [
    h(CommonButton, { type: 'normal', onClick: close }, { default: () => '取消' }),
    h(CommonButton, { type: 'primary', onClick: confirm }, { default: () => '确定' }),
  ],
  ...slots,
};
</script>
<template>
  <component
    :is="
      h(
        ElDialog as any,
        {
          ...$attrs,
          ...dialogProps,
          modalClass: `
            ${dialogProps.modalBlur ? 'modalBlur' : ''}
            ${dialogProps.modalClass ?? ''}
          `,
          class: 'CommonDialog',
          modelValue: dialogVisible,
          'onUpdate:modelValue': updateModel,
        },
        comSlots,
      )
    "
  />
</template>
<style lang="scss">
@use './Dialog.scss' as *;
</style>
