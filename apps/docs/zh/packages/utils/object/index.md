# 对象工具

## setByKeyOrPathReversibly

按对象自身 key 或嵌套路径写入值，并返回一次性回滚函数。路径解析规则与
`setByKeyOrPath` 相同，支持点号路径、数组下标和已有的点号平铺 key。

```ts
import { setByKeyOrPathReversibly } from '@vunio/utils';

const formData = {};
const rollback = setByKeyOrPathReversibly(formData, 'users[0].name', 'Alice');

console.log(formData);
// { users: [{ name: 'Alice' }] }

rollback();
console.log(formData);
// {}
```

回滚会恢复原值、显式存在的 `null`/`undefined` 中间节点和数组长度，并删除本次写入创建且仍为空的容器。多个写入需要按照执行顺序的相反顺序回滚。

```ts
type PathRollback = () => void;

function setByKeyOrPathReversibly(
  obj: any,
  path: string | readonly (string | number | symbol)[],
  value: any,
): PathRollback;
```
