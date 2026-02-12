import { describe, expect, it } from 'vitest';
import { curry, __ } from '../curry';

describe('curry', () => {
  describe('basic currying', () => {
    it('should curry a function with 2 parameters', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);

      expect(curriedAdd(1)(2)).toBe(3);
      expect(curriedAdd(1, 2)).toBe(3);
    });

    it('should curry a function with 3 parameters', () => {
      const add3 = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd3 = curry(add3);

      expect(curriedAdd3(1)(2)(3)).toBe(6);
      expect(curriedAdd3(1, 2)(3)).toBe(6);
      expect(curriedAdd3(1)(2, 3)).toBe(6);
      expect(curriedAdd3(1, 2, 3)).toBe(6);
    });

    it('should curry a function with 4 parameters', () => {
      const multiply = (a: number, b: number, c: number, d: number) => a * b * c * d;
      const curriedMultiply = curry(multiply);

      expect(curriedMultiply(2)(3)(4)(5)).toBe(120);
      expect(curriedMultiply(2, 3)(4, 5)).toBe(120);
      expect(curriedMultiply(2)(3, 4, 5)).toBe(120);
      expect(curriedMultiply(2, 3, 4, 5)).toBe(120);
    });
  });

  describe('partial application', () => {
    it('should support partial application', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd = curry(add);

      const add5 = curriedAdd(5);
      expect(add5(3, 2)).toBe(10);
      expect(add5(1)(1)).toBe(7);

      const add5And3 = curriedAdd(5, 3);
      expect(add5And3(2)).toBe(10);
    });

    it('should create reusable partially applied functions', () => {
      const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
      const curriedGreet = curry(greet);

      const sayHello = curriedGreet('Hello');
      expect(sayHello('Alice')).toBe('Hello, Alice!');
      expect(sayHello('Bob')).toBe('Hello, Bob!');

      const sayGoodbye = curriedGreet('Goodbye');
      expect(sayGoodbye('Charlie')).toBe('Goodbye, Charlie!');
    });
  });

  describe('different data types', () => {
    it('should work with strings', () => {
      const join = (a: string, b: string, c: string) => `${a}-${b}-${c}`;
      const curriedJoin = curry(join);

      expect(curriedJoin('a')('b')('c')).toBe('a-b-c');
      expect(curriedJoin('hello', 'world')('!')).toBe('hello-world-!');
    });

    it('should work with arrays', () => {
      const concat = (a: number[], b: number[], c: number[]) => [...a, ...b, ...c];
      const curriedConcat = curry(concat);

      expect(curriedConcat([1])([2])([3])).toEqual([1, 2, 3]);
      expect(curriedConcat([1, 2], [3])([4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with objects', () => {
      const merge = (a: object, b: object, c: object) => ({ ...a, ...b, ...c });
      const curriedMerge = curry(merge);

      expect(curriedMerge({ x: 1 })({ y: 2 })({ z: 3 })).toEqual({ x: 1, y: 2, z: 3 });
    });

    it('should work with mixed types', () => {
      const format = (template: string, value: number, suffix: string) =>
        `${template}${value}${suffix}`;
      const curriedFormat = curry(format);

      const priceFormatter = curriedFormat('$');
      expect(priceFormatter(100, ' USD')).toBe('$100 USD');
      expect(priceFormatter(50)(' EUR')).toBe('$50 EUR');
    });
  });

  describe('custom arity', () => {
    it('should support custom arity parameter', () => {
      const fn = (...args: number[]) => args.reduce((sum, n) => sum + n, 0);
      // 对于 rest 参数函数，TypeScript 无法正确推导类型，需要使用 as any
      const curriedFn = curry(fn, 3) as any;

      expect(curriedFn(1)(2)(3)).toBe(6);
      expect(curriedFn(1, 2)(3)).toBe(6);
    });

    it('should handle arity larger than actual parameters', () => {
      const add = (a: number, b: number) => a + b;
      // 当 arity 大于实际参数数量时，需要使用 as any
      const curriedAdd = curry(add, 3) as any;

      // 需要3个参数才会执行
      const result = curriedAdd(1)(2)(undefined);
      expect(result).toBe(3); // 1 + 2 + undefined (coerced to NaN)
    });

    it('should handle arity 0', () => {
      const getValue = () => 42;
      const curriedGetValue = curry(getValue, 0);

      expect(curriedGetValue()).toBe(42);
    });
  });

  describe('context preservation', () => {
    it('should preserve this context when called with apply/call', () => {
      const obj = {
        value: 10,
        add: function (a: number, b: number) {
          return this.value + a + b;
        },
      };

      const curriedAdd = curry(obj.add) as any;
      // 一次性传入所有参数时可以保留 this
      expect(curriedAdd.call(obj, 5, 3)).toBe(18);
    });

    it('should work with bound functions for context preservation', () => {
      const obj = {
        value: 10,
        add: function (a: number, b: number) {
          return this.value + a + b;
        },
      };

      // 如果需要保留上下文，可以先绑定后柯里化
      const boundAdd = obj.add.bind(obj);
      const curriedAdd = curry(boundAdd);
      expect(curriedAdd(5)(3)).toBe(18);
    });
  });

  describe('edge cases', () => {
    it('should handle single parameter functions', () => {
      const double = (x: number) => x * 2;
      const curriedDouble = curry(double);

      expect(curriedDouble(5)).toBe(10);
    });

    it('should handle zero parameter functions', () => {
      const getValue = () => 42;
      const curriedGetValue = curry(getValue);

      expect(curriedGetValue()).toBe(42);
    });

    it('should handle more parameters than required', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);

      // 传入超过需要的参数，额外参数会被忽略
      expect(curriedAdd(1, 2, 3 as any)).toBe(3);
    });

    it('should work with nullish values', () => {
      const identity = (a: any, b: any, c: any) => [a, b, c];
      const curriedIdentity = curry(identity);

      expect(curriedIdentity(null)(undefined)(0)).toEqual([null, undefined, 0]);
    });
  });

  describe('placeholder functionality', () => {
    it('should support placeholder in first position', () => {
      const divide = (a: number, b: number) => a / b;
      const curriedDivide = curry(divide);

      const divideBy2 = curriedDivide(__, 2);
      expect(divideBy2(10)).toBe(5); // 10 / 2
      expect(divideBy2(8)).toBe(4); // 8 / 2
    });

    it('should support placeholder in second position', () => {
      const subtract = (a: number, b: number) => a - b;
      const curriedSubtract = curry(subtract);

      const subtractFrom10 = curriedSubtract(10, __);
      expect(subtractFrom10(3)).toBe(7); // 10 - 3
      expect(subtractFrom10(5)).toBe(5); // 10 - 5
    });

    it('should support multiple placeholders', () => {
      const add3 = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd3 = curry(add3);

      const addWith2InMiddle = curriedAdd3(__, 2, __);
      expect(addWith2InMiddle(1, 3)).toBe(6); // 1 + 2 + 3
      expect(addWith2InMiddle(5, 10)).toBe(17); // 5 + 2 + 10
    });

    it('should support all placeholders', () => {
      const multiply = (a: number, b: number, c: number) => a * b * c;
      const curriedMultiply = curry(multiply);

      const allPlaceholders = curriedMultiply(__, __, __);
      expect(allPlaceholders(2, 3, 4)).toBe(24);
      expect(allPlaceholders(1)(2)(3)).toBe(6);
    });

    it('should replace placeholders in order', () => {
      const format = (a: string, b: string, c: string) => `${a}-${b}-${c}`;
      const curriedFormat = curry(format);

      const f1 = curriedFormat(__, 'B', __);
      expect(f1('A', 'C')).toBe('A-B-C');

      const f2 = curriedFormat('X', __, __);
      expect(f2('Y', 'Z')).toBe('X-Y-Z');
    });

    it('should work with complex placeholder patterns', () => {
      const replace = (search: string, replacement: string, text: string) =>
        text.replace(search, replacement);
      const curriedReplace = curry(replace);

      // 固定文本，替换不同的内容
      const replaceInHello = curriedReplace(__, __, 'Hello World');
      expect(replaceInHello('World', 'Vue')).toBe('Hello Vue');
      expect(replaceInHello('Hello', 'Hi')).toBe('Hi World');

      // 固定替换，在不同文本中查找
      const replaceWorldWithVue = curriedReplace('World', 'Vue', __);
      expect(replaceWorldWithVue('Hello World')).toBe('Hello Vue');
      expect(replaceWorldWithVue('World is big')).toBe('Vue is big');
    });

    it('should combine placeholders with partial application', () => {
      const calc = (a: number, b: number, c: number, d: number) => (a + b) * (c + d);
      const curriedCalc = curry(calc);

      const step1 = curriedCalc(__, 2, __, 4);
      const step2 = step1(1, __);
      expect(step2(3)).toBe(21); // (1 + 2) * (3 + 4) = 3 * 7 = 21
    });

    it('should handle placeholder with single parameter function', () => {
      const double = (x: number) => x * 2;
      const curriedDouble = curry(double);

      const withPlaceholder = curriedDouble(__);
      expect(withPlaceholder(5)).toBe(10);
    });

    it('should work in practical array operations', () => {
      const divide = (a: number, b: number) => a / b;
      const curriedDivide = curry(divide);

      // 创建一个 "除以某数" 的函数
      const divideBy = (divisor: number) => curriedDivide(__, divisor);

      const divideBy2 = divideBy(2);
      expect([10, 20, 30].map(divideBy2)).toEqual([5, 10, 15]);

      const divideBy5 = divideBy(5);
      expect([10, 20, 30].map(divideBy5)).toEqual([2, 4, 6]);
    });

    it('should handle placeholder with 0 arity', () => {
      const getValue = () => 42;
      const curriedGetValue = curry(getValue, 0);
      expect(curriedGetValue()).toBe(42);
    });
  });

  describe('practical examples', () => {
    it('should be useful for map operations', () => {
      const multiply = (a: number, b: number) => a * b;
      const curriedMultiply = curry(multiply);

      const double = curriedMultiply(2);
      const triple = curriedMultiply(3);

      expect([1, 2, 3].map(double)).toEqual([2, 4, 6]);
      expect([1, 2, 3].map(triple)).toEqual([3, 6, 9]);
    });

    it('should be useful for filter operations', () => {
      const greaterThan = (min: number, value: number) => value > min;
      const curriedGreaterThan = curry(greaterThan);

      const greaterThan5 = curriedGreaterThan(5);
      const greaterThan10 = curriedGreaterThan(10);

      expect([3, 7, 12, 5, 15].filter(greaterThan5)).toEqual([7, 12, 15]);
      expect([3, 7, 12, 5, 15].filter(greaterThan10)).toEqual([12, 15]);
    });

    it('should compose well with other curried functions', () => {
      const add = (a: number, b: number) => a + b;
      const multiply = (a: number, b: number) => a * b;

      const curriedAdd = curry(add);
      const curriedMultiply = curry(multiply);

      const add5 = curriedAdd(5);
      const double = curriedMultiply(2);

      // (x + 5) * 2
      const addThenDouble = (x: number) => double(add5(x));
      expect(addThenDouble(3)).toBe(16); // (3 + 5) * 2 = 16
    });
  });
});
