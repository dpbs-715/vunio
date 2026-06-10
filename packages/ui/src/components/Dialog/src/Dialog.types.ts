import type { AppContext, Component, VNode } from 'vue';
import type { DialogProps as ElDialogProps } from 'element-plus';

// 这些布尔属性在 ElDialog 中默认即为 true。若由本组件通过 defineProps 声明，
// Vue 会把未传入的布尔 prop 强制为 false，从而覆盖 ElDialog 的默认值。
// 故从声明中排除，让它们经 $attrs 透传到 ElDialog，保留其原始默认值。
type ElDialogTrueDefaultBooleanKeys =
  | 'showClose'
  | 'modal'
  | 'closeOnClickModal'
  | 'closeOnPressEscape'
  | 'lockScroll';

export interface DialogProps extends Omit<ElDialogProps, ElDialogTrueDefaultBooleanKeys> {
  modalBlur?: boolean;
  footerHide?: boolean;
}

export interface DialogEmits {
  (e: 'confirm', close: () => void): void;
  (e: 'open'): void;
  (e: 'opened'): void;
  (e: 'close'): void;
  (e: 'closed'): void;
  (e: 'openAutoFocus'): void;
  (e: 'closeAutoFocus'): void;
}

export type DialogEvents = {
  onConfirm?: (close: () => void) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  onOpenAutoFocus?: () => void;
  onCloseAutoFocus?: () => void;
};

export type DialogPropsWithEvents = DialogProps & DialogEvents;

export interface RenderDialogOptions {
  appContext?: AppContext;
}

export type RenderDialogContent = Component | VNode;
