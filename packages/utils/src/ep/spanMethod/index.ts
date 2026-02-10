import { MaybeRef } from 'vue';
import { composeSpanMethods } from './utils';
import { createColSpanMethod } from './colSpan';
import { createRowSpanMethod } from './rowSpan';
import type { MergeGroup, SpanMethod } from './types';

// 重新导出类型和函数供外部使用
export type { SpanMethod, SpanMethodProps, MergeGroup } from './types';
export { createRowSpanMethod } from './rowSpan';
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
