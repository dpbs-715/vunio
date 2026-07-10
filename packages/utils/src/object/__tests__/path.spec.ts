import { describe, expect, it } from 'vitest';
import {
  toPath,
  getByPath,
  getByKeyOrPath,
  hasOwnKey,
  setByPath,
  setByKeyOrPath,
  setByKeyOrPathReversibly,
  unsetByPath,
} from '../path';

describe('path utils', () => {
  describe('toPath', () => {
    it('should convert string path to array', () => {
      expect(toPath('a.b.c')).toEqual(['a', 'b', 'c']);
    });

    it('should handle array path', () => {
      expect(toPath(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle bracket notation', () => {
      expect(toPath('a[0].b[1]')).toEqual(['a', 0, 'b', 1]);
    });

    it('should handle mixed notation', () => {
      expect(toPath('a.b[0].c')).toEqual(['a', 'b', 0, 'c']);
    });

    it('should preserve numeric dot notation as string keys', () => {
      expect(toPath('a.0.b')).toEqual(['a', '0', 'b']);
    });

    it('should filter empty strings', () => {
      expect(toPath('a..b')).toEqual(['a', 'b']);
    });

    it('should handle empty array path', () => {
      expect(toPath([])).toEqual([]);
    });

    it('should handle path with symbols', () => {
      const sym = Symbol('test');
      expect(toPath([sym, 'a'])).toEqual([sym, 'a']);
    });
  });

  describe('hasOwnKey', () => {
    it('should check own keys safely', () => {
      const proto = { inherited: true };
      const obj = Object.create(proto);
      obj.own = true;

      expect(hasOwnKey(obj, 'own')).toBe(true);
      expect(hasOwnKey(obj, 'inherited')).toBe(false);
      expect(hasOwnKey(null, 'own')).toBe(false);
      expect(hasOwnKey(undefined, 'own')).toBe(false);
    });

    it('should support symbol keys', () => {
      const sym = Symbol('own');
      const obj = { [sym]: true };

      expect(hasOwnKey(obj, sym)).toBe(true);
    });
  });

  describe('getByPath', () => {
    it('should get value from simple path', () => {
      const obj = { a: 1, b: 2 };
      expect(getByPath(obj, 'a')).toBe(1);
    });

    it('should get value from nested path', () => {
      const obj = { a: { b: { c: 3 } } };
      expect(getByPath(obj, 'a.b.c')).toBe(3);
    });

    it('should get value from array path', () => {
      const obj = { a: { b: { c: 3 } } };
      expect(getByPath(obj, ['a', 'b', 'c'])).toBe(3);
    });

    it('should get value from array index', () => {
      const obj = { arr: [1, 2, 3] };
      expect(getByPath(obj, 'arr[0]')).toBe(1);
      expect(getByPath(obj, 'arr[2]')).toBe(3);
    });

    it('should return undefined for non-existent path', () => {
      const obj = { a: 1 };
      expect(getByPath(obj, 'b')).toBeUndefined();
      expect(getByPath(obj, 'a.b.c')).toBeUndefined();
    });

    it('should return undefined for null/undefined object', () => {
      expect(getByPath(null, 'a')).toBeUndefined();
      expect(getByPath(undefined, 'a')).toBeUndefined();
    });

    it('should handle complex nested structures', () => {
      const obj = {
        users: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 },
        ],
      };
      expect(getByPath(obj, 'users[0].name')).toBe('Alice');
      expect(getByPath(obj, 'users[1].age')).toBe(25);
    });

    it('should return value even if it is falsy', () => {
      const obj = { a: 0, b: false, c: '' };
      expect(getByPath(obj, 'a')).toBe(0);
      expect(getByPath(obj, 'b')).toBe(false);
      expect(getByPath(obj, 'c')).toBe('');
    });
  });

  describe('getByKeyOrPath', () => {
    it('should prefer own flat keys over path values', () => {
      const obj = {
        'style.color': 'red',
        style: {
          color: 'blue',
        },
      };

      expect(getByKeyOrPath(obj, 'style.color')).toBe('red');
    });

    it('should fall back to path values when flat key is missing', () => {
      const obj = {
        style: {
          color: 'blue',
        },
      };

      expect(getByKeyOrPath(obj, 'style.color')).toBe('blue');
    });

    it('should use array paths directly', () => {
      const obj = {
        'style,color': 'flat',
        style: {
          color: 'blue',
        },
      };

      expect(getByKeyOrPath(obj, ['style', 'color'])).toBe('blue');
    });
  });

  describe('setByPath', () => {
    it('should set value at simple path', () => {
      const obj: any = {};
      setByPath(obj, 'a', 1);
      expect(obj.a).toBe(1);
    });

    it('should set value at nested path', () => {
      const obj: any = {};
      setByPath(obj, 'a.b.c', 3);
      expect(obj.a.b.c).toBe(3);
    });

    it('should create intermediate objects', () => {
      const obj: any = {};
      setByPath(obj, 'a.b.c', 3);
      expect(obj).toEqual({ a: { b: { c: 3 } } });
    });

    it('should create intermediate arrays for numeric keys', () => {
      const obj: any = {};
      setByPath(obj, ['arr', 0], 'first');
      expect(Array.isArray(obj.arr)).toBe(true);
      expect(obj.arr[0]).toBe('first');
    });

    it('should set value using array path', () => {
      const obj: any = {};
      setByPath(obj, ['a', 'b', 'c'], 3);
      expect(obj.a.b.c).toBe(3);
    });

    it('should overwrite existing value', () => {
      const obj: any = { a: { b: { c: 1 } } };
      setByPath(obj, 'a.b.c', 2);
      expect(obj.a.b.c).toBe(2);
    });

    it('should handle mixed object and array paths', () => {
      const obj: any = {};
      setByPath(obj, 'users[0].name', 'Alice');
      expect(Array.isArray(obj.users)).toBe(true);
      expect(obj.users[0].name).toBe('Alice');
    });

    it('should not throw for empty path', () => {
      const obj: any = { a: 1 };
      expect(() => setByPath(obj, [], 'value')).not.toThrow();
    });

    it('should preserve existing properties', () => {
      const obj: any = { a: { x: 1 } };
      setByPath(obj, 'a.y', 2);
      expect(obj.a.x).toBe(1);
      expect(obj.a.y).toBe(2);
    });
  });

  describe('setByKeyOrPath', () => {
    it('should prefer writing own flat keys over path values', () => {
      const obj: any = {
        'style.color': 'red',
        style: {
          color: 'blue',
        },
      };

      setByKeyOrPath(obj, 'style.color', 'green');

      expect(obj['style.color']).toBe('green');
      expect(obj.style.color).toBe('blue');
    });

    it('should fall back to path writes when flat key is missing', () => {
      const obj: any = {};

      setByKeyOrPath(obj, 'users[0].name', 'Alice');

      expect(obj).toEqual({
        users: [
          {
            name: 'Alice',
          },
        ],
      });
    });
  });

  describe('setByKeyOrPathReversibly', () => {
    it('should restore an existing dotted flat key', () => {
      const obj: any = {
        'style.color': 'red',
        style: { color: 'blue' },
      };

      const rollback = setByKeyOrPathReversibly(obj, 'style.color', 'green');

      expect(obj['style.color']).toBe('green');
      expect(obj.style.color).toBe('blue');

      rollback();

      expect(obj['style.color']).toBe('red');
      expect(obj.style.color).toBe('blue');

      obj['style.color'] = 'purple';
      rollback();

      expect(obj['style.color']).toBe('purple');
    });

    it('should remove nested containers and restore array length', () => {
      const obj: any = { users: [] };

      const rollback = setByKeyOrPathReversibly(obj, 'users[0].name', 'Alice');

      expect(obj.users).toEqual([{ name: 'Alice' }]);

      rollback();

      expect(obj.users).toEqual([]);
      expect(obj.users).toHaveLength(0);
    });

    it.each([null, undefined])(
      'should restore an existing nullish parent value: %s',
      (previousValue) => {
        const obj: any = { profile: previousValue };

        const rollback = setByKeyOrPathReversibly(obj, 'profile.name', 'Ada');

        expect(obj.profile).toEqual({ name: 'Ada' });

        rollback();

        expect(hasOwnKey(obj, 'profile')).toBe(true);
        expect(obj.profile).toBe(previousValue);
      },
    );

    it('should preserve later sibling writes when rolling back', () => {
      const obj: any = {};

      const rollback = setByKeyOrPathReversibly(obj, 'profile.name', 'Ada');
      obj.profile.age = 36;

      rollback();

      expect(obj).toEqual({ profile: { age: 36 } });
    });

    it('should clone assigned and restored values', () => {
      const previousValue = { name: 'before' };
      const nextValue = { name: 'after' };
      const obj = { profile: previousValue };

      const rollback = setByKeyOrPathReversibly(obj, 'profile', nextValue);
      nextValue.name = 'mutated';

      expect(obj.profile).toEqual({ name: 'after' });
      expect(obj.profile).not.toBe(nextValue);

      rollback();
      expect(obj.profile).toEqual({ name: 'before' });
      expect(obj.profile).not.toBe(previousValue);
    });

    it('should make rollback idempotent', () => {
      const obj: any = {};
      const rollback = setByKeyOrPathReversibly(obj, 'profile.name', 'Ada');

      rollback();
      rollback();

      expect(obj).toEqual({});
    });
  });

  describe('unsetByPath', () => {
    it('should delete property at simple path', () => {
      const obj: any = { a: 1, b: 2 };
      unsetByPath(obj, 'a');
      expect(obj).toEqual({ b: 2 });
    });

    it('should delete nested property', () => {
      const obj: any = { a: { b: { c: 3 } } };
      unsetByPath(obj, 'a.b.c');
      expect(obj.a.b.c).toBeUndefined();
      expect(obj.a.b).toEqual({});
    });

    it('should delete array element', () => {
      const obj: any = { arr: [1, 2, 3] };
      unsetByPath(obj, 'arr[1]');
      expect(obj.arr[1]).toBeUndefined();
      expect(obj.arr.length).toBe(3); // Array length stays same
    });

    it('should handle non-existent path gracefully', () => {
      const obj: any = { a: 1 };
      expect(() => unsetByPath(obj, 'b')).not.toThrow();
      expect(() => unsetByPath(obj, 'a.b.c')).not.toThrow();
    });

    it('should handle null/undefined object', () => {
      expect(() => unsetByPath(null, 'a')).not.toThrow();
      expect(() => unsetByPath(undefined, 'a')).not.toThrow();
    });

    it('should use array path', () => {
      const obj: any = { a: { b: { c: 3 } } };
      unsetByPath(obj, ['a', 'b', 'c']);
      expect(obj.a.b.c).toBeUndefined();
    });

    it('should handle empty path', () => {
      const obj: any = { a: 1 };
      expect(() => unsetByPath(obj, [])).not.toThrow();
      expect(obj).toEqual({ a: 1 });
    });

    it('should preserve sibling properties', () => {
      const obj: any = { a: { b: 1, c: 2 } };
      unsetByPath(obj, 'a.b');
      expect(obj.a.c).toBe(2);
    });
  });
});
