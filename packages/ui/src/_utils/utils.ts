import { isObject } from '@vunio/utils/src';

type PlainObject = Record<string, any>;

export const deepMerge = (() => {
  let seen = new WeakMap<object, object>();
  function merge(target: PlainObject, source: PlainObject): PlainObject {
    if (seen.has(source)) {
      return seen.get(source) as PlainObject;
    }
    seen.set(source, target);
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      const sourceVal = source[key];
      const targetVal = target[key];
      if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
        target[key] = targetVal.concat(sourceVal);
      } else if (isObject(sourceVal) && isObject(targetVal)) {
        merge(targetVal, sourceVal);
      } else if (Array.isArray(sourceVal)) {
        target[key] = sourceVal.slice();
      } else if (isObject(sourceVal)) {
        target[key] = merge({}, sourceVal);
      } else {
        target[key] = sourceVal;
      }
    }
    return target;
  }
  return (target: PlainObject, source: PlainObject) => {
    seen = new WeakMap(); // 每次调用前清空，避免跨调用污染
    return merge(target, source);
  };
})();
