<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { h, useSlots, getCurrentInstance, computed, useAttrs } from 'vue';
import type { DialogEmits, DialogPropsWithEvents } from './Dialog.types';
import { CommonButton } from '../../Button';
import { useComponentProps } from '~/_utils/componentUtils.ts';
defineOptions({
  name: 'CommonDialog',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DialogPropsWithEvents>(), {
  title: '标题',
});

const emits = defineEmits<DialogEmits>();

const dialogProps = useComponentProps(props, 'CommonDialog');
const elDialogProps = computed(() => {
  const restProps = { ...dialogProps.value };
  delete restProps.footerHide;
  delete restProps.modalBlur;
  delete restProps.onConfirm;
  return restProps;
});

const dialogVisible = defineModel<boolean>();
const attrs = useAttrs();

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

const defaultFooterSlot = () => [
  h(CommonButton, { type: 'normal', onClick: close }, { default: () => '取消' }),
  h(CommonButton, { type: 'primary', onClick: confirm }, { default: () => '确定' }),
];

const comSlots = computed(() => {
  const resolvedSlots: Record<string, any> = { ...slots };

  if (dialogProps.value.footerHide) {
    delete resolvedSlots.footer;
    return resolvedSlots;
  }

  if (!resolvedSlots.footer) {
    resolvedSlots.footer = defaultFooterSlot;
  }

  return resolvedSlots;
});
</script>
<template>
  <component
    :is="
      h(
        ElDialog as any,
        {
          ...$attrs,
          ...elDialogProps,
          modalClass: `
            ${dialogProps.modalBlur ? 'modalBlur' : ''}
            ${dialogProps.modalClass ?? ''}
          `,
          class: ['CommonDialog', attrs.class],
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
