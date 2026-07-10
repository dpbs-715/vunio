# Object Utilities

## setByKeyOrPathReversibly

Writes a value using an own key or nested path and returns a one-time rollback function. It uses
the same path semantics as `setByKeyOrPath`, including dot paths, array indexes, and existing flat
keys that contain dots.

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

Rollback restores the previous value, explicitly present `null`/`undefined` parent values, and
array lengths. Containers created by the write are removed when they are still empty. Multiple
writes should be rolled back in reverse execution order.

The fourth argument selects a clone strategy and defaults to `deep`. Use `shallow` for collections
that need independent array snapshots while preserving member identities.

```ts
const rollback = setByKeyOrPathReversibly(page, 'nodes', nextNodes, {
  clone: 'shallow',
});
```

```ts
type PathRollback = () => void;

function setByKeyOrPathReversibly(
  obj: any,
  path: string | readonly (string | number | symbol)[],
  value: any,
  options?: { clone?: 'deep' | 'shallow' | 'none' },
): PathRollback;
```
