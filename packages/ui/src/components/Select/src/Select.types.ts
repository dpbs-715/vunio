import type { Ref } from 'vue';
import { DataHandlerType } from '~/_utils/dataHandlerClass.ts';

export type CommonSelectDisabledValuesSource = any[] | Record<string | number, any>;

export type CommonSelectDisabledValues =
  | CommonSelectDisabledValuesSource
  | Ref<CommonSelectDisabledValuesSource>
  | ((
      option: Record<any, any>,
      value: any,
    ) => boolean | CommonSelectDisabledValuesSource | Ref<CommonSelectDisabledValuesSource>);

export interface CommonSelectProps extends DataHandlerType {
  /**
   * 自动选择策略
   * - false: 不自动选择
   * - true | 'one': 只有一个选项时自动选择（默认）
   * - 'first': 总是自动选择第一个
   * - 'last': 总是自动选择最后一个
   */
  autoSelect?: boolean | 'one' | 'first' | 'last';
  //是否多选
  multiple?: boolean;
  //禁用的选项值
  disabledValues?: CommonSelectDisabledValues;
  //组件类型
  componentType?: 'ElSelectV2' | 'ElSelect' | 'ElTreeSelect';
  onChange?: Function | Array<Function>;
  modelValue?: any;
  label?: any;
}
