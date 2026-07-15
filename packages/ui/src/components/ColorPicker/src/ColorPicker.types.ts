export type CommonColorPickerSize = 'large' | 'default' | 'small';
export type CommonColorPickerFormat = 'auto' | 'hex' | 'rgb';

export interface CommonColorPickerProps {
  modelValue?: string;
  size?: CommonColorPickerSize;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showAlpha?: boolean;
  predefine?: string[];
  placeholder?: string;
  colorFormat?: CommonColorPickerFormat;
}

export interface CommonColorPickerEmits {
  (event: 'update:modelValue', value: string): void;
  (event: 'change', value: string): void;
  (event: 'focus', focusEvent: FocusEvent): void;
  (event: 'blur', focusEvent: FocusEvent): void;
  (event: 'clear'): void;
  (event: 'invalid', value: string): void;
}
