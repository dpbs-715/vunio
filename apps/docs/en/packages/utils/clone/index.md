# Clone

## deepClone

> Deep clone an object

```ts
import { deepClone } from '@vunio/utils';

const a = { f: 1, c: 2 };
const b = deepClone(a);
```

## shallowClone

Shallow-clones a container while preserving its member identities. Use it when the container needs
an independent snapshot but its entities must keep stable references.

```ts
import { shallowClone } from '@vunio/utils';

const node = { id: 'node-1' };
const nodes = [node];
const cloned = shallowClone(nodes);

cloned !== nodes; // true
cloned[0] === node; // true
```

## cloneByStrategy

Clones a value with the `'deep' | 'shallow' | 'none'` strategy. It defaults to `deep`; `none`
returns the original reference.

```ts
import { cloneByStrategy } from '@vunio/utils';

const cloned = cloneByStrategy(nodes, 'shallow');
```
