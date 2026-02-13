# ElementPlus 工具函数

## spanMethodBuilder

> 为 ElementPlus Table 组件创建智能单元格合并函数，支持行合并、列合并以及混合使用，提供流畅的链式 API。

### 快速开始

最简单的使用方式，合并相同值的行：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { spanMethodBuilder } from '@vunio/utils/ep';

const tableData = ref([
  { province: '浙江', city: '杭州', area: '西湖区' },
  { province: '浙江', city: '杭州', area: '滨江区' },
  { province: '浙江', city: '宁波', area: '鄞州区' },
  { province: '江苏', city: '南京', area: '玄武区' },
]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['province', 'city']) // 省市联动合并
  .build();
</script>

<template>
  <el-table :data="tableData" :span-method="spanMethod" border>
    <el-table-column prop="province" label="省份" />
    <el-table-column prop="city" label="城市" />
    <el-table-column prop="area" label="区域" />
  </el-table>
</template>
```

### 行合并（纵向合并）

#### 单组联动合并

多个列按优先级联动合并，前一列必须在同一区域内，后续列才能合并：

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['dept', 'team', 'group']) // 部门 → 团队 → 小组，层层嵌套
  .build();
```

**合并规则：**

- `dept`（部门）：相同部门的行会合并
- `team`（团队）：只有在同一个部门内，相同团队才会合并
- `group`（小组）：只有在同一个部门和团队内，相同小组才会合并

#### 多组独立合并（✨ 解决依赖问题）

通过多次调用 `mergeRows()` 创建多个独立的合并组，组与组之间互不影响：

```ts
const tableData = [
  { province: '浙江', city: '杭州', status: 'active', category: 'A' },
  { province: '浙江', city: '杭州', status: 'active', category: 'A' },
  { province: '浙江', city: '宁波', status: 'active', category: 'B' },
  { province: '江苏', city: '南京', status: 'inactive', category: 'B' },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(['province', 'city']) // 第1组：省市联动合并
  .mergeRows(['status']) // 第2组：状态独立合并（不受省市影响）
  .mergeRows(['category']) // 第3组：分类独立合并（不受其他列影响）
  .build();
```

**效果：**

- `status` 列会合并前 3 行（都是 'active'），不管省市是否相同
- `category` 列会独立计算合并区域，不受省市和状态影响

### 列合并（横向合并）

#### 合并指定行的列

使用行索引数组指定需要合并的行：

```ts
const tableData = [
  { name: '表头', q1: '第一季度', q2: '第二季度', q3: '第三季度', q4: '第四季度' },
  { name: '数据1', q1: 100, q2: 200, q3: 300, q4: 400 },
  { name: '数据2', q1: 150, q2: 250, q3: 350, q4: 450 },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeCols({
    rows: [0], // 第一行（索引从 0 开始）
    groups: [['q1', 'q2', 'q3', 'q4']], // 合并 q1-q4 四列
  })
  .build();
```

#### 多组列合并

同一行可以分成多个独立的合并组：

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeCols({
    rows: [0],
    groups: [
      ['q1', 'q2'], // 第一组：合并 q1-q2
      ['q3', 'q4'], // 第二组：合并 q3-q4
    ],
  })
  .build();
```

#### 条件判断合并

使用函数动态判断哪些行需要合并：

```ts
const tableData = [
  { type: 'header', name: '标题', a: 'A', b: 'B', c: 'C' },
  { type: 'data', name: '数据', a: 1, b: 2, c: 3 },
  { type: 'summary', name: '小计', a: 100, b: 200, c: 300 },
  { type: 'total', name: '总计', a: 1000, b: 2000, c: 3000 },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  // header 行：合并所有列
  .mergeCols({
    rows: (rowIndex, row) => row.type === 'header',
    groups: [['name', 'a', 'b', 'c']],
  })
  // summary 行：合并 a-b
  .mergeCols({
    rows: (rowIndex, row) => row.type === 'summary',
    groups: [['a', 'b']],
  })
  // total 行：合并 b-c
  .mergeCols({
    rows: (rowIndex, row) => row.type === 'total',
    groups: [['b', 'c']],
  })
  .build();
```

#### 动态合并规则

合并分组也可以根据行数据动态返回：

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeCols({
    rows: [0, 1, 2],
    groups: (rowIndex, row) => {
      // 根据行数据动态决定如何分组
      if (row.type === 'A') {
        return [['col1', 'col2']]; // A 类型合并 col1-col2
      } else {
        return [['col2', 'col3']]; // 其他类型合并 col2-col3
      }
    },
  })
  .build();
```

### 行列混合使用

行合并和列合并可以同时使用，创建复杂的表格布局：

```ts
const tableData = [
  { name: '表头', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4' },
  { name: '浙江', q1: 100, q2: 200, q3: 300, q4: 400 },
  { name: '浙江', q1: 150, q2: 250, q3: 350, q4: 450 },
  { name: '江苏', q1: 120, q2: 220, q3: 320, q4: 420 },
  { name: '小计', q1: 370, q2: 670, q3: 970, q4: 1270 },
];

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  // 行合并：name 列相同值合并
  .mergeRows(['name'])
  // 列合并：表头行合并所有季度列
  .mergeCols({
    rows: [0],
    groups: [['q1', 'q2', 'q3', 'q4']],
  })
  // 列合并：小计行分成两组
  .mergeCols({
    rows: (idx, row) => row.name === '小计',
    groups: [
      ['q1', 'q2'], // 上半年
      ['q3', 'q4'], // 下半年
    ],
  })
  .build();
```

### 缓存策略

#### 智能缓存（默认）

默认启用智能缓存，自动检测数据变化：

```ts
const spanMethod = spanMethodBuilder().withData(tableData).mergeRows(['province']).build(); // 默认启用缓存
```

#### 手动缓存控制（推荐）

对于大数据量场景，推荐使用 `cacheKey` 手动控制缓存失效，性能最优：

```ts
const version = ref(0);
const tableData = ref([...]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .withCacheKey(version)  // 提供缓存键
  .mergeRows(['province', 'city'])
  .build();

// 数据变化时手动更新缓存键
function updateData(newData) {
  tableData.value = newData;
  version.value++;  // 触发缓存更新
}
```

#### 禁用缓存

如果数据变化非常频繁，可以禁用缓存：

```ts
const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .noCache() // 禁用缓存
  .mergeRows(['province'])
  .build();
```

### 完整示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { spanMethodBuilder } from '@vunio/utils/ep';

const version = ref(0);
const tableData = ref([
  { province: '浙江', city: '杭州', status: 'active', area: '西湖区', population: 100 },
  { province: '浙江', city: '杭州', status: 'active', area: '滨江区', population: 120 },
  { province: '浙江', city: '宁波', status: 'active', area: '鄞州区', population: 90 },
  { province: '江苏', city: '南京', status: 'inactive', area: '玄武区', population: 80 },
]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .withCacheKey(version)
  .mergeRows(['province', 'city']) // 省市联动合并
  .mergeRows(['status']) // 状态独立合并
  .build();

function addRow() {
  tableData.value.push({
    province: '浙江',
    city: '杭州',
    status: 'active',
    area: '拱墅区',
    population: 110,
  });
  version.value++;
}

function updateRow(index: number) {
  tableData.value[index].city = '温州';
  version.value++;
}
</script>

<template>
  <div>
    <el-button @click="addRow">添加行</el-button>
    <el-button @click="updateRow(0)">修改第一行</el-button>

    <el-table :data="tableData" :span-method="spanMethod" border>
      <el-table-column prop="province" label="省份" width="100" />
      <el-table-column prop="city" label="城市" width="100" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="area" label="区域" width="120" />
      <el-table-column prop="population" label="人口（万）" width="120" />
    </el-table>
  </div>
</template>
```

### API 参考

#### spanMethodBuilder()

创建链式构建器，用于配置 ElementPlus Table 的单元格合并规则。

**返回值：** `spanMethodBuilder`

#### spanMethodBuilder 方法

##### withData(data)

设置表格数据源（必须调用）。

**参数：**

- `data: MaybeRef<any[]>` - 表格数据数组，支持 ref/computed

**返回值：** `this`（支持链式调用）

---

##### mergeRows(columns)

添加一组行合并规则（纵向合并）。

- 可以多次调用，每次调用创建一个独立的合并组
- 同一组内的列按优先级依次合并（有前后依赖关系）
- 不同组之间互不干扰（无依赖关系）

**参数：**

- `columns: string[]` - 需要合并的列名数组，按优先级排序

**返回值：** `this`（支持链式调用）

**示例：**

```ts
spanMethodBuilder()
  .mergeRows(['province', 'city']) // 第1组：省市联动
  .mergeRows(['status']); // 第2组：状态独立合并
```

---

##### mergeCols(config)

添加列合并规则（横向合并）。

- 可以多次调用，支持不同行有不同的合并规则
- 每次调用可以指定不同的行条件和合并分组

**参数：**

- `config.rows: boolean | number[] | ((rowIndex: number, row: any) => boolean)`
  - `boolean`: `true` 表示所有行，`false` 表示不合并
  - `number[]`: 需要合并的行索引数组
  - `function`: 判断函数，返回 `true` 表示该行需要合并
- `config.groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[])`
  - `MergeGroup[]`: 静态合并分组配置，例如 `[['a', 'b'], ['c', 'd']]`
  - `function`: 动态返回合并分组的函数

**返回值：** `this`（支持链式调用）

**示例：**

```ts
spanMethodBuilder()
  // 表头行合并
  .mergeCols({
    rows: [0],
    groups: [['q1', 'q2', 'q3']],
  })
  // 汇总行合并
  .mergeCols({
    rows: (idx, row) => row.type === 'summary',
    groups: [['total', 'count']],
  });
```

---

##### withCacheKey(key)

设置缓存键（用于精确控制缓存失效）。

**参数：**

- `key: MaybeRef<string | number>` - 缓存键，支持 ref/computed

**返回值：** `this`（支持链式调用）

**示例：**

```ts
const version = ref(0);
spanMethodBuilder().withCacheKey(version);
// 数据变化时：version.value++
```

---

##### noCache()

禁用缓存（默认启用）。

**返回值：** `this`（支持链式调用）

---

##### build()

构建最终的 span-method 函数。

**返回值：** `SpanMethod` - ElementPlus Table 的 span-method 函数

```ts
(params: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  rowspan: number;
  colspan: number;
};
```

### 性能优化建议

1. **大数据量场景**：使用 `withCacheKey()` 手动控制缓存，避免自动检测的性能开销
2. **频繁更新场景**：如果数据变化非常频繁，可以考虑使用 `noCache()` 禁用缓存
3. **合并列数量**：尽量减少单组 `mergeRows()` 中的列数，只合并必要的列
4. **数据排序**：确保数据已按合并列排序，相同值的行连续排列才能正确合并

### 注意事项

1. **必须调用 `withData()`**：在调用 `build()` 之前必须先调用 `withData()` 设置数据源
2. **数据排序**：表格数据必须已经按照合并列排序，相同值的行应该连续排列
3. **列名匹配**：列名必须与 `el-table-column` 的 `prop` 属性一致
4. **缓存键更新**：使用 `withCacheKey()` 时，必须在数据变化后手动更新缓存键的值
5. **仅影响视图**：合并只影响视觉呈现，不影响数据本身

### 与旧版 API 的区别

如果你之前使用的是 `spanMethodBuilder()` 和 `createColSpanMethod()`，新的链式 API 提供了更优雅的使用方式：

```ts
// ❌ 旧方式 - 繁琐、重复配置
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

// ✅ 新方式 - 优雅、清晰
import { spanMethodBuilder } from '@vunio/utils/ep';

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .withCacheKey(version)
  .mergeRows(['province', 'city']) // 省市联动
  .mergeRows(['status']) // 状态独立
  .mergeCols({ rows: [0], groups: [['q1', 'q2']] })
  .build();
```

**新 API 的优势：**

- ✅ 统一的入口 API（`spanMethodBuilder()`）
- ✅ 链式调用，代码更易读
- ✅ 多次调用 `mergeRows()` 解决列之间的依赖问题
- ✅ 配置复用，`data` 和 `cacheKey` 只需配置一次
