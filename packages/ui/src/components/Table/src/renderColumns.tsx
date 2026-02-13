import {
  type CommonTableConfig,
  type CommonTableProps,
  componentDefaultPropsMap,
  CreateComponent,
  type DataType,
  type RowDataType,
} from '~/components';
import { isArray } from '@vunio/utils';
import { ElIcon, ElTableColumn, ElTooltip, ElFormItem } from 'element-plus';
import { SORT_ORDERS, SORTABLE } from './useTableSort.ts';
import { configIterator, getRules, isHidden } from '~/_utils/componentUtils.ts';
import { ComputedRef, type SlotsType, toValue, withModifiers } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';

// Lazy getter for defaultColMinWidth to avoid initialization order issues in tests
const getDefaultColMinWidth = () => componentDefaultPropsMap.CommonTable?.defaultColMinWidth ?? 150;

export class RenderColumnsClass {
  props: ComputedRef<CommonTableProps>;
  slots: any;
  data: DataType;
  constructor(props: ComputedRef<CommonTableProps>, slots: SlotsType) {
    this.props = props;
    this.data = props.value.data || [];
    this.slots = slots;
  }
  /**
   * 渲染主入口
   * */
  render() {
    if (this.props.value.config) {
      return this.renderColumn(this.props.value.config);
    } else {
      return;
    }
  }
  /**
   * 渲染tableV2
   * */
  renderV2(CellRenderProps: any, configItem: CommonTableConfig) {
    return this.renderCell({
      configItem,
      row: CellRenderProps.rowData,
      $index: CellRenderProps.rowIndex,
    });
  }
  /**
   * 渲染表格头部单元格内容
   * @param baseParams 基础参数对象，传递给自定义头部渲染函数
   * @param configItem 表格配置项，包含当前列的配置信息
   * @param index 当前列的索引
   * @param resizer 是否显示列宽调整器
   * 此函数负责根据配置项和基础参数渲染表格的头部内容，包括必填标记、帮助提示图标以及自定义的头部渲染
   */
  renderHeader(
    baseParams: Record<string, any>,
    { configItem, index }: { configItem: CommonTableConfig; index: number },
    resizer?: boolean,
  ) {
    //是否必填
    let required = checkRequired(configItem.rules);
    //必填头部加*
    return (
      <>
        {resizer && renderResizer(configItem)}
        {required && renderAsterisk()}
        {configItem.renderHeaderScope?.(baseParams, { configItem, index }) || (
          <span>{configItem.label}</span>
        )}
        {renderHelpToolTips(configItem.helpText)}
      </>
    );
  }

  /**
   * 渲染表单Item
   * */
  checkFormItem(
    node: any,
    {
      configItem,
      row,
      $index,
    }: {
      configItem: CommonTableConfig;
      row: RowDataType;
      $index: number;
    },
  ) {
    let align = configItem.align || this.props.value.column.align;
    if (configItem.component) {
      //有column渲染formItem
      let rules;
      //处理rules 数组形式跟函数形式
      if (configItem.rules) {
        rules = getRules(configItem, {
          $index,
          tableData: toValue(this.data),
          rowData: toValue(row),
        });
      } else {
        rules = [];
      }
      return (
        <ElFormItem
          style={{
            width: '100%',
            marginBottom: '0px',
            height: '100%',
          }}
          prop={`${$index}.${configItem.field}`}
          rules={rules}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: align,
            }}
          >
            {node}
          </div>
        </ElFormItem>
      );
    } else {
      // 普通表格仅展示
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: align,
            width: '100%',
          }}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '100%',
              width: '100%',
            }}
          >
            {configItem.formatter?.(row) || node || this.props.value.emptyValue}
          </div>
        </div>
      );
    }
  }
  /**
   * 渲染单元格
   * */
  renderCell({
    configItem,
    row,
    $index,
  }: {
    configItem: CommonTableConfig;
    row: RowDataType;
    $index: number;
  }) {
    // 如果使用函数式渲染、没有配置component、使用字段插槽
    if (configItem.cellRenderer || !configItem.component || this.slots[configItem.field]) {
      // renderNode 默认渲染函数
      let renderNode: any = () => row[configItem.field];
      if (configItem.field && this.slots[configItem.field]) {
        // 如果有字段插槽
        renderNode = this.slots[configItem.field];
      } else if (configItem.cellRenderer) {
        //函数式渲染
        renderNode = configItem.cellRenderer;
      }
      //检查form传入渲染
      return this.checkFormItem(
        renderNode({
          cellData: row[configItem.field],
          column: configItem,
          rowData: row,
          rowIndex: $index,
          tableData: toValue(this.data),
        }),
        { configItem, row, $index },
      );
    }
    const cfg: any = {};
    //处理配置 对配置追加参数
    configIterator(cfg, {
      config: configItem,
      writeArgs: {
        rowData: row,
        tableData: toValue(this.data),
        rowIndex: $index,
        configItem,
      },
    });
    const modelMap: Record<string, any> = {};
    const model = configItem.model;
    for (const key in model) {
      modelMap[key] = row[model[key]];
      modelMap[`onUpdate:${key}`] = (val: any) => {
        row[model[key]] = val;
      };
    }

    //如果有model指定配置时
    //支持指定字段名称双向绑定两个字段  传入字段的字符串名称
    return this.checkFormItem(
      <CreateComponent
        emptyText={row[configItem.field]}
        key={$index}
        config={cfg}
        vModel={row[configItem.field]}
        {...modelMap}
      />,
      { configItem: cfg, row, $index },
    );
  }

  /**
   * 渲染Column
   * */
  renderColumn(config: CommonTableConfig[]) {
    return config.map((configItem: CommonTableConfig, index: number) => {
      //检查是否包含子集
      const hasChildren: boolean =
        isArray(configItem.columnChildren) && configItem.columnChildren.length > 0;
      return (
        !isHidden(configItem, { tableData: toValue(this.data) }) && (
          <ElTableColumn
            sortable={hasChildren ? false : SORTABLE.value}
            min-width={getDefaultColMinWidth()}
            prop={configItem.field}
            key={index}
            sortOrders={SORT_ORDERS.value}
            {...this.props.value.column}
            {...configItem}
          >
            {{
              header: (baseParams: any) => {
                return this.renderHeader(baseParams, { configItem, index });
              },
              default: ({ row, $index }: any) => {
                if (hasChildren) {
                  return this.renderColumn(configItem.columnChildren || []);
                } else {
                  return this.renderCell({
                    configItem,
                    row,
                    $index,
                  });
                }
              },
            }}
          </ElTableColumn>
        )
      );
    });
  }

  /**
   * 渲染序号
   * */
  renderIndex() {
    if (this.props.value.useIndex) {
      return <ElTableColumn align={'center'} type="index" label={'序号'} width={70} />;
    }
  }
  /**
   * 勾选项
   * */
  renderSelection() {
    if (this.props.value.useSelection) {
      return (
        <ElTableColumn
          align={'center'}
          type="selection"
          width={45}
          selectable={this.props.value.selectable}
        />
      );
    }
  }
}

/**
 * 检查是否必填
 * */
function checkRequired(rules: any) {
  //是否有规则配置
  if (rules) {
    if (Array.isArray(rules)) {
      //如果规则是列表 判断是否有必填参数
      return rules.some((o: any) => o.required == true);
    } else if (typeof rules === 'function') {
      //如果规则是函数 判断是否有必填参数
      return rules().some((o: any) => o.required == true);
    }
  }
  return false;
}

/**
 * 渲染帮助提示
 * */
function renderHelpToolTips(text: string | undefined) {
  if (text) {
    return (
      <ElTooltip content={text} placement="top">
        {{
          default: () => (
            <ElIcon style={{ margin: '0 5px' }}>
              <QuestionFilled />
            </ElIcon>
          ),
        }}
      </ElTooltip>
    );
  }
}

function renderAsterisk() {
  return <span style={{ marginRight: '5px', color: 'red' }}>*</span>;
}

function renderResizer(configItem: CommonTableConfig) {
  return (
    <div
      class={'header_resizer'}
      onClick={withModifiers(() => {}, ['stop'])}
      onMousedown={() => mousedown(configItem)}
    ></div>
  );
}
const mousedown = (configItem: CommonTableConfig) => {
  //鼠标移动方法
  const moveFun = (e2: MouseEvent) => {
    e2.preventDefault();
    // 传入变化量控制宽度
    changeColumnWidth?.(e2.movementX, configItem.width || getDefaultColMinWidth(), configItem);
  };
  //移除监听
  const removeFun = () => {
    //移除移动监听
    document.removeEventListener('mousemove', moveFun);
    //移除鼠标放开监听
    document.removeEventListener('mouseup', removeFun);
  };
  //添加移动监听
  document.addEventListener('mousemove', moveFun);
  //添加鼠标放开监听
  document.addEventListener('mouseup', removeFun);
};

const changeColumnWidth = (
  width: number,
  curColWidth: number = 0,
  configItem: CommonTableConfig,
) => {
  if (configItem) {
    let { width: colWidth } = configItem;
    // 原宽度与变化量求和
    if (typeof colWidth === 'string') {
      colWidth = +curColWidth + width;
    } else {
      colWidth = curColWidth + width;
    }
    // 宽度不能小于最小值
    const W = Math.max(colWidth, configItem.minWidth || getDefaultColMinWidth());
    configItem.width = W;
  }
};
