import { MaybeRef } from 'vue';
import { composeSpanMethods } from './utils';
import { createColSpanMethod } from './colSpan';
import { collectMergeAreas, createRowSpanMethod } from './rowSpan';
import type { ColumnMergeAreas, MergeGroup, RowMergeSource, SpanMethod } from './types';

export type {
  SpanMethod,
  SpanMethodProps,
  MergeGroup,
  MergeArea,
  ColumnMergeAreas,
  RowMergeSource,
} from './types';
export { createRowSpanMethod, collectMergeAreas } from './rowSpan';
export { createColSpanMethod } from './colSpan';
export { composeSpanMethods } from './utils';

export interface spanMethodBuilder {
  withData(data: MaybeRef<any[]>): this;

  mergeRows(columns: string[] | ((rowIndex: number, row: any) => string[])): this;

  mergeCols(config: {
    rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);
    groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);
  }): this;

  noCache(): this;

  withCacheKey(key: MaybeRef<string | number>): this;

  /**
   * 提供给 summaryMethodBuilder 的行合并来源，使合计按合并区域去重（每组只计一次）。
   * 复用 mergeRows(...) 声明，无需在合计侧重复声明合并列。
   */
  rowMergeSource(): RowMergeSource;

  build(): SpanMethod;
}

class spanMethodBuilderImpl implements spanMethodBuilder {
  private data: MaybeRef<any[]> | null = null;
  private rowMergeGroups: Array<string[] | ((rowIndex: number, row: any) => string[])> = [];
  private colMergeRules: Array<{
    rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);
    groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);
  }> = [];
  private enableCache = true;
  private cacheKey?: MaybeRef<string | number>;

  withData(data: MaybeRef<any[]>): this {
    this.data = data;
    return this;
  }

  mergeRows(columns: string[] | ((rowIndex: number, row: any) => string[])): this {
    if (typeof columns === 'function' || columns.length > 0) {
      this.rowMergeGroups.push(columns);
    }
    return this;
  }

  mergeCols(config: {
    rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);
    groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);
  }): this {
    this.colMergeRules.push(config);
    return this;
  }

  noCache(): this {
    this.enableCache = false;
    return this;
  }

  withCacheKey(key: MaybeRef<string | number>): this {
    this.cacheKey = key;
    return this;
  }

  rowMergeSource(): RowMergeSource {
    const groups = this.rowMergeGroups;
    const resolveColumns =
      (group: string[] | ((rowIndex: number, row: any) => string[])) =>
      (rowIndex: number, row: any): string[] =>
        typeof group === 'function' ? group(rowIndex, row) : group;

    return {
      collectAreas(rows: any[]): ColumnMergeAreas {
        // 每个 mergeRows(...) 组各算一遍合并区域，再并入（同一字段通常只属于一组）
        const merged: ColumnMergeAreas = new Map();
        for (const group of groups) {
          const areas = collectMergeAreas(rows, resolveColumns(group));
          areas.forEach((value, field) => merged.set(field, value));
        }
        return merged;
      },
    };
  }

  build(): SpanMethod {
    if (!this.data) {
      throw new Error('[spanMethodBuilder] data is required. Please call withData() first.');
    }

    const methods: SpanMethod[] = [];

    // 为每组行合并创建独立的 spanMethod
    this.rowMergeGroups.forEach((columns) => {
      const method = createRowSpanMethod(columns, this.data!, this.enableCache, this.cacheKey);
      methods.push(method);
    });

    // 为每个列合并规则创建独立的 spanMethod
    this.colMergeRules.forEach((rule) => {
      const method = createColSpanMethod(
        rule.rows,
        rule.groups,
        this.data!,
        this.enableCache,
        this.cacheKey,
      );
      methods.push(method);
    });

    // 如果没有任何合并规则，返回默认函数
    if (methods.length === 0) {
      return () => ({ rowspan: 1, colspan: 1 });
    }

    // 组合所有规则
    return composeSpanMethods(...methods);
  }
}
export function spanMethodBuilder(): spanMethodBuilder {
  return new spanMethodBuilderImpl();
}
