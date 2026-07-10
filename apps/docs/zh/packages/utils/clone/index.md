# clone

## deepClone

> 深克隆对象

```ts
import { deepClone } from '@vunio/utils';

const a = { f: 1, c: 2 };
const b = deepClone(a);
```

## shallowClone

浅克隆容器并保留其成员引用，适合需要独立数组快照但必须保持实体身份的场景。

```ts
import { shallowClone } from '@vunio/utils';

const node = { id: 'node-1' };
const nodes = [node];
const cloned = shallowClone(nodes);

cloned !== nodes; // true
cloned[0] === node; // true
```

## cloneByStrategy

根据 `'deep' | 'shallow' | 'none'` 策略克隆值。默认使用 `deep`；`none` 会直接返回原引用。

```ts
import { cloneByStrategy } from '@vunio/utils';

const cloned = cloneByStrategy(nodes, 'shallow');
```
