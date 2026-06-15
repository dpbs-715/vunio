import { unref, type MaybeRef } from 'vue';
import type { RowMergeSource } from '../spanMethod/index';
import type {
  Aggregator,
  SummaryColumnLike,
  SummaryFormatter,
  SummaryMethod,
  SummaryMethodProps,
  SummaryResolver,
} from './types';

export type {
  Aggregator,
  SummaryColumnLike,
  SummaryFormatter,
  SummaryMethod,
  SummaryMethodProps,
  SummaryResolver,
} from './types';

/** 列配置来源：静态数组、ref/computed，或 getter 函数（tab 切换场景实时取值） */
type ColumnsSource = MaybeRef<SummaryColumnLike[]> | (() => SummaryColumnLike[]);

/** 字段入参：支持 keyof Row 自动补全，同时兼容动态 string 字段 */
type FieldInput<Row> = keyof Row | string | Array<keyof Row | string>;

type FieldRule<Row> =
  | { kind: 'aggregate'; aggregator: Aggregator<Row> }
  | { kind: 'custom'; resolver: SummaryResolver<Row> };

const DEFAULT_PRECISION = 2;

const toFieldList = (fields: FieldInput<any>): string[] =>
  (Array.isArray(fields) ? fields : [fields]).map((field) => String(field));

const isNonEmpty = (value: unknown) => value !== null && value !== undefined && value !== '';

const toFiniteNumbers = (rows: any[], field: string, emptyAsZero: boolean): number[] =>
  rows.reduce<number[]>((acc, row) => {
    const raw = row?.[field];
    // 空值（null / undefined / ''）默认不参与聚合，避免 Number('') / Number(null) 被强转为 0；
    // 开启 emptyAsZero 后空值计为 0 并计入分母（例如空白代表“无销量=0”的场景）。
    if (!isNonEmpty(raw)) {
      if (emptyAsZero) acc.push(0);
      return acc;
    }
    const value = Number(raw);
    if (Number.isFinite(value)) acc.push(value);
    return acc;
  }, []);

const sumValues = (values: number[]) => values.reduce((total, value) => total + value, 0);

const resolveColumns = (source?: ColumnsSource): SummaryColumnLike[] => {
  if (!source) return [];
  const value = typeof source === 'function' ? source() : unref(source);
  return Array.isArray(value) ? value : [];
};

export interface summaryMethodBuilder<Row = any> {
  /** 设置合计行标签及其所在列（默认第一列） */
  label(text: string, columnIndex?: number): this;
  /** 对指定列求和 */
  sum(fields: FieldInput<Row>): this;
  /** 对指定列求平均值 */
  avg(fields: FieldInput<Row>): this;
  /** 统计指定列的非空单元格数量 */
  count(fields: FieldInput<Row>): this;
  /** 对指定列使用自定义聚合函数（返回数值，统一格式化） */
  aggregate(fields: FieldInput<Row>, aggregator: Aggregator<Row>): this;
  /** 完全自定义某列的合计输出 */
  custom(field: keyof Row | string, resolver: SummaryResolver<Row>): this;
  /** 从列配置中自动收集 summable: true 的列并求和（支持 ref / getter，按 tab 切换实时生效） */
  summableFrom(columns: ColumnsSource): this;
  /**
   * 复用展示侧行合并，使被合并列按合并区域去重——每个合并单元格只计一次，避免重复值被累加。
   * 来源由 spanMethodBuilder.rowMergeSource() 提供，合并列只需在 mergeRows(...) 声明一次。
   */
  mergedFrom(source: RowMergeSource): this;
  /** 数值结果的小数位数（默认 2） */
  precision(digits: number): this;
  /** 自定义数值格式化（优先级高于 precision） */
  formatter(formatter: SummaryFormatter): this;
  /** 无合计列的占位文本（默认空字符串） */
  emptyText(text: string): this;
  /** 将空值（null / undefined / ''）计为 0 并计入聚合（影响 avg 的分母）；默认排除空值 */
  emptyAsZero(enabled?: boolean): this;
  build(): SummaryMethod;
}

class summaryMethodBuilderImpl<Row = any> implements summaryMethodBuilder<Row> {
  private rules = new Map<string, FieldRule<Row>>();
  private summableColumns?: ColumnsSource;
  private mergeSource?: RowMergeSource;
  private labelText = '';
  private labelIndex = 0;
  private precisionDigits = DEFAULT_PRECISION;
  private formatterFn?: SummaryFormatter;
  private emptyTextValue = '';
  private emptyAsZeroFlag = false;

  label(text: string, columnIndex = 0): this {
    this.labelText = text;
    this.labelIndex = columnIndex;
    return this;
  }

  sum(fields: FieldInput<Row>): this {
    return this.aggregate(fields, sumValues);
  }

  avg(fields: FieldInput<Row>): this {
    return this.aggregate(fields, (values) => sumValues(values) / values.length);
  }

  count(fields: FieldInput<Row>): this {
    toFieldList(fields).forEach((field) => {
      this.rules.set(field, {
        kind: 'custom',
        resolver: (_values, rows) =>
          String(rows.filter((row) => isNonEmpty((row as any)?.[field])).length),
      });
    });
    return this;
  }

  aggregate(fields: FieldInput<Row>, aggregator: Aggregator<Row>): this {
    toFieldList(fields).forEach((field) => {
      this.rules.set(field, { kind: 'aggregate', aggregator });
    });
    return this;
  }

  custom(field: keyof Row | string, resolver: SummaryResolver<Row>): this {
    this.rules.set(String(field), { kind: 'custom', resolver });
    return this;
  }

  summableFrom(columns: ColumnsSource): this {
    this.summableColumns = columns;
    return this;
  }

  mergedFrom(source: RowMergeSource): this {
    this.mergeSource = source;
    return this;
  }

  precision(digits: number): this {
    this.precisionDigits = digits;
    return this;
  }

  formatter(formatter: SummaryFormatter): this {
    this.formatterFn = formatter;
    return this;
  }

  emptyText(text: string): this {
    this.emptyTextValue = text;
    return this;
  }

  emptyAsZero(enabled = true): this {
    this.emptyAsZeroFlag = enabled;
    return this;
  }

  private formatNumber(value: number, field: string): string {
    return this.formatterFn ? this.formatterFn(value, field) : value.toFixed(this.precisionDigits);
  }

  private collectSummableFields(): Set<string> {
    const fields = new Set<string>();
    // 递归遍历分组列（columnChildren），叶子列才有对应 property，需一并收集
    const walk = (columns: SummaryColumnLike[]) => {
      columns.forEach((column) => {
        const field = unref(column.field as any) as string | undefined;
        if (field && column.summable) fields.add(field);
        const children = column.columnChildren;
        if (Array.isArray(children)) walk(children as SummaryColumnLike[]);
      });
    };
    walk(resolveColumns(this.summableColumns));
    return fields;
  }

  private applyRule(
    rule: FieldRule<Row>,
    field: string,
    rows: Row[],
    props: SummaryMethodProps,
  ): string {
    const values = toFiniteNumbers(rows as any[], field, this.emptyAsZeroFlag);

    if (rule.kind === 'custom') {
      const output = rule.resolver(values, rows, props);
      return typeof output === 'number' ? this.formatNumber(output, field) : output;
    }

    if (!values.length) return this.emptyTextValue;
    return this.formatNumber(rule.aggregator(values, rows), field);
  }

  build(): SummaryMethod {
    const sumRule: FieldRule<Row> = { kind: 'aggregate', aggregator: sumValues };

    return (props: SummaryMethodProps): string[] => {
      const { columns } = props;
      const rows = (Array.isArray(props.data) ? props.data : []) as Row[];
      const summableFields = this.collectSummableFields();
      const mergeAreas = this.mergeSource?.collectAreas(rows as any[]);

      // 被合并列只保留每个合并区域的首行（代表值），跳过 rowspan=0 的续行，避免重复值被累加。
      // 对未声明合并的列、或动态合并中未参与合并的行，行集合保持不变。
      const resolveRows = (field: string): Row[] => {
        const areas = mergeAreas?.get(field);
        if (!areas) return rows;
        const continuationRows = new Set<number>();
        for (const area of areas) {
          for (let offset = 1; offset < area.rowCount; offset++) {
            continuationRows.add(area.startRow + offset);
          }
        }
        return continuationRows.size
          ? rows.filter((_, index) => !continuationRows.has(index))
          : rows;
      };

      return columns.map((column, index) => {
        const field = column?.property as string | undefined;

        if (field) {
          // 显式规则优先于 summableFrom 推导出的求和
          const rule = this.rules.get(field) ?? (summableFields.has(field) ? sumRule : undefined);
          if (rule) return this.applyRule(rule, field, resolveRows(field), props);
        }

        if (index === this.labelIndex) return this.labelText;

        return this.emptyTextValue;
      });
    };
  }
}

export function summaryMethodBuilder<Row = any>(): summaryMethodBuilder<Row> {
  return new summaryMethodBuilderImpl<Row>();
}
