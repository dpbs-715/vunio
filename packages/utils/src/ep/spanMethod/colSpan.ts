import { MaybeRef, toValue } from 'vue';
import { createCacheManager } from './cache';
import type { SpanMethod, SpanMethodProps, ColSpanCache, MergeGroup } from './types';
import { calculateColMergeFingerprint } from './utils';

/**
 * 计算列合并的 span 信息
 * @param data - 表格数据
 * @param shouldMergeRow - 判断行是否需要合并
 * @param getMergeGroups - 获取行的合并组配置
 * @returns ColSpanCache - 每个单元格的合并信息
 */
function calculateColSpans(
  data: any[],
  shouldMergeRow: (rowIndex: number, row: any) => boolean,
  getMergeGroups: (rowIndex: number, row: any) => MergeGroup[],
): ColSpanCache {
  const spans: ColSpanCache = {};

  data.forEach((row, rowIndex) => {
    // 检查该行是否需要合并
    if (!shouldMergeRow(rowIndex, row)) {
      return;
    }

    // 获取该行的合并组配置
    const groups = getMergeGroups(rowIndex, row);

    // 初始化该行的缓存
    spans[rowIndex] = {};

    groups.forEach((columns) => {
      // 至少需要2列才合并
      if (columns.length < 2) {
        return;
      }

      // 第一列：设置 colspan
      const firstCol = columns[0];
      spans[rowIndex][firstCol] = {
        rowspan: 1,
        colspan: columns.length,
      };

      // 其他列：设置为 0（隐藏）
      for (let i = 1; i < columns.length; i++) {
        spans[rowIndex][columns[i]] = {
          rowspan: 0,
          colspan: 0,
        };
      }
    });
  });

  return spans;
}

/**
 * 创建列合并的 spanMethod 函数
 *
 * @param rows - 需要合并的行（布尔值、行索引数组或判断函数）
 * @param mergeGroups - 合并组配置（列数组的数组或返回配置的函数）
 * @param data - 表格数据（支持响应式）
 * @param enableCache - 是否启用缓存
 * @param cacheKey - 可选的缓存键
 * @returns spanMethod 函数
 */
export function createColSpanMethod(
  rows: boolean | number[] | ((rowIndex: number, row: any) => boolean),
  mergeGroups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]),
  data: MaybeRef<any[]>,
  enableCache: boolean,
  cacheKey?: MaybeRef<string | number>,
): SpanMethod {
  function shouldMergeRow(rowIndex: number, row: any): boolean {
    if (typeof rows === 'boolean') {
      return rows;
    } else if (Array.isArray(rows)) {
      return rows.includes(rowIndex);
    }
    return rows(rowIndex, row);
  }

  function getMergeGroups(rowIndex: number, row: any): MergeGroup[] {
    if (typeof mergeGroups === 'function') {
      return mergeGroups(rowIndex, row);
    }
    return mergeGroups;
  }

  const cacheManager = createCacheManager<ColSpanCache>(enableCache, cacheKey, () => {
    const currentData = toValue(data);
    return calculateColMergeFingerprint(
      currentData.length > 0 ? currentData : [],
      shouldMergeRow,
      getMergeGroups,
    );
  });

  return function spanMethod({ row, column, rowIndex }: SpanMethodProps) {
    const columnProp = column.property;
    const currentData = toValue(data);

    // column.property 可能为 undefined（例如操作列）
    if (!columnProp) {
      return { rowspan: 1, colspan: 1 };
    }

    // 提前检查：如果该行不需要合并，直接返回（避免不必要的缓存计算）
    if (currentData.length > 0 && !shouldMergeRow(rowIndex, row)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 检查缓存是否失效
    if (cacheManager.shouldInvalidate()) {
      cacheManager.invalidate();
    }

    // 计算或使用缓存
    let colSpanCache = cacheManager.getCache();
    if (!colSpanCache) {
      colSpanCache = calculateColSpans(
        currentData.length > 0 ? currentData : [row],
        shouldMergeRow,
        getMergeGroups,
      );
      cacheManager.setCache(colSpanCache);
    }

    // 查找该单元格的合并信息
    const rowSpans = colSpanCache[rowIndex];
    if (rowSpans && rowSpans[columnProp]) {
      const spanInfo = rowSpans[columnProp];
      return {
        rowspan: spanInfo.rowspan,
        colspan: spanInfo.colspan,
      };
    }

    return { rowspan: 1, colspan: 1 };
  };
}
