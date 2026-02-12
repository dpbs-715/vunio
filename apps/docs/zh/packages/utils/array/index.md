# 数组工具

## unique

> 数组去重。

```ts
import { unique } from 'dlib-utils';

const arr = [1, 2, 2, 3, 3, 4];
unique(arr); // [1, 2, 3, 4]
```

## chunk

> 将数组分割成指定大小的块。

```ts
import { chunk } from 'dlib-utils';

const arr = [1, 2, 3, 4, 5, 6, 7];
chunk(arr, 3); // [[1, 2, 3], [4, 5, 6], [7]]
```

## diffRows

> 比较两个数组，返回新增、更新和删除的行。支持自定义键和字段比较。

```ts
import { diffRows } from 'dlib-utils';

const oldData = [
  { id: 1, name: '张三', age: 20 },
  { id: 2, name: '李四', age: 25 },
  { id: 3, name: '王五', age: 30 },
];

const newData = [
  { id: 1, name: '张三', age: 21 }, // 更新：年龄改变
  { id: 2, name: '李四', age: 25 }, // 无变化
  { id: 4, name: '赵六', age: 28 }, // 新增
];

const result = diffRows(oldData, newData);
// {
//   add: [{ id: 4, name: '赵六', age: 28 }],
//   update: [{ id: 1, name: '张三', age: 21 }],
//   delete: [{ id: 3, name: '王五', age: 30 }]
// }

// 自定义选项
diffRows(oldData, newData, {
  key: 'id', // 指定唯一键（默认为 'id'）
  fields: ['name', 'age'], // 仅比较指定字段
});

// 使用函数作为键
diffRows(oldData, newData, {
  key: (row) => `${row.id}-${row.name}`,
});
```

## sortBy

> 对数组进行排序，支持多字段排序和嵌套路径访问。

```ts
import { sortBy } from 'dlib-utils';

const users = [
  { name: '张三', age: 25, score: { math: 90 } },
  { name: '李四', age: 20, score: { math: 95 } },
  { name: '王五', age: 25, score: { math: 85 } },
];

// 单字段排序
sortBy(users, 'age'); // 按 age 升序
sortBy(users, 'age', 'desc'); // 按 age 降序

// 嵌套路径排序
sortBy(users, 'score.math'); // 按 score.math 升序

// 多字段排序
sortBy(users, ['age', 'name']); // 先按 age，再按 name 排序

// 复杂排序：不同字段不同排序方向
sortBy(users, [
  { key: 'age', order: 'desc' }, // age 降序
  { key: 'score.math', order: 'asc' }, // math 升序
]);
```
