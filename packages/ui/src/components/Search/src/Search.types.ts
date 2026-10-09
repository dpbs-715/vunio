import { CommonFormBaseProps, CommonFormConfig } from '~/components';

export interface CommonSearchProps extends CommonFormBaseProps {
  config?: CommonFormConfig[];
  col?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  actionCol?: number;
  //会把默认值也清空
  resetAll?: boolean;
  //重置时不查询
  resetWithoutSearch?: boolean;
}

export interface CommonSearchEmits {
  //重置的回调
  (e: 'reset'): void;
  (e: 'search'): void;
}
