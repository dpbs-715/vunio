import { describe, expect, it } from 'vitest';
import { pick } from '../pick';

describe('pick', () => {
  it('should pick simple properties', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should pick nested properties', () => {
    const obj = { a: { b: { c: 3 } }, d: 4 };
    const result = pick(obj, ['a.b.c']);
    expect(result).toEqual({ a: { b: { c: 3 } } });
  });

  it('should handle array paths', () => {
    const obj = { a: { b: { c: 3 } } };
    const result = pick(obj, [['a', 'b', 'c']]);
    expect(result).toEqual({ a: { b: { c: 3 } } });
  });

  it('should pick array elements', () => {
    const obj = { arr: [1, 2, 3, 4] };
    const result = pick(obj, ['arr[0]', 'arr[2]']);
    expect(result).toEqual({ arr: [1, undefined, 3] });
  });

  it('should return empty object when no paths match', () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, ['c', 'd']);
    expect(result).toEqual({});
  });

  it('should ignore undefined values', () => {
    const obj = { a: 1, b: undefined };
    const result = pick(obj, ['a', 'b', 'c']);
    expect(result).toEqual({ a: 1 });
  });

  it('should pick multiple nested paths', () => {
    const obj = {
      user: {
        name: 'Alice',
        age: 30,
        address: {
          city: 'NYC',
          zip: '10001',
        },
      },
      status: 'active',
    };
    const result = pick(obj, ['user.name', 'user.address.city', 'status']);
    expect(result).toEqual({
      user: {
        name: 'Alice',
        address: {
          city: 'NYC',
        },
      },
      status: 'active',
    });
  });

  it('should handle empty paths array', () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, []);
    expect(result).toEqual({});
  });

  it('should not mutate original object', () => {
    const obj = { a: { b: 1 }, c: 2 };
    const result = pick(obj, ['a.b']);
    // Note: pick creates a new structure but values are still references
    // To truly avoid mutation, the picked value itself should not be modified
    expect(result).toEqual({ a: { b: 1 } });
    expect(obj.a.b).toBe(1); // Original unchanged
  });

  it('should pick from complex nested structures', () => {
    const obj = {
      users: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ],
    };
    const result = pick(obj, ['users[0].name', 'users[1].age']);
    expect(result).toEqual({
      users: [{ name: 'Alice' }, { age: 25 }],
    });
  });

  it('should handle falsy values correctly', () => {
    const obj = { a: 0, b: false, c: '', d: null };
    const result = pick(obj, ['a', 'b', 'c', 'd']);
    expect(result).toEqual({ a: 0, b: false, c: '', d: null });
  });

  it('should work with mixed path formats', () => {
    const obj = { a: { b: [1, 2, 3] } };
    const result = pick(obj, [
      ['a', 'b', 0],
      ['a', 'b', 1],
    ]);
    // Using array paths with numeric indices preserves array structure
    expect(result).toEqual({ a: { b: [1, 2] } });
  });

  it('should handle partial paths', () => {
    const obj = { a: { b: { c: 1, d: 2 } } };
    const result = pick(obj, ['a.b.c']);
    expect(result).toEqual({ a: { b: { c: 1 } } });
  });
});
