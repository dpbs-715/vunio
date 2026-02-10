import type { MergeGroup, SpanMethod, SpanMethodProps } from './types';

/**
 * 组合多个 spanMethod 函数
 * 按顺序执行，返回第一个非默认值（rowspan !== 1 或 colspan !== 1）
 *
 * @param methods - 要组合的 spanMethod 函数数组
 * @returns 组合后的 spanMethod 函数
 */
export function composeSpanMethods(...methods: SpanMethod[]): SpanMethod {
  return (props: SpanMethodProps) => {
    for (const method of methods) {
      const result = method(props);

      if (result.rowspan !== 1 || result.colspan !== 1) {
        return result;
      }
    }

    return { rowspan: 1, colspan: 1 };
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
