import { MaybeRef, toValue } from 'vue';
import { createCacheManager } from './cache';
import type { SpanMethod, SpanMethodProps, SpanCache, MergeArea, ColumnMergeAreas } from './types';
import { calculateRowMergeFingerprint } from './utils';

/**
 * 检查当前行和上一行在指定列组中的前置列是否在同一合并区域
 * 这确保了多列合并时的依赖关系
 */
function areDependentColumnsInSameMergeArea(
  currentRowIndex: number,
  previousRowIndex: number,
  columnIndex: number,
  columns: string[],
  mergeAreas: ColumnMergeAreas,
): boolean {
  // 检查当前列之前的所有列
  for (let i = 0; i < columnIndex; i++) {
    const column = columns[i];
    const areas = mergeAreas.get(column);

    if (!areas) {
      return false;
    }

    // 查找包含当前行和上一行的合并区域
    const currentArea = areas.find(
      (area) => currentRowIndex >= area.startRow && currentRowIndex < area.startRow + area.rowCount,
    );
    const previousArea = areas.find(
      (area) =>
        previousRowIndex >= area.startRow && previousRowIndex < area.startRow + area.rowCount,
    );

    // 如果两行不在同一个合并区域，则不能合并
    if (currentArea !== previousArea) {
      return false;
    }
  }

  return true;
}

/**
 * 收集所有列的合并区域信息
 */
function collectMergeAreas(
  data: any[],
  getMergeColumns: (rowIndex: number, row: any) => string[],
): ColumnMergeAreas {
  const mergeAreas: ColumnMergeAreas = new Map();

  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];
    const columns = getMergeColumns(rowIndex, row);

    // 为每个需要合并的列初始化合并信息（如果还没有）
    columns.forEach((column) => {
      if (!mergeAreas.has(column)) {
        mergeAreas.set(column, []);
      }
    });

    columns.forEach((column, columnIndex) => {
      const currentValue = row[column];
      const areas = mergeAreas.get(column)!;

      let canMergeWithPrevious = false;

      // 检查是否可以与上一行合并
      if (rowIndex > 0) {
        const previousRow = data[rowIndex - 1];
        const previousColumns = getMergeColumns(rowIndex - 1, previousRow);
        const previousValue = previousRow[column];

        // 基本条件：上一行也要合并此列，且值相同
        const basicCondition = previousColumns.includes(column) && currentValue === previousValue;

        if (basicCondition) {
          // 如果不是第一列，还需要检查前置列的依赖关系
          if (columnIndex > 0) {
            canMergeWithPrevious = areDependentColumnsInSameMergeArea(
              rowIndex,
              rowIndex - 1,
              columnIndex,
              columns,
              mergeAreas,
            );
          } else {
            canMergeWithPrevious = true;
          }
        }
      }

      if (canMergeWithPrevious && areas.length > 0) {
        // 扩展现有合并区域
        areas[areas.length - 1].rowCount++;
      } else {
        // 创建新的合并区域
        areas.push({ startRow: rowIndex, rowCount: 1 });
      }
    });
  }

  return mergeAreas;
}

/**
 * 从合并区域信息生成 SpanCache
 */
function buildSpanCacheFromMergeAreas(mergeAreas: ColumnMergeAreas): SpanCache {
  const cache: SpanCache = {};

  mergeAreas.forEach((areas, column) => {
    areas.forEach((area) => {
      for (let i = 0; i < area.rowCount; i++) {
        const rowIndex = area.startRow + i;
        const key = `${rowIndex}-${column}`;

        if (i === 0) {
          // 合并区域的第一行
          cache[key] = { rowspan: area.rowCount, colspan: 1 };
        } else {
          // 合并区域的其他行（隐藏）
          cache[key] = { rowspan: 0, colspan: 0 };
        }
      }
    });
  });

  return cache;
}

/**
 * 计算行合并的 span 信息
 * @param data - 表格数据
 * @param getMergeColumns - 获取每行需要合并的列
 * @returns SpanCache - 每个单元格的合并信息
 */
function calculateRowSpans(
  data: any[],
  getMergeColumns: (rowIndex: number, row: any) => string[],
): SpanCache {
  const mergeAreas = collectMergeAreas(data, getMergeColumns);
  return buildSpanCacheFromMergeAreas(mergeAreas);
}

/**
 * 创建行合并的 spanMethod 函数
 *
 * @param mergeColumns - 需要合并的列数组或返回列数组的函数
 * @param data - 表格数据（支持响应式）
 * @param enableCache - 是否启用缓存
 * @param cacheKey - 可选的缓存键
 * @returns spanMethod 函数
 */
export function createRowSpanMethod(
  mergeColumns: string[] | ((rowIndex: number, row: any) => string[]),
  data: MaybeRef<any[]>,
  enableCache: boolean,
  cacheKey?: MaybeRef<string | number>,
): SpanMethod {
  function getMergeColumns(rowIndex: number, row: any): string[] {
    if (typeof mergeColumns === 'function') {
      return mergeColumns(rowIndex, row);
    }
    return mergeColumns;
  }

  const cacheManager = createCacheManager<SpanCache>(enableCache, cacheKey, () =>
    calculateRowMergeFingerprint(toValue(data), getMergeColumns),
  );

  return function spanMethod({ row, column, rowIndex }: SpanMethodProps) {
    const currentData = toValue(data);

    if (!currentData.length) {
      return { rowspan: 1, colspan: 1 };
    }

    const currentMergeColumns = getMergeColumns(rowIndex, row);

    if (!currentMergeColumns.length) {
      return { rowspan: 1, colspan: 1 };
    }

    const columnProp = column.property;

    // column.property 可能为 undefined（例如操作列）
    if (!columnProp || !currentMergeColumns.includes(columnProp)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 检查缓存是否失效
    if (cacheManager.shouldInvalidate()) {
      cacheManager.invalidate();
    }

    // 计算或使用缓存
    let spanCache = cacheManager.getCache();
    if (!spanCache) {
      spanCache = calculateRowSpans(currentData, getMergeColumns);
      cacheManager.setCache(spanCache);
    }

    const key = `${rowIndex}-${columnProp}`;
    return spanCache[key] || { rowspan: 1, colspan: 1 };
  };
}
