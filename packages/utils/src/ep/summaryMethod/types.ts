/**
 * summaryMethod 类型定义
 */

/** el-table summary-method 的入参 */
export interface SummaryMethodProps {
  /** 当前渲染的列（el-table 的 TableColumnCtx，含 property 字段） */
  columns: any[];
  /** 表格数据源 */
  data: any[];
}

/** el-table summary-method 返回每列的合计文本 */
export type SummaryMethod = (props: SummaryMethodProps) => string[];

/**
 * 聚合函数：基于某列的有效数值与原始行，计算出一个数值结果。
 * 返回的数值会按 precision / formatter 统一格式化为字符串。
 */
export type Aggregator<Row = any> = (values: number[], rows: Row[]) => number;

/**
 * 自定义合计：完全接管某列的合计文本输出。
 * 返回 number 时按数值格式化，返回 string 时原样展示。
 */
export type SummaryResolver<Row = any> = (
  values: number[],
  rows: Row[],
  props: SummaryMethodProps,
) => string | number;

/** 数值结果格式化函数 */
export type SummaryFormatter = (value: number, field: string) => string;

/** 列配置来源：支持静态数组、ref/computed 或 getter（按 tab 切换时实时取值） */
export type SummaryColumnLike = { field?: unknown; summable?: boolean } & Record<string, any>;
