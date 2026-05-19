import { ElTable, ElTableV2, ElAutoResizer } from 'element-plus';
import type { CommonTableConfig, CommonTableProps, DataType, RowDataType } from './Table.types';
import { SORT_ORDERS, SORTABLE, sortChange, useTableV2Sort } from './useTableSort.ts';
import { ComputedRef, SlotsType, toValue } from 'vue';
import { setDefaultSlotColumnProps, useComponentProps } from '~/_utils/componentUtils.ts';
import { RenderColumnsClass } from './renderColumns.tsx';
import { VueDraggable } from 'vue-draggable-plus';

import { componentDefaultPropsMap } from '~/components/CreateComponent/src/defaultMap.ts';
const defaultColMinWidth = componentDefaultPropsMap.CommonTable.defaultColMinWidth;

export class RenderTableClass {
  props: ComputedRef<CommonTableProps>;
  slots: any;
  emits: any;
  tableRef: any;
  constructor(props: CommonTableProps, attrs: any, slots: SlotsType, emits: any) {
    const mergedProps = new Proxy({} as CommonTableProps, {
      get: (_, key: keyof CommonTableProps) => (key in attrs ? attrs[key] : props[key]),
      ownKeys: () => Array.from(new Set([...Reflect.ownKeys(props), ...Reflect.ownKeys(attrs)])),
      getOwnPropertyDescriptor: () => ({
        enumerable: true,
        configurable: true,
      }),
    });

    this.props = useComponentProps(mergedProps, 'CommonTable');
    this.slots = slots;
    this.emits = emits;
  }
  get data(): DataType {
    return this.props.value.data || [];
  }
  getTableRef() {
    return this.tableRef;
  }
  /**
   * 渲染主入口
   * */
  render() {
    return this.getComponent();
  }
  /**
   * 获取组件
   * */
  getComponent() {
    if (this.props.value.v2) {
      return this.renderTableV2(ElTableV2);
    } else {
      return this.renderTable(ElTable);
    }
  }
  /**
   * 渲染elementPlus TableV2
   * */
  renderTableV2(Com: any) {
    const { sortState, setSortState } = useTableV2Sort(() => this.data);
    const renderColumns: RenderColumnsClass = new RenderColumnsClass(this.props, this.slots);

    const v2Props = {
      columns: this.props.value?.config?.map((item: CommonTableConfig, index: number) => {
        return {
          sortable: SORTABLE,
          width: defaultColMinWidth,
          dataKey: item.field,
          title: item.label,
          cellRenderer: (CellRenderProps: any) => renderColumns.renderV2(CellRenderProps, item),
          headerCellRenderer: (CellRenderProps: any) =>
            renderColumns.renderHeader(CellRenderProps, { configItem: item, index }, true),
          ...this.props.value.column,
          ...item,
        };
      }),
    };
    return (
      <ElAutoResizer>
        {{
          default: ({ height, width }: { height: number; width: number }) => {
            return (
              <Com
                class="commonTable"
                ref={(instance: any) => (this.tableRef = instance)}
                v-loading={toValue(this.props.value.loading)}
                sortBy={sortState.value}
                onColumnSort={setSortState}
                height={height}
                width={width}
                {...v2Props}
                {...this.props.value}
                config={null}
              >
                {this.renderTableV2Slots()}
              </Com>
            );
          },
        }}
      </ElAutoResizer>
    );
  }

  onDragEnd(evt: any) {
    const oldItem = this.data[evt.oldIndex];
    const toItem = this.data[evt.newIndex];
    this.data.splice(evt.oldIndex, 1);
    this.data.splice(evt.newIndex, 0, oldItem);
    this.emits('dragEnd', oldItem, toItem, evt);
  }

  useDrag(Com: any) {
    if (this.props.value.useDrag) {
      return (
        <VueDraggable
          animation="150"
          vModel={this.props.value.data}
          target="tbody"
          onEnd={this.onDragEnd.bind(this)}
        >
          {Com}
        </VueDraggable>
      );
    } else {
      return Com;
    }
  }

  /**
   * 渲染elementPlus Table
   * */
  renderTable(Com: any) {
    return this.useDrag(
      <Com
        ref={(instance: any) => (this.tableRef = instance)}
        class={['commonTable', this.props.value.singleSelection && 'commonTableSingleSelection']}
        v-loading={toValue(this.props.value.loading)}
        onSortChange={(arg: any) => sortChange(arg, this.data)}
        onRowDblclick={(row: RowDataType) => this.onRowDblclick(row)}
        onSelectionChange={(selection: Record<any, any>[]) =>
          this.handleSelectionChange(selection, this.props.value)
        }
        {...this.props.value}
      >
        {this.renderTableSlots()}
      </Com>,
    );
  }
  /**
   * 渲染插槽
   * */
  renderTableSlots() {
    const defaultSlot = this.slots.default?.();
    setDefaultSlotColumnProps(defaultSlot, (props: any) => {
      props.sortOrders = SORT_ORDERS;
      props.sortable = SORTABLE;
    });

    const renderColumns: RenderColumnsClass = new RenderColumnsClass(this.props, this.slots);

    //todo:设置插槽的默认值 empty等
    return {
      ...this.slots,
      default: () => {
        return [
          defaultSlot,
          renderColumns.renderSelection(),
          renderColumns.renderIndex(),
          renderColumns.render(),
        ];
      },
    };
  }
  handleSelectionChange = (selection: Record<any, any>[], props: any) => {
    if (props.singleSelection) {
      if (selection.length > 1) {
        this.tableRef.toggleRowSelection(selection[0], false);
      }
    }
    this.emits('selectionChange', this.tableRef.getSelectionRows());
  };
  onRowDblclick(row: RowDataType) {
    const selection = this.tableRef.columns.find((o: any) => o.type === 'selection');
    if (selection?.selectable) {
      if (selection?.selectable(row)) {
        this.tableRef.toggleRowSelection(row);
      }
    } else {
      this.tableRef.toggleRowSelection(row);
    }
  }
  renderTableV2Slots() {
    //todo:设置插槽的默认值 empty等
    return {
      ...this.slots,
    };
  }
}
