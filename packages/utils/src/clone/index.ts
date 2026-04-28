export const deepClone = (() => {
  function isVueRefValue(target: any): boolean {
    return Boolean(target?.__v_isRef);
  }

  function getVueRawValue<T>(target: T): T {
    const maybeVueProxy = target as any;
    if ((maybeVueProxy?.__v_isReactive || maybeVueProxy?.__v_isReadonly) && maybeVueProxy.__v_raw) {
      return maybeVueProxy.__v_raw;
    }

    return target;
  }

  function clone<T>(target: T, map = new WeakMap<object, any>()): T {
    // 基本类型直接返回
    if (target === null || typeof target !== 'object') {
      return target;
    }
    // Vue ref/computed 保留原引用，避免递归其内部循环结构并保持响应性
    if (isVueRefValue(target)) {
      return target;
    }
    const source = getVueRawValue(target);
    // 检查是否已经拷贝过该对象（处理循环引用）
    if (map.has(target)) {
      return map.get(target);
    }
    if (source !== target && map.has(source as object)) {
      return map.get(source as object);
    }
    // 处理 Date
    if (source instanceof Date) {
      const copy = new Date(source.getTime()) as unknown as T;
      map.set(target, copy);
      return copy;
    }
    // 处理 RegExp
    if (source instanceof RegExp) {
      const copy = new RegExp(source.source, source.flags) as unknown as T;
      map.set(target, copy);
      return copy;
    }
    // 处理 Map
    if (source instanceof Map) {
      const copy = new Map() as unknown as T;
      map.set(target, copy);
      if (source !== target) {
        map.set(source as object, copy);
      }
      (source as Map<any, any>).forEach((value: any, key: any) => {
        (copy as Map<any, any>).set(clone(key, map), clone(value, map));
      });
      return copy;
    }
    // 处理 Set
    if (source instanceof Set) {
      const copy = new Set() as unknown as T;
      map.set(target, copy);
      if (source !== target) {
        map.set(source as object, copy);
      }
      (source as Set<any>).forEach((value: any) => {
        (copy as Set<any>).add(clone(value, map));
      });
      return copy;
    }
    // 处理数组或普通对象
    const cloneTarget = Array.isArray(source)
      ? ([] as unknown as T)
      : (Object.create(Object.getPrototypeOf(source)) as T);
    // 保存到 WeakMap，防止循环引用
    map.set(target, cloneTarget);
    if (source !== target) {
      map.set(source as object, cloneTarget);
    }
    // 拷贝普通属性
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        (cloneTarget as any)[key] = clone((source as any)[key], map);
      }
    }
    // 拷贝 Symbol 属性（可选，根据需求）
    const symbolKeys = Object.getOwnPropertySymbols(source);
    for (const symKey of symbolKeys) {
      (cloneTarget as any)[symKey] = clone((source as any)[symKey], map);
    }
    return cloneTarget;
  }
  return clone;
})();
