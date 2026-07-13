import { baseConfig, ComponentFunctionType, ComponentType } from '~/components';
import { Arrayable } from 'element-plus/es/utils';
import { FormItemRule, FormRules } from 'element-plus';
import { MaybeRef } from 'vue';

export const COMMON_FORM_SET_FIELD_COMMAND = 'common-form:set-field' as const;

export interface CommonFormCommand {
  readonly kind: typeof COMMON_FORM_SET_FIELD_COMMAND;
  readonly field: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  execute: () => void;
  undo: () => void;
  redo: () => void;
  merge: (nextCommand: CommonFormCommand) => boolean;
}

export type CommonFormCommandDispatcher = (command: CommonFormCommand) => void;

type hiddenFunType = (params: Record<string, any>) => boolean;
type rulesFunType = (params: Record<string, any>) => Arrayable<FormItemRule>;
type MaybeReadonlyRef<T> = T | Readonly<{ value: T }>;

export type CommonFormConfig = Omit<baseConfig, 'component'> & {
  readField?: string;
  component?: string | ComponentFunctionType | ComponentType;
  span?: number;
  hidden?: MaybeReadonlyRef<boolean> | hiddenFunType;
  isDisabled?: Function;
  labelField?: string;
  formItemProps?: {
    labelWidth?: string;
    [key: string]: any;
  };
  rules?: Arrayable<FormItemRule> | rulesFunType;
  [key: string]: any;
};

export interface CommonFormBaseProps {
  rules?: FormRules;
  inline?: Boolean;
  inlineMessage?: Boolean;
  labelPosition?: '' | 'left' | 'right' | 'top';
  labelWidth?: string | null;
  labelSuffix?: string;
  size?: '' | 'large' | 'default' | 'small';
  requireAsteriskPosition?: Boolean;
  statusIcon?: Boolean;
  showMessage?: Boolean;
  validateOnRuleChange?: Boolean;
  hideRequiredAsterisk?: Boolean;
  loading?: MaybeRef<Boolean>;
}

export interface CommonFormProps extends CommonFormBaseProps {
  config?: CommonFormConfig[];
  commandDispatcher?: CommonFormCommandDispatcher;
  readonly?: boolean;
  loading?: boolean;
  emptyValue?: String;
  col?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
