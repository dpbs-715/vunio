/**
 * 路径类型定义
 */
export type PathKey = string | number | symbol;
export type Path = string | readonly PathKey[];

function isPathKey(path: Path): path is string {
  return !Array.isArray(path);
}

/**
 * 将路径转换为键数组
 * @example
 * toPath('a.b.c') // ['a', 'b', 'c']
 * toPath('a[0].b') // ['a', 0, 'b']
 * toPath(['a', 0, 'b']) // ['a', 0, 'b']
 */
export function toPath(path: Path): PathKey[] {
  if (Array.isArray(path)) return [...path];

  const keys: PathKey[] = [];
  const pathString = path as string;
  let segment = '';

  const pushSegment = () => {
    if (segment) {
      keys.push(segment);
      segment = '';
    }
  };

  for (let i = 0; i < pathString.length; i++) {
    const char = pathString[i];

    if (char === '.') {
      pushSegment();
      continue;
    }

    if (char === '[') {
      const closeIndex = pathString.indexOf(']', i + 1);
      const bracketValue = closeIndex === -1 ? '' : pathString.slice(i + 1, closeIndex);

      if (/^\d+$/.test(bracketValue)) {
        pushSegment();
        keys.push(Number(bracketValue));
        i = closeIndex;
        continue;
      }
    }

    segment += char;
  }

  pushSegment();

  return keys;
}

/**
 * 判断对象自身是否拥有指定 key
 */
export function hasOwnKey(obj: any, key: PathKey): boolean {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 从对象中获取嵌套路径的值
 */
export function getByPath<T = any>(obj: any, path: Path): T | undefined {
  const keys = toPath(path);
  let current = obj;

  for (const key of keys) {
    if (current == null) return undefined;
    current = current[key];
  }

  return current;
}

/**
 * 在对象中设置嵌套路径的值
 */
export function setByPath(obj: any, path: Path, value: any): void {
  const keys = toPath(path);
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    current[key] ??= typeof nextKey === 'number' ? [] : {};
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey !== undefined) {
    current[lastKey] = value;
  }
}

/**
 * 优先按对象自身 key 读值，不存在时按路径读取
 */
export function getByKeyOrPath<T = any>(obj: any, path: Path): T | undefined {
  if (isPathKey(path)) {
    const keyValue = obj?.[path];

    if (hasOwnKey(obj, path)) {
      return keyValue;
    }
  }

  return getByPath(obj, path);
}

/**
 * 优先按对象自身 key 写值，不存在时按路径写入
 */
export function setByKeyOrPath(obj: any, path: Path, value: any): void {
  if (isPathKey(path) && hasOwnKey(obj, path)) {
    obj[path] = value;
    return;
  }

  setByPath(obj, path, value);
}

/**
 * 从对象中删除嵌套路径的值
 */
export function unsetByPath(obj: any, path: Path): void {
  const keys = toPath(path);
  if (keys.length === 0) return;

  const lastKey = keys[keys.length - 1];
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current?.[keys[i]];
    if (current == null) return;
  }

  if (current && lastKey !== undefined) {
    delete current[lastKey];
  }
}
