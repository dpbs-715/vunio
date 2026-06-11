import type { AppContext, Component, VNode } from 'vue';
import type { DialogProps as ElDialogProps } from 'element-plus';

export interface DialogProps extends ElDialogProps {
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
