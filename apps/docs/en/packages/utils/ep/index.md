# ElementPlus Utilities

## spanMethodBuilder

> Create an intelligent cell merging function for ElementPlus Table component, supporting row merging, column merging, and mixed usage with a fluent chainable API.

### Quick Start

The simplest way to merge rows with identical values:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { spanMethodBuilder } from '@vunio/utils/ep';

const tableData = ref([
  { province: 'Zhejiang', city: 'Hangzhou', area: 'Xihu' },
  { province: 'Zhejiang', city: 'Hangzhou', area: 'Binjiang' },
  { province: 'Zhejiang', city: 'Ningbo', area: 'Yinzhou' },
  { province: 'Jiangsu', city: 'Nanjing', area: 'Xuanwu' },
]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['province', 'city']) // Merge province and city
  .build();
</script>

<template>
  <el-table :data="tableData" :span-method="spanMethod" border>
    <el-table-column prop="province" label="Province" />
    <el-table-column prop="city" label="City" />
    <el-table-column prop="area" label="Area" />
  </el-table>
</template>
```

### Row Merging (Vertical)

#### Single Group with Dependencies

Multiple columns merge by priority with dependencies - subsequent columns only merge when previous columns are in the same merge area:

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['dept', 'team', 'group']) // dept → team → group, nested hierarchy
  .build();
```

**Merge Rules:**

- `dept` (Department): Rows with same department will be merged
- `team` (Team): Only merges within the same department
- `group` (Group): Only merges within the same department and team

#### Multiple Independent Groups (✨ Solves Dependency Issue)

Call `mergeRows()` multiple times to create independent merge groups with no cross-dependencies:

```ts
const tableData = [
  { province: 'Zhejiang', city: 'Hangzhou', status: 'active', category: 'A' },
  { province: 'Zhejiang', city: 'Hangzhou', status: 'active', category: 'A' },
  { province: 'Zhejiang', city: 'Ningbo', status: 'active', category: 'B' },
  { province: 'Jiangsu', city: 'Nanjing', status: 'inactive', category: 'B' },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['province', 'city']) // Group 1: Province-city linkage
  .mergeRows(['status']) // Group 2: Status merges independently
  .mergeRows(['category']) // Group 3: Category merges independently
  .build();
```

**Result:**

- `status` column merges first 3 rows (all 'active'), regardless of province/city
- `category` column calculates merge areas independently from province/city/status

### Column Merging (Horizontal)

#### Merge Columns in Specified Rows

Use row index array to specify which rows to merge:

```ts
const tableData = [
  { name: 'Header', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4' },
  { name: 'Data 1', q1: 100, q2: 200, q3: 300, q4: 400 },
  { name: 'Data 2', q1: 150, q2: 250, q3: 350, q4: 450 },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeCols({
    rows: [0], // First row (0-indexed)
    groups: [['q1', 'q2', 'q3', 'q4']], // Merge q1-q4
  })
  .build();
```

#### Multiple Column Groups

Same row can have multiple independent merge groups:

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeCols({
    rows: [0],
    groups: [
      ['q1', 'q2'], // Group 1: merge q1-q2
      ['q3', 'q4'], // Group 2: merge q3-q4
    ],
  })
  .build();
```

#### Conditional Merging

Use a function to dynamically determine which rows to merge:

```ts
const tableData = [
  { type: 'header', name: 'Title', a: 'A', b: 'B', c: 'C' },
  { type: 'data', name: 'Data', a: 1, b: 2, c: 3 },
  { type: 'summary', name: 'Subtotal', a: 100, b: 200, c: 300 },
  { type: 'total', name: 'Total', a: 1000, b: 2000, c: 3000 },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  // Header row: merge all columns
  .mergeCols({
    rows: (rowIndex, row) => row.type === 'header',
    groups: [['name', 'a', 'b', 'c']],
  })
  // Summary row: merge a-b
  .mergeCols({
    rows: (rowIndex, row) => row.type === 'summary',
    groups: [['a', 'b']],
  })
  // Total row: merge b-c
  .mergeCols({
    rows: (rowIndex, row) => row.type === 'total',
    groups: [['b', 'c']],
  })
  .build();
```

#### Dynamic Merge Rules

Merge groups can also be dynamically returned based on row data:

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeCols({
    rows: [0, 1, 2],
    groups: (rowIndex, row) => {
      // Dynamically decide grouping based on row data
      if (row.type === 'A') {
        return [['col1', 'col2']]; // Type A merges col1-col2
      } else {
        return [['col2', 'col3']]; // Other types merge col2-col3
      }
    },
  })
  .build();
```

### Mixed Row and Column Merging

Row and column merging can be used together to create complex table layouts:

```ts
const tableData = [
  { name: 'Header', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4' },
  { name: 'Zhejiang', q1: 100, q2: 200, q3: 300, q4: 400 },
  { name: 'Zhejiang', q1: 150, q2: 250, q3: 350, q4: 450 },
  { name: 'Jiangsu', q1: 120, q2: 220, q3: 320, q4: 420 },
  { name: 'Subtotal', q1: 370, q2: 670, q3: 970, q4: 1270 },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  // Row merge: merge identical name values
  .mergeRows(['name'])
  // Column merge: merge all quarter columns in header row
  .mergeCols({
    rows: [0],
    groups: [['q1', 'q2', 'q3', 'q4']],
  })
  // Column merge: split subtotal row into two groups
  .mergeCols({
    rows: (idx, row) => row.name === 'Subtotal',
    groups: [
      ['q1', 'q2'], // First half
      ['q3', 'q4'], // Second half
    ],
  })
  .build();
```

### Cache Strategies

#### Smart Cache (Default)

Smart caching is enabled by default and automatically detects data changes:

```ts
const spanMethod = spanMethodBuilder().withData(tableData).mergeRows(['province']).build(); // Cache enabled by default
```

#### Manual Cache Control (Recommended)

For large datasets, it's recommended to use `cacheKey` for manual cache control - optimal performance:

```ts
const version = ref(0);
const tableData = ref([...]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .withCacheKey(version)  // Provide cache key
  .mergeRows(['province', 'city'])
  .build();

// Manually update cache key when data changes
function updateData(newData) {
  tableData.value = newData;
  version.value++;  // Trigger cache update
}
```

#### Disable Cache

If data changes very frequently, you can disable caching:

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .noCache() // Disable cache
  .mergeRows(['province'])
  .build();
```

### Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { spanMethodBuilder } from '@vunio/utils/ep';

const version = ref(0);
const tableData = ref([
  { province: 'Zhejiang', city: 'Hangzhou', status: 'active', area: 'Xihu', population: 100 },
  { province: 'Zhejiang', city: 'Hangzhou', status: 'active', area: 'Binjiang', population: 120 },
  { province: 'Zhejiang', city: 'Ningbo', status: 'active', area: 'Yinzhou', population: 90 },
  { province: 'Jiangsu', city: 'Nanjing', status: 'inactive', area: 'Xuanwu', population: 80 },
]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .withCacheKey(version)
  .mergeRows(['province', 'city']) // Province-city linkage
  .mergeRows(['status']) // Status merges independently
  .build();

function addRow() {
  tableData.value.push({
    province: 'Zhejiang',
    city: 'Hangzhou',
    status: 'active',
    area: 'Gongshu',
    population: 110,
  });
  version.value++;
}

function updateRow(index: number) {
  tableData.value[index].city = 'Wenzhou';
  version.value++;
}
</script>

<template>
  <div>
    <el-button @click="addRow">Add Row</el-button>
    <el-button @click="updateRow(0)">Update First Row</el-button>

    <el-table :data="tableData" :span-method="spanMethod" border>
      <el-table-column prop="province" label="Province" width="100" />
      <el-table-column prop="city" label="City" width="100" />
      <el-table-column prop="status" label="Status" width="100" />
      <el-table-column prop="area" label="Area" width="120" />
      <el-table-column prop="population" label="Population (10k)" width="120" />
    </el-table>
  </div>
</template>
```

### API Reference

#### spanMethodBuilder()

Creates a chainable builder for configuring ElementPlus Table cell merge rules.

**Returns:** `spanMethodBuilder`

#### spanMethodBuilder Methods

##### withData(data)

Set the table data source (required).

**Parameters:**

- `data: MaybeRef<any[]>` - Table data array, supports ref/computed

**Returns:** `this` (chainable)

---

##### mergeRows(columns)

Add a group of row merge rules (vertical merging).

- Can be called multiple times, each call creates an independent merge group
- Columns within the same group merge by priority (with dependencies)
- Different groups are independent (no cross-dependencies)

**Parameters:**

- `columns: string[]` - Array of column names to merge, sorted by priority

**Returns:** `this` (chainable)

**Example:**

```ts
spanMethodBuilder()
  .mergeRows(['province', 'city']) // Group 1: province-city linkage
  .mergeRows(['status']); // Group 2: status merges independently
```

---

##### mergeCols(config)

Add column merge rules (horizontal merging).

- Can be called multiple times, supporting different merge rules for different rows
- Each call can specify different row conditions and merge groups

**Parameters:**

- `config.rows: boolean | number[] | ((rowIndex: number, row: any) => boolean)`
  - `boolean`: `true` means all rows, `false` means no merge
  - `number[]`: Array of row indices to merge
  - `function`: Predicate function, returns `true` for rows to merge
- `config.groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[])`
  - `MergeGroup[]`: Static merge group configuration, e.g., `[['a', 'b'], ['c', 'd']]`
  - `function`: Function that dynamically returns merge groups

**Returns:** `this` (chainable)

**Example:**

```ts
spanMethodBuilder()
  // Header row merge
  .mergeCols({
    rows: [0],
    groups: [['q1', 'q2', 'q3']],
  })
  // Summary row merge
  .mergeCols({
    rows: (idx, row) => row.type === 'summary',
    groups: [['total', 'count']],
  });
```

---

##### withCacheKey(key)

Set cache key for precise cache invalidation control.

**Parameters:**

- `key: MaybeRef<string | number>` - Cache key, supports ref/computed

**Returns:** `this` (chainable)

**Example:**

```ts
const version = ref(0);
spanMethodBuilder().withCacheKey(version);
// When data changes: version.value++
```

---

##### noCache()

Disable caching (enabled by default).

**Returns:** `this` (chainable)

---

##### build()

Build the final span-method function.

**Returns:** `SpanMethod` - ElementPlus Table span-method function

```ts
(params: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  rowspan: number;
  colspan: number;
};
```

### Performance Optimization Tips

1. **Large Datasets**: Use `withCacheKey()` for manual cache control to avoid automatic detection overhead
2. **Frequent Updates**: If data changes very frequently, consider using `noCache()` to disable caching
3. **Number of Merge Columns**: Minimize columns in each `mergeRows()` group, only merge necessary columns
4. **Data Sorting**: Ensure data is sorted by merge columns - rows with identical values must be consecutive for proper merging

### Important Notes

1. **Must call `withData()`**: You must call `withData()` to set the data source before calling `build()`
2. **Data Sorting**: Table data must be sorted by merge columns - rows with identical values should be consecutive
3. **Column Name Matching**: Column names must match the `prop` attribute of `el-table-column`
4. **Cache Key Updates**: When using `withCacheKey()`, you must manually update the cache key value after data changes
5. **Visual Only**: Merging only affects visual presentation, not the underlying data

### Differences from Legacy API

If you previously used `spanMethodBuilder()` and `createColSpanMethod()`, the new chainable API provides a more elegant approach:

```ts
// ❌ Old Way - Verbose, repeated configuration
import { spanMethodBuilder, createColSpanMethod, composeSpanMethods } from '@vunio/utils/ep';

const spanMethod = composeSpanMethods(
  spanMethodBuilder({
    mergeColumns: ['province', 'city'],
    data: tableData,
    cacheKey: version,
  }),
  spanMethodBuilder({
    mergeColumns: ['status'],
    data: tableData,
    cacheKey: version,
  }),
  createColSpanMethod({
    rows: [0],
    mergeGroups: [['q1', 'q2']],
    data: tableData,
    cacheKey: version,
  }),
);

// ✅ New Way - Elegant, clear
import { spanMethodBuilder } from '@vunio/utils/ep';

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .withCacheKey(version)
  .mergeRows(['province', 'city']) // Province-city linkage
  .mergeRows(['status']) // Status independent
  .mergeCols({ rows: [0], groups: [['q1', 'q2']] })
  .build();
```

**Advantages of New API:**

- ✅ Unified entry point API (`spanMethodBuilder()`)
- ✅ Chainable calls, more readable code
- ✅ Multiple `mergeRows()` calls solve column dependency issues
- ✅ Configuration reuse - `data` and `cacheKey` configured once
