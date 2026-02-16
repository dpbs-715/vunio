import { createApp, h, Component } from 'vue';
import { DialogPropsWithEvents } from './Dialog.types.ts';
import CommonDialog from './Dialog.vue';

export function renderDialog(
  component: Component,
  props?: Record<string, any>,
  dialogProps?: DialogPropsWithEvents,
) {
  const dialog = h(
    CommonDialog as any,
    {
      ...dialogProps,
      modelValue: true,
      onClosed: () => {
        dialogProps?.onClosed?.();
        app.unmount();
        document.body.removeChild(div);
      },
    },
    {
      default: () => h(component, props),
    },
  );

  const app = createApp(dialog);

  const div = document.createElement('div');
  document.body.appendChild(div);
  app.mount(div);
}
