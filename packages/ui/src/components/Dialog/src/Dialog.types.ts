export interface DialogProps {
  title?: string;
  width?: string | number;
  fullscreen?: Boolean;
  top?: string;
  modal: Boolean;
  modalClass?: string;
  appendToBody?: Boolean;
  draggable?: Boolean;
  destroyOnClose?: Boolean;
  center?: Boolean;
  alignCenter?: Boolean;
  modalBlur?: Boolean;
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
