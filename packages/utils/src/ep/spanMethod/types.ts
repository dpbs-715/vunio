/**
 * spanMethod 类型定义
 */

export interface SpanMethodProps {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}

export type SpanMethod = (props: SpanMethodProps) => { rowspan: number; colspan: number };

export type MergeGroup = string[];

/**
 * 合并区域信息
 */
export interface MergeArea {
  startRow: number; // 合并区域起始行
  rowCount: number; // 合并的行数
}

/**
 * 列的合并区域映射 - 存储每列的所有合并区域
 */
export type ColumnMergeAreas = Map<string, MergeArea[]>;

/**
 * 单元格合并信息缓存
 * key 格式：`${rowIndex}-${columnProp}`
 */
export interface SpanCache {
  [key: string]: { rowspan: number; colspan: number };
}

/**
 * 列合并信息缓存
 */
export interface ColSpanCache {
  [rowIndex: number]: {
    [columnProp: string]: { rowspan: number; colspan: number };
  };
}
