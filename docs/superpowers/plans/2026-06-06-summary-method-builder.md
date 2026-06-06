# summaryMethodBuilder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `summaryMethodBuilder<Row>()` fluent builder to `@vunio/utils` that produces an Element Plus `summary-method` function, mirroring the existing `spanMethodBuilder`.

**Architecture:** A factory function returns a builder impl class. Chained calls register per-field rules (sum/avg/count/aggregate/custom) plus a `summableFrom` column source. `build()` returns `(props: { columns, data }) => string[]` that the `CommonTable` `:summary-method` prop consumes directly. A new optional `summable` field on `CommonTableConfig` is the integration point for `summableFrom`.

**Tech Stack:** TypeScript 5, Vue 3 (`MaybeRef`/`unref`), Rollup (build), Vitest (tests), VitePress (docs). Lives under `packages/utils/src/ep/summaryMethod/`, re-exported via `packages/utils/src/ep/index.ts`.

---

## File Structure

- Create: `packages/utils/src/ep/summaryMethod/types.ts` — type definitions only.
- Create: `packages/utils/src/ep/summaryMethod/index.ts` — builder interface, impl class, factory, type re-exports.
- Modify: `packages/utils/src/ep/index.ts` — add `export * from './summaryMethod/index';`.
- Create: `packages/utils/src/ep/__tests__/summaryMethod.spec.ts` — vitest suite.
- Modify: `packages/ui/src/components/Table/src/Table.types.ts` — add `summable?: Boolean;` to `CommonTableConfig`.
- Modify: `apps/docs/zh/packages/utils/ep/index.md` — append `## summaryMethodBuilder` section.
- Modify: `apps/docs/en/packages/utils/ep/index.md` — append `## summaryMethodBuilder` section.

Branch: work continues on `feat/summary-method-builder` (already created; spec already committed there).

---

### Task 1: Types + export wiring

**Files:**
- Create: `packages/utils/src/ep/summaryMethod/types.ts`
- Modify: `packages/utils/src/ep/index.ts`

- [ ] **Step 1: Create the types file**

Create `packages/utils/src/ep/summaryMethod/types.ts`:

```ts
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
```

- [ ] **Step 2: Wire the re-export**

Modify `packages/utils/src/ep/index.ts` — it currently contains only `export * from './spanMethod/index';`. Add a second line so the file reads:

```ts
export * from './spanMethod/index';
export * from './summaryMethod/index';
```

Note: `./summaryMethod/index` does not exist yet, so do NOT build/typecheck at this step. The next task creates it.

- [ ] **Step 3: Commit**

```bash
git add packages/utils/src/ep/summaryMethod/types.ts packages/utils/src/ep/index.ts
git commit -m "feat(utils): add summaryMethod types and ep export wiring

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Builder implementation (TDD)

**Files:**
- Test: `packages/utils/src/ep/__tests__/summaryMethod.spec.ts`
- Create: `packages/utils/src/ep/summaryMethod/index.ts`

- [ ] **Step 1: Write the failing test suite**

Create `packages/utils/src/ep/__tests__/summaryMethod.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { summaryMethodBuilder, SummaryMethodProps } from '../summaryMethod';

describe('summaryMethodBuilder', () => {
  // 辅助函数：构造 summary-method 入参。columns 用 property 对齐字段。
  const createProps = (properties: (string | undefined)[], data: any[]): SummaryMethodProps => ({
    columns: properties.map((property) => ({ property })),
    data,
  });

  const rows = [
    { name: 'A', qty: 10, price: 2, rate: 1.5 },
    { name: 'B', qty: 20, price: 4, rate: 2.5 },
    { name: 'C', qty: 30, price: 6, rate: 3.5 },
  ];

  describe('基础聚合', () => {
    it('sum：对指定列求和并按默认精度格式化', () => {
      const method = summaryMethodBuilder().label('合计').sum(['qty', 'price']).build();
      const result = method(createProps([undefined, 'qty', 'price'], rows));
      expect(result).toEqual(['合计', '60.00', '12.00']);
    });

    it('avg：对指定列求平均值', () => {
      const method = summaryMethodBuilder().avg('rate').build();
      const result = method(createProps(['rate'], rows));
      expect(result).toEqual(['2.50']);
    });

    it('count：统计非空单元格数量', () => {
      const data = [{ name: 'A' }, { name: '' }, { name: 'C' }, { name: null }];
      const method = summaryMethodBuilder().count('name').build();
      const result = method(createProps(['name'], data));
      expect(result).toEqual(['2']);
    });
  });

  describe('自定义聚合', () => {
    it('aggregate：使用自定义聚合函数返回数值并格式化', () => {
      const method = summaryMethodBuilder()
        .aggregate('qty', (values) => Math.max(...values))
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['30.00']);
    });

    it('custom：返回 string 时原样输出', () => {
      const method = summaryMethodBuilder()
        .custom('qty', (_values, dataRows) => `${dataRows.length} 行`)
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['3 行']);
    });

    it('custom：返回 number 时走数值格式化', () => {
      const method = summaryMethodBuilder()
        .custom('qty', () => 5)
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['5.00']);
    });
  });

  describe('summableFrom 列配置驱动', () => {
    const columns = [
      { field: 'name', label: '名称' },
      { field: 'qty', label: '数量', summable: true },
      { field: 'price', label: '单价', summable: true },
      { field: 'rate', label: '比率', summable: false },
    ];

    it('静态数组：仅收集 summable:true 的列求和', () => {
      const method = summaryMethodBuilder().label('合计').summableFrom(columns).build();
      const result = method(createProps([undefined, 'qty', 'price', 'rate'], rows));
      expect(result).toEqual(['合计', '60.00', '12.00', '']);
    });

    it('ref 源：从 ref 读取列配置', () => {
      const columnsRef = ref(columns);
      const method = summaryMethodBuilder().summableFrom(columnsRef).build();
      const result = method(createProps(['qty', 'price'], rows));
      expect(result).toEqual(['60.00', '12.00']);
    });

    it('getter 源：从 getter 实时读取列配置', () => {
      const method = summaryMethodBuilder().summableFrom(() => columns).build();
      const result = method(createProps(['qty', 'price'], rows));
      expect(result).toEqual(['60.00', '12.00']);
    });

    it('显式规则优先于 summableFrom 推导的求和', () => {
      const method = summaryMethodBuilder()
        .summableFrom(columns)
        .avg('qty') // qty 显式改为平均值，覆盖 summable 求和
        .build();
      const result = method(createProps(['qty', 'price'], rows));
      expect(result).toEqual(['20.00', '12.00']);
    });
  });

  describe('格式化', () => {
    it('precision：自定义小数位数', () => {
      const method = summaryMethodBuilder().sum('qty').precision(0).build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['60']);
    });

    it('formatter：优先级高于 precision', () => {
      const method = summaryMethodBuilder()
        .sum('qty')
        .precision(2)
        .formatter((value) => `¥${value}`)
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['¥60']);
    });
  });

  describe('占位与边界', () => {
    it('emptyText：无规则且非 label 列输出占位文本', () => {
      const method = summaryMethodBuilder().label('合计').sum('qty').emptyText('-').build();
      const result = method(createProps([undefined, 'qty', 'name'], rows));
      expect(result).toEqual(['合计', '60.00', '-']);
    });

    it('空数据：聚合列返回 emptyText', () => {
      const method = summaryMethodBuilder().label('合计').sum('qty').emptyText('-').build();
      const result = method(createProps([undefined, 'qty'], []));
      expect(result).toEqual(['合计', '-']);
    });

    it('非有限值被过滤，不参与求和', () => {
      const data = [{ qty: 10 }, { qty: 'abc' }, { qty: null }, { qty: 5 }];
      const method = summaryMethodBuilder().sum('qty').build();
      const result = method(createProps(['qty'], data));
      expect(result).toEqual(['15.00']);
    });

    it('label：默认落在第 0 列', () => {
      const method = summaryMethodBuilder().label('合计').build();
      const result = method(createProps([undefined, undefined], rows));
      expect(result).toEqual(['合计', '']);
    });

    it('label：可指定 columnIndex', () => {
      const method = summaryMethodBuilder().label('合计', 1).build();
      const result = method(createProps([undefined, undefined], rows));
      expect(result).toEqual(['', '合计']);
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/utils && pnpm test summaryMethod`
Expected: FAIL — cannot resolve `../summaryMethod` export `summaryMethodBuilder` (module `summaryMethod/index.ts` does not exist yet).

- [ ] **Step 3: Write the builder implementation**

Create `packages/utils/src/ep/summaryMethod/index.ts`:

```ts
import { unref, type MaybeRef } from 'vue';
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

const toFiniteNumbers = (rows: any[], field: string): number[] =>
  rows.reduce<number[]>((acc, row) => {
    const value = Number(row?.[field]);
    if (Number.isFinite(value)) acc.push(value);
    return acc;
  }, []);

const isNonEmpty = (value: unknown) => value !== null && value !== undefined && value !== '';

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
  /** 数值结果的小数位数（默认 2） */
  precision(digits: number): this;
  /** 自定义数值格式化（优先级高于 precision） */
  formatter(formatter: SummaryFormatter): this;
  /** 无合计列的占位文本（默认空字符串） */
  emptyText(text: string): this;
  build(): SummaryMethod;
}

class summaryMethodBuilderImpl<Row = any> implements summaryMethodBuilder<Row> {
  private rules = new Map<string, FieldRule<Row>>();
  private summableColumns?: ColumnsSource;
  private labelText = '';
  private labelIndex = 0;
  private precisionDigits = DEFAULT_PRECISION;
  private formatterFn?: SummaryFormatter;
  private emptyTextValue = '';

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

  private formatNumber(value: number, field: string): string {
    return this.formatterFn
      ? this.formatterFn(value, field)
      : value.toFixed(this.precisionDigits);
  }

  private collectSummableFields(): Set<string> {
    const fields = new Set<string>();
    resolveColumns(this.summableColumns).forEach((column) => {
      const field = unref(column.field as any) as string | undefined;
      if (field && column.summable) fields.add(field);
    });
    return fields;
  }

  private applyRule(
    rule: FieldRule<Row>,
    field: string,
    rows: Row[],
    props: SummaryMethodProps,
  ): string {
    const values = toFiniteNumbers(rows as any[], field);

    if (rule.kind === 'custom') {
      const output = rule.resolver(values, rows, props);
      return typeof output === 'number' ? this.formatNumber(output, field) : output;
    }

    if (!values.length) return this.emptyTextValue;
    return this.formatNumber(rule.aggregator(values, rows), field);
  }

  build(): SummaryMethod {
    return (props: SummaryMethodProps): string[] => {
      const { columns } = props;
      const rows = (Array.isArray(props.data) ? props.data : []) as Row[];
      const summableFields = this.collectSummableFields();
      const sumRule: FieldRule<Row> = { kind: 'aggregate', aggregator: sumValues };

      return columns.map((column, index) => {
        const field = column?.property as string | undefined;

        if (field) {
          // 显式规则优先于 summableFrom 推导出的求和
          const rule = this.rules.get(field) ?? (summableFields.has(field) ? sumRule : undefined);
          if (rule) return this.applyRule(rule, field, rows, props);
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/utils && pnpm test summaryMethod`
Expected: PASS — all test cases green.

- [ ] **Step 5: Verify the package builds**

Run: `cd packages/utils && pnpm build`
Expected: Rollup build completes with no errors (confirms the new `ep/index.ts` export resolves).

- [ ] **Step 6: Commit**

```bash
git add packages/utils/src/ep/summaryMethod/index.ts packages/utils/src/ep/__tests__/summaryMethod.spec.ts
git commit -m "feat(utils): add summaryMethodBuilder

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: CommonTable `summable` column field

**Files:**
- Modify: `packages/ui/src/components/Table/src/Table.types.ts`

- [ ] **Step 1: Add the `summable` field to `CommonTableConfig`**

In `packages/ui/src/components/Table/src/Table.types.ts`, find the line `formatter?: Function;` (around line 17, inside the `CommonTableConfig` type) and add a `summable` field immediately after it:

```ts
  formatter?: Function;
  // 标记该列参与合计行自动求和（配合 @vunio/utils 的 summaryMethodBuilder().summableFrom）
  summable?: Boolean;
```

- [ ] **Step 2: Verify the UI package types build**

Run: `cd packages/ui && pnpm build`
Expected: Vite build completes with no type errors (the field is optional and additive).

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/Table/src/Table.types.ts
git commit -m "feat(ui): add summable field to CommonTableConfig

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Chinese documentation

**Files:**
- Modify: `apps/docs/zh/packages/utils/ep/index.md`

- [ ] **Step 1: Append the summaryMethodBuilder section**

Append the following to the END of `apps/docs/zh/packages/utils/ep/index.md` (the file currently ends with the `## spanMethodBuilder` content; add a new top-level section after it):

````markdown
## summaryMethodBuilder

> 为 ElementPlus Table 组件创建合计行函数，支持求和、平均、计数、自定义聚合，并可结合列配置的 `summable` 标记自动求和，提供流畅的链式 API。

### 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { summaryMethodBuilder } from '@vunio/utils/ep';

const tableData = ref([
  { name: '商品A', qty: 10, price: 2 },
  { name: '商品B', qty: 20, price: 4 },
]);

// 第一列展示“合计”，对数量、单价求和
const summaryMethod = summaryMethodBuilder().label('合计').sum(['qty', 'price']).build();
</script>

<template>
  <el-table :data="tableData" :summary-method="summaryMethod" show-summary border>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="qty" label="数量" />
    <el-table-column prop="price" label="单价" />
  </el-table>
</template>
```

### 泛型类型提示

传入行类型后，字段名会自动补全，聚合/自定义函数中的 `rows` 也有类型：

```ts
interface Row {
  name: string;
  qty: number;
  price: number;
}

const summaryMethod = summaryMethodBuilder<Row>()
  .label('合计')
  .sum(['qty', 'price']) // 'qty' / 'price' 自动补全
  .build();
```

### 聚合方式

```ts
const summaryMethod = summaryMethodBuilder()
  .label('统计', 0)
  .sum(['qty', 'price']) // 求和
  .avg('rate') // 求平均值
  .count('name') // 统计非空单元格数量
  .aggregate('qty', (values) => Math.max(...values)) // 自定义聚合（返回数值，统一格式化）
  .custom('ratio', (values, rows) => {
    // 完全自定义输出；返回 string 原样展示，返回 number 走数值格式化
    const total = rows.reduce((sum, row) => sum + Number(row.qty || 0), 0);
    const current = values.reduce((sum, value) => sum + value, 0);
    return total ? `${((current / total) * 100).toFixed(1)}%` : '/';
  })
  .build();
```

### 配合列配置自动求和（summableFrom）

在列配置中用 `summable: true` 标记需要求和的列，`summableFrom` 会自动收集；显式规则优先于自动求和。tab 切换导致列变化时，传 getter `() => columns` 可实时取到最新列。

```ts
const columns = ref([
  { field: 'name', label: '名称' },
  { field: 'qty', label: '数量', summable: true },
  { field: 'price', label: '单价', summable: true },
  { field: 'rate', label: '比率', summable: false },
]);

const summaryMethod = summaryMethodBuilder()
  .label('合计')
  .summableFrom(() => columns.value)
  .precision(2)
  .build();
```

> 在 `CommonTable` 中，`CommonTableConfig` 已内置可选的 `summable` 字段，可直接把列配置传给 `summableFrom`。

### 数值格式化

```ts
// precision：统一小数位数（默认 2）
const a = summaryMethodBuilder().sum('qty').precision(0).build();

// formatter：自定义格式（优先级高于 precision），例如千分位
const b = summaryMethodBuilder()
  .sum('qty')
  .formatter((value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }))
  .build();
```

### 与 CommonTable 结合

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { summaryMethodBuilder } from '@vunio/utils/ep';

const config = ref([
  { field: 'name', label: '名称' },
  { field: 'qty', label: '数量', summable: true },
  { field: 'price', label: '单价', summable: true },
]);
const data = ref([
  { name: '商品A', qty: 10, price: 2 },
  { name: '商品B', qty: 20, price: 4 },
]);

const summaryMethod = summaryMethodBuilder()
  .label('合计')
  .summableFrom(() => config.value)
  .build();
</script>

<template>
  <CommonTable :config="config" :data="data" :summary-method="summaryMethod" show-summary border />
</template>
```

### API 参考

#### summaryMethodBuilder()

创建一个合计行构造器，返回链式调用对象。支持泛型 `summaryMethodBuilder<Row>()`。

#### summaryMethodBuilder 方法

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| `label(text, columnIndex?)` | `string, number` | 合计行标签及所在列，`columnIndex` 默认 `0` |
| `sum(fields)` | `keyof Row \| string \| 数组` | 对指定列求和 |
| `avg(fields)` | `keyof Row \| string \| 数组` | 对指定列求平均值 |
| `count(fields)` | `keyof Row \| string \| 数组` | 统计指定列的非空单元格数量 |
| `aggregate(fields, aggregator)` | `字段, (values, rows) => number` | 自定义聚合，返回数值统一格式化 |
| `custom(field, resolver)` | `字段, (values, rows, props) => string \| number` | 完全自定义某列输出 |
| `summableFrom(columns)` | `MaybeRef<列配置[]> \| (() => 列配置[])` | 自动收集 `summable: true` 的列求和 |
| `precision(digits)` | `number` | 数值结果小数位数，默认 `2` |
| `formatter(fn)` | `(value, field) => string` | 自定义数值格式化，优先级高于 `precision` |
| `emptyText(text)` | `string` | 无合计列的占位文本，默认空字符串 |
| `build()` | — | 生成 el-table 的 `summary-method` 函数 |

### 注意事项

- `build()` 返回的函数从 `summary-method` 的入参自带的 `data` 取数，无需像 `spanMethodBuilder` 那样调用 `withData`。
- 非有限数值（如空字符串、`null`、非数字）会被自动过滤，不参与聚合。
- 聚合列在无有效数值时返回 `emptyText`（默认空字符串）。
- 显式规则（`sum`/`avg`/`count`/`aggregate`/`custom`）优先于 `summableFrom` 推导出的求和。
````

- [ ] **Step 2: Verify docs build**

Run: `cd /Users/dpbs/WebstormProjects/vunio && pnpm build:docs`
Expected: VitePress build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/zh/packages/utils/ep/index.md
git commit -m "docs: add summaryMethodBuilder Chinese docs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: English documentation

**Files:**
- Modify: `apps/docs/en/packages/utils/ep/index.md`

- [ ] **Step 1: Append the summaryMethodBuilder section**

Append the following to the END of `apps/docs/en/packages/utils/ep/index.md` (after the existing `## spanMethodBuilder` content):

````markdown
## summaryMethodBuilder

> Create a summary-row function for the ElementPlus Table component. Supports sum, average, count, and custom aggregation, and can auto-sum columns marked `summable` in your column config — all through a fluent chained API.

### Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { summaryMethodBuilder } from '@vunio/utils/ep';

const tableData = ref([
  { name: 'Item A', qty: 10, price: 2 },
  { name: 'Item B', qty: 20, price: 4 },
]);

// Show "Total" in the first column, sum qty and price
const summaryMethod = summaryMethodBuilder().label('Total').sum(['qty', 'price']).build();
</script>

<template>
  <el-table :data="tableData" :summary-method="summaryMethod" show-summary border>
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="qty" label="Qty" />
    <el-table-column prop="price" label="Price" />
  </el-table>
</template>
```

### Generic Type Hints

Pass a row type to get field-name completion; `rows` inside aggregate/custom functions is typed too:

```ts
interface Row {
  name: string;
  qty: number;
  price: number;
}

const summaryMethod = summaryMethodBuilder<Row>()
  .label('Total')
  .sum(['qty', 'price']) // 'qty' / 'price' autocompleted
  .build();
```

### Aggregation Methods

```ts
const summaryMethod = summaryMethodBuilder()
  .label('Stats', 0)
  .sum(['qty', 'price']) // sum
  .avg('rate') // average
  .count('name') // count non-empty cells
  .aggregate('qty', (values) => Math.max(...values)) // custom aggregation (returns a number, formatted)
  .custom('ratio', (values, rows) => {
    // Fully custom output; string is shown as-is, number goes through numeric formatting
    const total = rows.reduce((sum, row) => sum + Number(row.qty || 0), 0);
    const current = values.reduce((sum, value) => sum + value, 0);
    return total ? `${((current / total) * 100).toFixed(1)}%` : '/';
  })
  .build();
```

### Auto-Sum From Column Config (summableFrom)

Mark columns with `summable: true` in your config and `summableFrom` collects them automatically; explicit rules take precedence over auto-sum. When columns change (e.g. tab switches), pass a getter `() => columns` to always read the latest columns.

```ts
const columns = ref([
  { field: 'name', label: 'Name' },
  { field: 'qty', label: 'Qty', summable: true },
  { field: 'price', label: 'Price', summable: true },
  { field: 'rate', label: 'Rate', summable: false },
]);

const summaryMethod = summaryMethodBuilder()
  .label('Total')
  .summableFrom(() => columns.value)
  .precision(2)
  .build();
```

> In `CommonTable`, `CommonTableConfig` already includes an optional `summable` field, so you can pass the column config straight to `summableFrom`.

### Number Formatting

```ts
// precision: number of decimal places (default 2)
const a = summaryMethodBuilder().sum('qty').precision(0).build();

// formatter: custom format (higher priority than precision), e.g. thousands separators
const b = summaryMethodBuilder()
  .sum('qty')
  .formatter((value) => value.toLocaleString('en-US', { minimumFractionDigits: 2 }))
  .build();
```

### Using With CommonTable

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { summaryMethodBuilder } from '@vunio/utils/ep';

const config = ref([
  { field: 'name', label: 'Name' },
  { field: 'qty', label: 'Qty', summable: true },
  { field: 'price', label: 'Price', summable: true },
]);
const data = ref([
  { name: 'Item A', qty: 10, price: 2 },
  { name: 'Item B', qty: 20, price: 4 },
]);

const summaryMethod = summaryMethodBuilder()
  .label('Total')
  .summableFrom(() => config.value)
  .build();
</script>

<template>
  <CommonTable :config="config" :data="data" :summary-method="summaryMethod" show-summary border />
</template>
```

### API Reference

#### summaryMethodBuilder()

Creates a summary-row builder returning a chainable object. Supports the generic form `summaryMethodBuilder<Row>()`.

#### summaryMethodBuilder methods

| Method | Params | Description |
| --- | --- | --- |
| `label(text, columnIndex?)` | `string, number` | Summary-row label and its column; `columnIndex` defaults to `0` |
| `sum(fields)` | `keyof Row \| string \| array` | Sum the given columns |
| `avg(fields)` | `keyof Row \| string \| array` | Average the given columns |
| `count(fields)` | `keyof Row \| string \| array` | Count non-empty cells in the given columns |
| `aggregate(fields, aggregator)` | `fields, (values, rows) => number` | Custom aggregation; the number result is formatted |
| `custom(field, resolver)` | `field, (values, rows, props) => string \| number` | Fully customize a column's output |
| `summableFrom(columns)` | `MaybeRef<config[]> \| (() => config[])` | Auto-collect columns marked `summable: true` and sum them |
| `precision(digits)` | `number` | Decimal places for numeric results, default `2` |
| `formatter(fn)` | `(value, field) => string` | Custom numeric formatting, higher priority than `precision` |
| `emptyText(text)` | `string` | Placeholder for columns without a summary, default empty string |
| `build()` | — | Produce the el-table `summary-method` function |

### Notes

- The function returned by `build()` reads rows from the `data` provided in the `summary-method` argument — no need to call `withData` like `spanMethodBuilder`.
- Non-finite values (empty strings, `null`, non-numeric) are filtered out and excluded from aggregation.
- Aggregation columns return `emptyText` (default empty string) when there are no valid numeric values.
- Explicit rules (`sum`/`avg`/`count`/`aggregate`/`custom`) take precedence over sums inferred by `summableFrom`.
````

- [ ] **Step 2: Verify docs build**

Run: `cd /Users/dpbs/WebstormProjects/vunio && pnpm build:docs`
Expected: VitePress build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/en/packages/utils/ep/index.md
git commit -m "docs: add summaryMethodBuilder English docs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** placement (Task 1), types (Task 1), full API incl. generics (Task 2), all behavior rules incl. explicit-over-summable precedence and non-finite filtering (Task 2 tests), `summable` on `CommonTableConfig` (Task 3), zh/en docs (Tasks 4-5). Docs are appended to the existing single ep page rather than a new subfolder + sidebar entry — this matches the actual repo structure (corrects the spec's assumption); no sidebar change needed.
- **YAGNI honored:** no zeroAsDefault, thousands/percent, per-column overrides, fromConfig rename, compose, or changeset.
- **Type consistency:** `FieldInput<Row>`, `Aggregator<Row>`, `SummaryResolver<Row>`, `SummaryColumnLike`, `SummaryMethod`, `SummaryMethodProps` are used identically across types.ts, index.ts, and the spec.
- **Out of scope:** changeset deliberately omitted (user did not select it). If publishing is desired later, run `pnpm changeset` for a `@vunio/utils` minor + `@vunio/ui` minor.
