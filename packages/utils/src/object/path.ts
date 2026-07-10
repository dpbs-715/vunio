import { deepClone } from '../clone';

/**
 * 路径类型定义
 */
export type PathKey = string | number | symbol;
export type Path = string | readonly PathKey[];
export type PathRollback = () => void;

interface CreatedPathContainer {
  container: object;
  key: PathKey;
  parent: object;
  previousArrayLength?: number;
  previousExisted: boolean;
  previousValue: null | undefined;
}

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

function isArrayIndex(key: PropertyKey): boolean {
  if (typeof key === 'number') return Number.isInteger(key) && key >= 0;
  return typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key);
}

function restoreArrayLength(target: any[], previousLength?: number) {
  if (previousLength === undefined || target.length <= previousLength) return;

  const hasLaterIndex = Reflect.ownKeys(target).some(
    (key) => isArrayIndex(key) && Number(key) >= previousLength,
  );

  if (!hasLaterIndex) {
    target.length = previousLength;
  }
}

function isEmptyContainer(target: object): boolean {
  return Reflect.ownKeys(target).every((key) => Array.isArray(target) && key === 'length');
}

/**
 * 优先按对象自身 key 写值，不存在时按路径写入，并返回一次性回滚函数。
 *
 * 回滚会恢复旧值、显式存在的 nullish 中间节点和数组长度，并清理本次写入创建且仍为空的容器。
 */
export function setByKeyOrPathReversibly(obj: any, path: Path, value: any): PathRollback {
  if (isPathKey(path) && hasOwnKey(obj, path)) {
    const previousValue = deepClone(obj[path]);
    obj[path] = deepClone(value);
    let canRollback = true;

    return () => {
      if (!canRollback) return;
      canRollback = false;
      obj[path] = deepClone(previousValue);
    };
  }

  const keys = toPath(path);
  if (keys.length === 0) return () => {};

  const createdContainers: CreatedPathContainer[] = [];
  let current = obj as object;

  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index];
    const nextKey = keys[index + 1];
    const currentValue = Reflect.get(current, key);

    if (currentValue == null) {
      const newContainer = typeof nextKey === 'number' ? [] : {};
      const previousArrayLength = Array.isArray(current) ? current.length : undefined;
      const previousExisted = hasOwnKey(current, key);
      const previousValue = currentValue;

      Reflect.set(current, key, newContainer);

      const observedContainer = Reflect.get(current, key) as object;
      createdContainers.push({
        container: observedContainer,
        key,
        parent: current,
        previousArrayLength,
        previousExisted,
        previousValue,
      });
      current = observedContainer;
      continue;
    }

    current = currentValue;
  }

  const leafKey = keys[keys.length - 1];
  if (leafKey === undefined) return () => {};

  const leafParent = current;
  const leafExisted = hasOwnKey(leafParent, leafKey);
  const previousValue = leafExisted ? deepClone(Reflect.get(leafParent, leafKey)) : undefined;
  const previousArrayLength = Array.isArray(leafParent) ? leafParent.length : undefined;

  Reflect.set(leafParent, leafKey, deepClone(value));

  let canRollback = true;

  return () => {
    if (!canRollback) return;
    canRollback = false;

    if (leafExisted) {
      Reflect.set(leafParent, leafKey, deepClone(previousValue));
    } else {
      Reflect.deleteProperty(leafParent, leafKey);
      if (Array.isArray(leafParent)) {
        restoreArrayLength(leafParent, previousArrayLength);
      }
    }

    for (let index = createdContainers.length - 1; index >= 0; index--) {
      const {
        container,
        key,
        parent,
        previousArrayLength: parentArrayLength,
        previousExisted,
        previousValue: parentValue,
      } = createdContainers[index];

      if (Reflect.get(parent, key) !== container || !isEmptyContainer(container)) continue;

      if (previousExisted) {
        Reflect.set(parent, key, parentValue);
      } else {
        Reflect.deleteProperty(parent, key);
      }

      if (!previousExisted && Array.isArray(parent)) {
        restoreArrayLength(parent, parentArrayLength);
      }
    }
  };
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
