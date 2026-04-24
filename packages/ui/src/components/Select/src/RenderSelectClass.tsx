import { Ref, SlotsType, ref, toValue } from 'vue';
import { CommonSelectProps } from './Select.types.ts';
import { ElSelect, ElSelectV2, ElTreeSelect, ElOption, ElOptionGroup } from 'element-plus';
import { DataHandlerClass } from '~/_utils/dataHandlerClass.ts';
import { injectFormContext } from '~/components/Form/src/formContext.ts';

export class RenderSelectClass extends DataHandlerClass<CommonSelectProps> {
  slots: any;
  ref: any;
  useComponent = ref('ElSelect');
  model: any;
  label: any;
  emits: any;
  attrs: any;
  loading: Ref<Boolean> = ref(false);
  constructor(
    props: CommonSelectProps,
    slots: SlotsType,
    emits: any,
    attrs: any,
    {
      model,
      label,
    }: {
      model: any;
      label: any;
    },
  ) {
    super(props, attrs);
    this.emits = emits;
    this.model = model;
    this.label = label;
    this.attrs = attrs;
    this.slots = slots;

    // 尝试向父组件（Form）注册 ready Promise
    const formContext = injectFormContext(null);
    if (formContext) {
      formContext.registerComponentReady(this.getReadyPromise());
    }

    this.init();
  }

  getFlatOptions(options = this.options.value): Record<any, any>[] {
    return (options || []).flatMap((item: any) => {
      const groupOptions = item[this.OPTIONS_FIELD.value];
      if (Array.isArray(groupOptions) && groupOptions.length > 0) {
        return this.getFlatOptions(groupOptions);
      }
      return item;
    });
  }

  renderOptionNodes(options = this.options.value) {
    return (options || []).map((item: any) => {
      const groupOptions = item[this.OPTIONS_FIELD.value];
      if (Array.isArray(groupOptions) && groupOptions.length > 0) {
        return (
          <ElOptionGroup key={item[this.LABEL_FIELD.value]} label={item[this.LABEL_FIELD.value]}>
            {this.renderOptionNodes(groupOptions)}
          </ElOptionGroup>
        );
      }

      return (
        <ElOption
          key={item[this.VALUE_FIELD.value]}
          label={item[this.LABEL_FIELD.value]}
          value={item[this.VALUE_FIELD.value]}
        />
      );
    });
  }

  afterInit(options: Record<any, any>) {
    this.determineComponentType(options);
    this.selectFirst();
    this.emits('optionsReady', options);
  }

  /**
   * 确认组件类型
   * */
  determineComponentType(localOptions: Record<any, any>) {
    let props = toValue(this.props);
    if (props.componentType) {
      this.useComponent.value = props.componentType;
    } else {
      this.useComponent.value = localOptions?.length > 50 ? 'ElSelectV2' : 'ElSelect';
    }
  }
  /**
   * 自动选择策略
   * - false: 不自动选择
   * - true | 'one': 只有一个选项时自动选择（默认）
   * - 'first': 总是自动选择第一个
   * - 'last': 总是自动选择最后一个
   * */
  selectFirst() {
    let props = toValue(this.props);
    const flatOptions = this.getFlatOptions();

    // 如果 model 已经有值，不执行自动选择
    const hasValue =
      this.model.value !== undefined && this.model.value !== null && this.model.value !== '';
    if (hasValue) {
      return;
    }

    // 未配置自动选择策略，直接返回
    if (!props.autoSelect) {
      return;
    }

    const strategy = props.autoSelect === true ? 'one' : props.autoSelect;
    const optionsLength = flatOptions.length;

    // 没有选项，直接返回
    if (optionsLength === 0) {
      return;
    }

    let targetOption: any = null;

    // 根据策略选择目标选项
    switch (strategy) {
      case 'one':
        // 只有一个选项时自动选择
        if (optionsLength === 1) {
          targetOption = flatOptions[0];
        }
        break;
      case 'first':
        // 总是选择第一个
        targetOption = flatOptions[0];
        break;
      case 'last':
        // 总是选择最后一个
        targetOption = flatOptions[optionsLength - 1];
        break;
    }

    // 执行自动选择
    if (targetOption) {
      const targetValue = targetOption[this.VALUE_FIELD.value];

      this.model.value = targetValue;
      this.changeSelect(targetValue);

      // 触发 onChange 回调
      if (this.attrs.onChange) {
        if (Array.isArray(this.attrs.onChange)) {
          this.attrs.onChange.forEach((changeFun: any) => {
            changeFun(targetValue);
          });
        } else {
          this.attrs.onChange(targetValue);
        }
      }
    }
  }
  /**
   * 选项改变操作
   * */
  changeSelect(value: any) {
    const flatOptions = this.getFlatOptions();
    if (this.props.value.multiple) {
      this.label.value = value.map((v: any) => {
        return this.findOptionByValue(v)?.[this.LABEL_FIELD.value];
      });
      const arr = flatOptions.filter((item: any) => value.includes(item[this.VALUE_FIELD.value]));
      this.emits('changeObj', arr);
    } else {
      const obj = this.findOptionByValue(value);
      this.label.value = obj && obj[this.LABEL_FIELD.value];
      this.emits('changeObj', obj);
    }
  }
  /**
   * 获取Ref实例
   * */
  getRef() {
    return this.ref;
  }
  /**
   * 渲染入口
   * */
  render() {
    switch (this.useComponent.value) {
      case 'ElSelect':
        return this.renderSelect(ElSelect);
      case 'ElSelectV2':
        return this.renderSelectV2(ElSelectV2);
      case 'ElTreeSelect':
        return this.renderTreeSelect(ElTreeSelect);
      default:
        return this.renderSelect(ElSelect);
    }
  }
  /**
   * 渲染选择器
   * */
  renderSelect(Com: any) {
    const loading = toValue(this.loading);
    let props = toValue(this.props);
    let moreProps = {};
    if (Com.props.options) {
      moreProps = {
        options: this.options.value,
      };
    }
    return (
      <Com
        ref={(instance: any) => (this.ref = instance)}
        onChange={(value: any) => this.changeSelect(value)}
        loading={loading}
        props={{
          value: this.VALUE_FIELD.value,
          label: this.LABEL_FIELD.value,
          options: this.OPTIONS_FIELD.value,
        }}
        {...props}
        {...moreProps}
        vModel={this.model.value}
      >
        {{
          default: !Com.props.options ? () => this.renderOptionNodes() : null,
        }}
      </Com>
    );
  }
  /**
   * 渲染虚拟化选择器
   * */
  renderSelectV2(Com: any) {
    let props = toValue(this.props);
    return (
      <Com
        ref={(instance: any) => (this.ref = instance)}
        onChange={(value: any) => this.changeSelect(value)}
        options={this.options.value}
        props={{
          value: this.VALUE_FIELD.value,
          label: this.LABEL_FIELD.value,
          options: this.OPTIONS_FIELD.value,
        }}
        {...props}
        vModel={this.model.value}
      />
    );
  }
  /**
   * 渲染树形选择器
   * */
  renderTreeSelect(Com: any) {
    let props = toValue(this.props);
    return (
      <Com
        ref={(instance: any) => (this.ref = instance)}
        props={{
          label: this.LABEL_FIELD.value,
          children: this.CHILDREN_FIELD.value,
        }}
        highlightCurrent={true}
        nodeKey={this.VALUE_FIELD.value}
        data={this.options.value}
        {...props}
        vModel={this.model.value}
      />
    );
  }
}
