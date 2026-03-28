import type { MergeGroup, SpanMethod, SpanMethodProps } from './types';

/**
 * 组合多个 spanMethod 函数
 * 支持同时组合行合并和列合并：
 * 1. 任一规则将单元格标记为隐藏（0, 0）时，结果直接隐藏
 * 2. 其余情况取最大的 rowspan / colspan，支持叠加成矩形合并区域
 *
 * @param methods - 要组合的 spanMethod 函数数组
 * @returns 组合后的 spanMethod 函数
 */
export function composeSpanMethods(...methods: SpanMethod[]): SpanMethod {
  return (props: SpanMethodProps) => {
    let rowspan = 1
    let colspan = 1

    for (const method of methods) {
      const result = method(props);

      if (result.rowspan === 0 || result.colspan === 0) {
        return { rowspan: 0, colspan: 0 };
      }

      rowspan = Math.max(rowspan, result.rowspan)
      colspan = Math.max(colspan, result.colspan)
    }

    return { rowspan, colspan };
  };
}

/**
 * 计算行合并的数据指纹
 * 用于检测数据变化以失效缓存
 */
export function calculateRowMergeFingerprint(
  data: any[],
  getMergeColumns: (rowIndex: number, row: any) => string[],
): string {
  return data
    .map((row, idx) => {
      const columns = getMergeColumns(idx, row);
      return columns.map((col) => String(row[col] ?? '')).join('|');
    })
    .join(',');
}

/**
 * 计算列合并的数据指纹
 * 用于检测数据变化以失效缓存
 */
export function calculateColMergeFingerprint(
  data: any[],
  shouldMergeRow: (rowIndex: number, row: any) => boolean,
  getMergeGroups: (rowIndex: number, row: any) => MergeGroup[],
): string {
  return data
    .map((row, idx) => {
      if (!shouldMergeRow(idx, row)) return '';
      const groups = getMergeGroups(idx, row);
      return groups.map((g) => g.join('|')).join(';');
    })
    .join(',');
}
