# 函数式工具

## curry

> 柯里化函数，将多参数函数转换为单参数函数序列，支持占位符功能。

### 基础用法

```ts
import { curry } from 'dlib-utils';

const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

// 逐个传参
curriedAdd(1)(2)(3); // 6

// 部分传参
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6

// 一次传完
curriedAdd(1, 2, 3); // 6
```

### 部分应用

```ts
import { curry } from 'dlib-utils';

const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

// 创建部分应用的函数
const add5 = curriedAdd(5);
add5(3, 2); // 10
add5(1)(1); // 7

const add5And3 = curriedAdd(5, 3);
add5And3(2); // 10
```

### 占位符功能

使用 `__` 占位符可以跳过某些参数位置，稍后再填充。

```ts
import { curry, __ } from 'dlib-utils';

// 固定第二个参数
const divide = (a: number, b: number) => a / b;
const curriedDivide = curry(divide);

const divideBy2 = curriedDivide(__, 2);
divideBy2(10); // 5 (10 / 2)
divideBy2(8); // 4 (8 / 2)

// 固定第一个参数
const subtract = (a: number, b: number) => a - b;
const curriedSubtract = curry(subtract);

const subtractFrom10 = curriedSubtract(10, __);
subtractFrom10(3); // 7 (10 - 3)
subtractFrom10(5); // 5 (10 - 5)

// 多个占位符
const format = (prefix: string, value: string, suffix: string) => `${prefix}${value}${suffix}`;
const curriedFormat = curry(format);

const addBrackets = curriedFormat('[', __, ']');
addBrackets('Hello'); // "[Hello]"
addBrackets('World'); // "[World]"
```

### 复杂场景

```ts
import { curry, __ } from 'dlib-utils';

const replace = (search: string, replacement: string, text: string) =>
  text.replace(search, replacement);
const curriedReplace = curry(replace);

// 固定文本，替换不同内容
const replaceInHello = curriedReplace(__, __, 'Hello World');
replaceInHello('World', 'Vue'); // "Hello Vue"
replaceInHello('Hello', 'Hi'); // "Hi World"

// 固定替换规则，应用到不同文本
const replaceWorldWithVue = curriedReplace('World', 'Vue', __);
replaceWorldWithVue('Hello World'); // "Hello Vue"
replaceWorldWithVue('World is big'); // "Vue is big"
```

### 数组操作

```ts
import { curry, __ } from 'dlib-utils';

// map 操作
const multiply = curry((a: number, b: number) => a * b);
const double = multiply(2);
const triple = multiply(3);

[1, 2, 3].map(double); // [2, 4, 6]
[1, 2, 3].map(triple); // [3, 6, 9]

// filter 操作
const greaterThan = curry((min: number, value: number) => value > min);
const greaterThan5 = greaterThan(5);

[3, 7, 12, 5, 15].filter(greaterThan5); // [7, 12, 15]

// 使用占位符创建"除以某数"的函数
const divide = curry((a: number, b: number) => a / b);
const divideBy = (divisor: number) => divide(__, divisor);

const divideBy2 = divideBy(2);
[10, 20, 30].map(divideBy2); // [5, 10, 15]
```

### 函数组合

```ts
import { curry } from 'dlib-utils';

const add = curry((a: number, b: number) => a + b);
const multiply = curry((a: number, b: number) => a * b);

const add5 = add(5);
const double = multiply(2);

// 组合: (x + 5) * 2
const addThenDouble = (x: number) => double(add5(x));
addThenDouble(3); // 16 ((3 + 5) * 2)
```

### 自定义参数数量

```ts
import { curry } from 'dlib-utils';

// 对于使用 rest 参数的函数，需要手动指定参数数量
const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);

// 注意：TypeScript 无法为 rest 参数函数正确推导类型，需要使用类型断言
const curriedSum = curry(sum, 3) as any;

curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6
```

### API

#### curry

```ts
function curry<F extends AnyFn>(fn: F, arity?: number): Curry<F>;
```

**参数：**

- `fn` - 需要柯里化的函数
- `arity` - (可选) 函数的参数数量，默认为 `fn.length`

**返回值：**

- 柯里化后的函数

#### \_\_

```ts
const __: unique symbol;
```

占位符常量，用于在柯里化函数中跳过参数位置。

### 类型支持

```ts
import { curry, type Curry, type Placeholder } from 'dlib-utils';

// Curry 类型
type AddFn = (a: number, b: number, c: number) => number;
const add: AddFn = (a, b, c) => a + b + c;
const curriedAdd: Curry<AddFn> = curry(add);

// Placeholder 类型
const placeholder: Placeholder = __;
```

### 注意事项

1. 占位符 `__` 会在收集到足够的非占位符参数后被转换为 `undefined`
2. 如果函数使用了 rest 参数（`...args`），必须手动指定 `arity` 参数
3. 柯里化后的函数会保留 `this` 上下文（当一次性传入所有参数时）
4. 占位符的填充顺序是从左到右

### TypeScript 类型限制

当使用以下情况时，TypeScript 无法正确推导柯里化后的类型，需要使用 `as any` 类型断言：

- 函数使用 rest 参数（`...args`）
- 自定义 arity 大于函数实际参数数量

```ts
// ❌ TypeScript 类型错误
const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
const curriedSum = curry(sum, 3);
curriedSum(1)(2)(3); // TS2349: Type Number has no call signatures

// ✅ 使用类型断言
const curriedSum = curry(sum, 3) as any;
curriedSum(1)(2)(3); // 正常工作
```
