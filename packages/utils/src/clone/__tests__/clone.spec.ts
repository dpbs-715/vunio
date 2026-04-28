import { describe, expect, it } from 'vitest';
import { deepClone } from '../index';

describe('clone utils', () => {
  describe('deepClone', () => {
    it('should clone primitives', () => {
      expect(deepClone(123)).toBe(123);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone simple objects', () => {
      const obj = { a: 1, b: 2 };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj); // 不同引用
    });

    it('should clone nested objects', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.b.d).not.toBe(obj.b.d);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone Date objects', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned.getTime()).toBe(date.getTime());
    });

    it('should clone RegExp objects', () => {
      const regex = /test/gi;
      const cloned = deepClone(regex);
      expect(cloned).toEqual(regex);
      expect(cloned).not.toBe(regex);
      expect(cloned.source).toBe('test');
      expect(cloned.flags).toBe('gi');
    });

    it('should clone Map objects', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', { nested: 'value2' }],
      ]);
      const cloned = deepClone(map);
      expect(cloned).toEqual(map);
      expect(cloned).not.toBe(map);
      expect(cloned.get('key2')).not.toBe(map.get('key2'));
    });

    it('should clone Set objects', () => {
      const set = new Set([1, 2, { a: 3 }]);
      const cloned = deepClone(set);
      expect(cloned.size).toBe(set.size);
      expect(cloned).not.toBe(set);
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const cloned = deepClone(obj);
      expect(cloned.a).toBe(1);
      expect(cloned.self).toBe(cloned);
      expect(cloned).not.toBe(obj);
    });

    it('should handle nested circular references', () => {
      const obj: any = {
        a: {
          b: 1,
        },
      };
      obj.a.parent = obj;

      const cloned = deepClone(obj);

      expect(cloned.a.b).toBe(1);
      expect(cloned.a.parent).toBe(cloned);
      expect(cloned.a).not.toBe(obj.a);
    });

    it('should preserve Vue reactive values by reference', () => {
      const computedLike: any = {
        __v_isRef: true,
        effect: {},
      };
      computedLike.effect.computed = computedLike;
      const reactiveLike: any = {
        __v_isReactive: true,
        value: {
          disabled: true,
        },
      };
      const obj = {
        props: {
          disabledValues: computedLike,
          disabledMap: reactiveLike,
        },
      };

      const cloned = deepClone(obj);

      expect(cloned).not.toBe(obj);
      expect(cloned.props).not.toBe(obj.props);
      expect(cloned.props.disabledValues).toBe(computedLike);
      expect(cloned.props.disabledMap).toBe(reactiveLike);
    });

    it('should clone objects with Symbol properties', () => {
      const sym = Symbol('test');
      const obj = {
        [sym]: 'symbol value',
        regular: 'regular value',
      };
      const cloned = deepClone(obj);
      expect(cloned[sym]).toBe('symbol value');
      expect(cloned.regular).toBe('regular value');
      expect(cloned).not.toBe(obj);
    });

    it('should preserve prototype chain', () => {
      class CustomClass {
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }
      const instance = new CustomClass(42);
      const cloned = deepClone(instance);
      expect(cloned.value).toBe(42);
      expect(cloned).toBeInstanceOf(CustomClass);
      expect(cloned).not.toBe(instance);
    });

    it('should clone complex nested structures', () => {
      const complex = {
        string: 'hello',
        number: 123,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 2, [3, 4]],
        object: {
          nested: {
            deep: 'value',
          },
        },
        date: new Date('2024-01-01'),
        regex: /test/gi,
        map: new Map([['key', 'value']]),
        set: new Set([1, 2, 3]),
      };
      const cloned = deepClone(complex);
      expect(cloned).toEqual(complex);
      expect(cloned).not.toBe(complex);
      expect(cloned.array).not.toBe(complex.array);
      expect(cloned.object).not.toBe(complex.object);
      expect(cloned.date).not.toBe(complex.date);
      expect(cloned.regex).not.toBe(complex.regex);
      expect(cloned.map).not.toBe(complex.map);
      expect(cloned.set).not.toBe(complex.set);
    });
  });
});
