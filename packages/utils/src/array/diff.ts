type Key = string | number;
type KeyGetter<T> = keyof T | ((row: T) => Key);

interface DiffOptions<T> {
  key?: KeyGetter<T>;
  fields?: string[];
}

export function diffRows<T extends Record<string, any>>(
  oldArr: T[],
  newArr: T[],
  options: DiffOptions<T> = {},
) {
  const { key = 'id', fields } = options;

  const getKey = typeof key === 'function' ? key : (row: T) => row[key] as Key;

  const oldMap = new Map<Key, T>();
  oldArr.forEach((i) => {
    const k = getKey(i);
    if (k != null) oldMap.set(k, i);
  });

  const add: T[] = [];
  const update: T[] = [];
  const seen = new Set<Key>();

  for (const row of newArr) {
    const k = getKey(row);

    if (k == null) {
      add.push(row);
      continue;
    }

    const old = oldMap.get(k);

    if (!old) {
      add.push(row);
      continue;
    }

    if (!shallowCompare(old, row, fields, k)) {
      update.push(row);
    }

    seen.add(k);
  }

  const del = oldArr.filter((i) => {
    const k = getKey(i);
    return k != null && !seen.has(k);
  });

  return { add, update, delete: del };
}

function shallowCompare(a: any, b: any, fields?: string[], key?: any) {
  const keys = fields || new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const k of keys as any) {
    if (k === key) continue;
    if (a[k] !== b[k]) return false;
  }

  return true;
}
