import { computed, ComputedRef, toValue } from 'vue';
import { componentDefaultPropsMap, CreateComponent } from '~/components';
import { ElDescriptions, ElDescriptionsItem } from 'element-plus';
import { CommonDescriptionsProps, DescriptionsConfig } from './Descriptions.types';
import { configIterator } from '~/_utils/componentUtils.ts';

export class RenderDescriptions {
  props: ComputedRef<CommonDescriptionsProps>;
  slots: any;
  model: any;
  constructor(props: CommonDescriptionsProps, slots: any, attrs: any, model: any) {
    this.slots = slots;
    this.model = model;
    this.props = computed(() => {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => {
          return v !== undefined;
        }),
      );

      return {
        ...componentDefaultPropsMap.CommonDescriptions,
        ...attrs,
        ...cleaned,
      };
    });
  }

  renderItem(configItem: DescriptionsConfig) {
    const model = toValue(this.model);
    const item: any = {};
    //处理配置 对配置追加参数
    configIterator(item, {
      config: configItem,
      getWriteArgs: () => ({
        formData: toValue(this.model),
        configItem,
      }),
    });
    if (this.slots[item.field]) {
      return this.slots[item.field]({ formData: model, configItem });
    } else if (item.component) {
      return <CreateComponent config={item} vModel={model[item.field]}></CreateComponent>;
    } else {
      return {
        default: () => (item.formatter ? item.formatter(model[item.field]) : model[item.field]),
        ...item.slots,
      };
    }
  }
  renderSlots(config: DescriptionsConfig[]) {
    return config?.map((item) => {
      return <ElDescriptionsItem {...item}>{this.renderItem(item)}</ElDescriptionsItem>;
    });
  }

  render() {
    const { config, ...props } = toValue(this.props);
    return (
      <ElDescriptions {...props}>
        {{
          default: () => this.renderSlots(config as DescriptionsConfig[]),
          title: this.slots.title?.(),
          extra: this.slots.extra?.(),
        }}
      </ElDescriptions>
    );
  }
}
