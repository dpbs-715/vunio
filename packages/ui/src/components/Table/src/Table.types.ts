import { baseConfig } from '~/components';
import type { Arrayable } from 'element-plus/es/utils';
import type { Column, FormItemRule } from 'element-plus';
import { MaybeRef } from 'vue';

type hiddenFunType = (_params: Record<string, any>) => Boolean;
type rulesFunType = (_params: Record<string, any>) => Arrayable<FormItemRule>;

export type CommonTableConfig = Omit<baseConfig, 'component'> & {
  component?: any;
  hidden?: MaybeRef<Boolean> | hiddenFunType;
  isDisabled?: Function;
  labelField?: string;
  rules?: Arrayable<FormItemRule> | rulesFunType;
  helpText?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: Function;
  columnChildren?: CommonTableConfig[];
  //自定义单元格
  cellRenderer?: Function;
  //自定义头部标题
  renderHeaderScope?: Function;

  /*elTable*/
  type?: string;
  index?: number;
  columnKey?: string;
  width?: number;
  minWidth?: string | number;
  fixed?: Boolean | string;
  renderHeader?: Function;
  sortable?: Boolean;
  sortMethod?: Function;
  sortBy?: string | string[] | Function;
  sortOrders?: string[];
  resizable?: Boolean;
  showOverflowTooltip?: Boolean;
  headerAlign?: 'left' | 'center' | 'right';
  reserveSelection?: Boolean;
  filters?: Array<{ text: string; value: string | number }>;
  filterPlacement?: string;
  filterMultiple?: Boolean;
  filterMethod?: Function;
  filteredValue?: string[];
  /*elTableV2*/
  class?: string;
  flexGrow?: number;
  flexShrink?: number;
  headerClass?: string;
  style?: object;
  title?: string;
  maxWidth?: number;
};

export type DataType = Array<RowDataType>;
export type RowDataType = Record<string, any>;

export interface CommonTableProps {
  config?: CommonTableConfig[];
  v2?: Boolean | undefined;
  data?: DataType;
  loading?: MaybeRef<Boolean>;
  emptyText?: string;
  emptyValue?: string;
  useIndex?: Boolean;
  useSelection?: Boolean;
  singleSelection?: Boolean;
  /*elTable*/
  rowKey?: string | Function | symbol | number;
  height?: number | string;
  width?: number | string;
  maxHeight?: number | string;
  stripe?: Boolean;
  border?: Boolean;
  size?: '' | 'large' | 'default' | 'small';
  fit?: Boolean;
  showHeader?: Boolean;
  highlightCurrentRow?: Boolean;
  currentRowKey?: string | number;
  rowClassName?: string | Function;
  rowStyle?: object | Function;
  cellClassName?: string | Function;
  cellStyle?: object | Function;
  headerRowClassName?: string | Function;
  headerRowStyle?: object | Function;
  headerCellClassName?: string | Function;
  headerCellStyle?: object | Function;
  defaultExpandAll?: Boolean;
  expandRowKeys?: Array<string | number>;
  tooltipEffect?: 'dark' | 'light';
  tooltipOption?: object;
  showSummary?: Boolean;
  sumText?: string;
  summaryMethod?: Function;
  spanMethod?: Function;
  selectOnIndeterminate?: Boolean;
  indent?: number;
  lazy?: Boolean;
  load?: Function;
  treeProps?: object;
  tableLayout?: string;
  scrollbarAlwaysOn?: Boolean;
  showOverflowTooltip?: Boolean;
  flexible?: Boolean;
  defaultColMinWidth?: number;
  column?: any;
  /*elTableV2*/
  cache?: number;
  estimatedRowHeight?: number;
  headerClass?: string | Function;
  headerProps?: object | Function;
  headerCellProps?: object | Function;
  headerHeight?: number | number[];
  footerHeight?: number;
  rowClass?: string | Function;
  rowProps?: object | Function;
  rowHeight?: number;
  cellProps?: object | Function;
  columns?: Column[];
  dataGetter?: Function;
  fixedData?: RowDataType[];
  expandedRowKeys?: Array<string | number>;
  defaultExpandedRowKeys?: Array<string | number>;
  class?: string | string[] | object;
  fixed?: Boolean;
  hScrollbarSize?: number;
  vScrollbarSize?: number;
  sortBy?: object;
  sortState?: object;
  useDrag?: Boolean;
  selectable?: Function;
}
