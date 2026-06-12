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
 * 行合并区域来源：合计侧据此对被合并列去重（每个合并区域只取首行代表值），
 * 复用展示侧的合并计算，确保合计与渲染合并一致。
 * 由 spanMethodBuilder.rowMergeSource() 提供，summaryMethodBuilder.mergedFrom() 消费。
 */
export interface RowMergeSource {
  /** 基于给定数据计算每列的合并区域 */
  collectAreas(rows: any[]): ColumnMergeAreas;
}

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
