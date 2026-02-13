# Array Utilities

## unique

> Remove duplicate elements from an array.

```ts
import { unique } from '@vunio/utils';

const arr = [1, 2, 2, 3, 3, 4];
unique(arr); // [1, 2, 3, 4]
```

## chunk

> Split an array into chunks of specified size.

```ts
import { chunk } from '@vunio/utils';

const arr = [1, 2, 3, 4, 5, 6, 7];
chunk(arr, 3); // [[1, 2, 3], [4, 5, 6], [7]]
```

## diffRows

> Compare two arrays and return added, updated, and deleted rows. Supports custom key and field comparison.

```ts
import { diffRows } from '@vunio/utils';

const oldData = [
  { id: 1, name: 'Alice', age: 20 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 30 },
];

const newData = [
  { id: 1, name: 'Alice', age: 21 }, // Updated: age changed
  { id: 2, name: 'Bob', age: 25 }, // Unchanged
  { id: 4, name: 'David', age: 28 }, // Added
];

const result = diffRows(oldData, newData);
// {
//   add: [{ id: 4, name: 'David', age: 28 }],
//   update: [{ id: 1, name: 'Alice', age: 21 }],
//   delete: [{ id: 3, name: 'Charlie', age: 30 }]
// }

// Custom options
diffRows(oldData, newData, {
  key: 'id', // Specify unique key (default: 'id')
  fields: ['name', 'age'], // Compare only specified fields
});

// Use function as key
diffRows(oldData, newData, {
  key: (row) => `${row.id}-${row.name}`,
});
```

## sortBy

> Sort an array with support for multiple fields and nested path access.

```ts
import { sortBy } from '@vunio/utils';

const users = [
  { name: 'Alice', age: 25, score: { math: 90 } },
  { name: 'Bob', age: 20, score: { math: 95 } },
  { name: 'Charlie', age: 25, score: { math: 85 } },
];

// Single field sort
sortBy(users, 'age'); // Sort by age ascending
sortBy(users, 'age', 'desc'); // Sort by age descending

// Nested path sort
sortBy(users, 'score.math'); // Sort by score.math ascending

// Multi-field sort
sortBy(users, ['age', 'name']); // Sort by age, then by name

// Complex sort: different orders for different fields
sortBy(users, [
  { key: 'age', order: 'desc' }, // age descending
  { key: 'score.math', order: 'asc' }, // math ascending
]);
```
