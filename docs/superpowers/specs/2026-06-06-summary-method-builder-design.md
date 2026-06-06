# summaryMethodBuilder 设计文档

日期：2026-06-06
包：`@vunio/utils`
状态：已确认，待实现

## 背景

仓库已有 `spanMethodBuilder`（`packages/utils/src/ep/spanMethod/`），用于生成 el-table 的 `span-method`。本次新增对称的 `summaryMethodBuilder`，用链式调用生成 el-table 的 `summary-method`，简化合计行的配置。

参考实现：`inspur-scm-static/src/utils/summaryMethodBuilder`（链式 builder，产出 `(props: { columns, data }) => string[]`）。本设计在其基础上做泛型化优化，并与 vunio 的 `CommonTable` 列配置集成。

`CommonTable` 已暴露 `showSummary` / `summaryMethod` / `spanMethod` 三个透传 prop，因此 builder 产物可直接绑定到 `:summary-method`，用法与 `spanMethodBuilder()` 完全对称。

## 定位与放置

- 新增目录 `packages/utils/src/ep/summaryMethod/`，与 `spanMethod/` 同级。
- 通过 `packages/utils/src/ep/index.ts` 追加 `export * from './summaryMethod/index';` 再导出。
- 产物：传给 `CommonTable` 现有 `:summary-method` 的函数 `(props: { columns, data }) => string[]`。

## 文件结构

```
packages/utils/src/ep/summaryMethod/
├── index.ts        # summaryMethodBuilder<Row>() 工厂 + impl 类 + 再导出类型
├── types.ts        # 类型定义
packages/utils/src/ep/__tests__/summaryMethod.spec.ts
```

`ep/index.ts` 增加：

```ts
export * from './summaryMethod/index';
```

## 类型定义（types.ts）

```ts
/** el-table summary-method 的入参 */
export interface SummaryMethodProps {
  columns: any[]; // el-table 渲染列（含 property 字段）
  data: any[]; // 表格数据源
}

/** summary-method 返回每列合计文本 */
export type SummaryMethod = (props: SummaryMethodProps) => string[];

/** 聚合函数：基于某列有效数值与原始行计算数值，结果统一格式化 */
export type Aggregator<Row = any> = (values: number[], rows: Row[]) => number;

/** 自定义合计：完全接管某列输出。number 走格式化，string 原样展示 */
export type SummaryResolver<Row = any> = (
  values: number[],
  rows: Row[],
  props: SummaryMethodProps,
) => string | number;

/** 数值结果格式化 */
export type SummaryFormatter = (value: number, field: string) => string;

/** 列配置来源：静态数组 / ref / computed / getter */
export type SummaryColumnLike = { field?: unknown; summable?: boolean } & Record<string, any>;
```

## API（泛型化的参考全集）

```ts
summaryMethodBuilder<Row = any>()
  .label(text: string, columnIndex = 0)               // 合计行标签及所在列
  .sum(fields)                                        // keyof Row | (keyof Row)[]（兼容 string）
  .avg(fields)
  .count(fields)                                      // 非空单元格计数
  .aggregate(fields, aggregator: Aggregator<Row>)
  .custom(field, resolver: SummaryResolver<Row>)
  .summableFrom(columns)                              // MaybeRef<config[]> | (() => config[])
  .precision(digits = 2)
  .formatter(fn: SummaryFormatter)                    // 优先级高于 precision
  .emptyText(text = '')
  .build(): SummaryMethod
```

### 唯一优化（A：泛型行类型）

`summaryMethodBuilder<Row>()` 让 `fields` 走 `keyof Row` 自动补全，`aggregate`/`custom` 的 `rows` 有类型。`fields` 同时接受 `string` 兜底，保留对动态字段的宽容。

### 行为约定（与参考一致）

- 显式规则（sum/avg/count/aggregate/custom）优先于 `summableFrom` 推导出的求和。
- 数值结果统一经 `formatter`（若设置）或 `precision`（默认 2 位）格式化。
- 自定义 `resolver` 返回 number 时也走格式化，返回 string 时原样输出。
- 聚合列无有效数值时返回 `emptyText`。
- `avg` 在无有效数值时返回 `emptyText`（避免除零）。

## Table 集成

`CommonTableConfig`（`packages/ui/src/components/Table/src/Table.types.ts`）新增可选字段：

```ts
summable?: Boolean; // 标记该列参与合计自动求和
```

`summableFrom(config)` 读取 `column.field` + `column.summable` 收集需求和的列；`build()` 内通过 el-table 列的 `.property` 与 `field` 对齐匹配。无 `property` 的列（选择/序号/操作列）回退到 label 或 emptyText。tab 切换场景传 getter `() => config` 可实时取最新列。

## 数据流

`build()` 返回的函数：

1. 从 `props.data` 取行（非数组兜底为 `[]`）、`props.columns` 取列。
2. 通过 `summableFrom` 源解析出 `summable: true` 的字段集合。
3. 对每列：
   - 有 `property` 且命中显式规则或 summable 求和 → 计算并格式化；
   - 否则若是 `labelIndex` 列 → 输出 `label`；
   - 否则输出 `emptyText`。

builder 不持有外部 data（与 spanMethod 的 `withData` 不同——summary-method 自带 data）。

## 测试（vitest，与 spanMethod.spec 同级）

`packages/utils/src/ep/__tests__/summaryMethod.spec.ts` 覆盖：

- `sum` / `avg` / `count` 基础聚合
- `aggregate` / `custom`（number 与 string 返回）
- `summableFrom`：静态数组、ref、getter，且仅收集 `summable: true`
- 显式规则优先于 summableFrom
- `precision` 与 `formatter`（formatter 覆盖 precision）
- `emptyText` 占位
- 空数据 / 非有限值过滤（`Number.isFinite`）
- `label` 落位（默认列与自定义 columnIndex）

## 文档（中英）

- `apps/docs/zh/packages/utils/ep/summaryMethod/index.md`
- `apps/docs/en/packages/utils/ep/summaryMethod/index.md`
- 按需更新 `apps/docs/.vitepress/config/zh.ts` 与 `en.ts` 的 ep 分类侧边栏。
- 结构参考现有 ep 文档，含用法示例、API、TS 类型、与 `CommonTable` 结合示例。

## 明确不做（YAGNI）

- `zeroAsDefault`（空数据求和显示 0）
- 内置 `thousands` / `percent` 便捷格式化
- per-column `summaryPrecision` / `summaryFormatter` 覆盖
- `fromConfig` 改名（保留 `summableFrom`）
- 多 builder compose
- changeset（本次不创建）
