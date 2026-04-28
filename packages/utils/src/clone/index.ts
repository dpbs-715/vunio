export const deepClone = (() => {
  function isVueReactiveValue(target: any): boolean {
    return Boolean(target?.__v_isRef || target?.__v_isReactive || target?.__v_isReadonly);
  }

  function clone<T>(target: T, map = new WeakMap<object, any>()): T {
    // 基本类型直接返回
    if (target === null || typeof target !== 'object') {
      return target;
    }
    // Vue ref/reactive/computed 保留原引用，避免递归其内部循环结构并保持响应性
    if (isVueReactiveValue(target)) {
      return target;
    }
    // 检查是否已经拷贝过该对象（处理循环引用）
    if (map.has(target)) {
      return map.get(target);
    }
    // 处理 Date
    if (target instanceof Date) {
      const copy = new Date(target.getTime()) as unknown as T;
      map.set(target, copy);
      return copy;
    }
    // 处理 RegExp
    if (target instanceof RegExp) {
      const copy = new RegExp(target.source, target.flags) as unknown as T;
      map.set(target, copy);
      return copy;
    }
    // 处理 Map
    if (target instanceof Map) {
      const copy = new Map() as unknown as T;
      map.set(target, copy);
      (target as Map<any, any>).forEach((value: any, key: any) => {
        (copy as Map<any, any>).set(clone(key, map), clone(value, map));
      });
      return copy;
    }
    // 处理 Set
    if (target instanceof Set) {
      const copy = new Set() as unknown as T;
      map.set(target, copy);
      (target as Set<any>).forEach((value: any) => {
        (copy as Set<any>).add(clone(value, map));
      });
      return copy;
    }
    // 处理数组或普通对象
    const cloneTarget = Array.isArray(target)
      ? ([] as unknown as T)
      : (Object.create(Object.getPrototypeOf(target)) as T);
    // 保存到 WeakMap，防止循环引用
    map.set(target, cloneTarget);
    // 拷贝普通属性
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        (cloneTarget as any)[key] = clone((target as any)[key], map);
      }
    }
    // 拷贝 Symbol 属性（可选，根据需求）
    const symbolKeys = Object.getOwnPropertySymbols(target);
    for (const symKey of symbolKeys) {
      (cloneTarget as any)[symKey] = clone((target as any)[symKey], map);
    }
    return cloneTarget;
  }
  return clone;
})();
