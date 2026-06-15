import { Reactive, toValue } from 'vue';
import type { Config, Props } from './cc.types';
import { ElCheckbox, ElOption, ElRadio } from 'element-plus';

type Option = {
  label: any;
  value: any;
};
/**
 * 扩展处理
 * */
export function ExpandHandler({
  config,
  slotsMap,
  normalProps,
}: {
  config: Config;
  slotsMap: Reactive<Record<string, any>>;
  normalProps: Props;
}) {
  /**
   * options扩展配置
   * */
  function optionsHandler() {
    switch (config.component) {
      case 'radioGroup':
        slotsMap.default = () =>
          config?.props?.options?.map((item: Option) => {
            return <ElRadio value={item.value}>{item.label}</ElRadio>;
          });
        break;
      case 'checkboxGroup':
        slotsMap.default = () =>
          config?.props?.options?.map((item: Option) => {
            return <ElCheckbox value={item.value}>{item.label}</ElCheckbox>;
          });
        break;
      case 'select':
        slotsMap.default = () =>
          config?.props?.options?.map((item: Option) => {
            return <ElOption value={item.value} label={item.label} />;
          });
        break;
    }
  }

  function handlerPlaceholder() {
    if (normalProps.placeholder && normalProps.placeholder.includes?.('{label}')) {
      normalProps.placeholder = normalProps.placeholder?.replace(
        '{label}',
        toValue(config.label) || '',
      );
    }
  }

  optionsHandler();
  handlerPlaceholder();
}
