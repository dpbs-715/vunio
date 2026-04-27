import { cloneVNode, h, isVNode, render } from 'vue';
import type {
  DialogPropsWithEvents,
  RenderDialogContent,
  RenderDialogOptions,
} from './Dialog.types.ts';
import CommonDialog from './Dialog.vue';

export function renderDialog(
  component: RenderDialogContent,
  props?: Record<string, any>,
  dialogProps?: DialogPropsWithEvents,
  options?: RenderDialogOptions,
) {
  const div = document.createElement('div');

  const renderContent = () => {
    if (isVNode(component)) {
      return cloneVNode(component, props);
    }

    return h(component, props);
  };

  const dialog = h(
    CommonDialog as any,
    {
      ...dialogProps,
      modelValue: true,
      onClosed: () => {
        dialogProps?.onClosed?.();
        render(null, div);
        div.parentNode?.removeChild(div);
      },
    },
    {
      default: renderContent,
    },
  );

  if (options?.appContext) {
    dialog.appContext = options.appContext;
  }

  document.body.appendChild(div);
  render(dialog, div);
}
