# Function Utilities

## curry

> Currying function that transforms multi-parameter functions into a sequence of single-parameter functions, with placeholder support.

### Basic Usage

```ts
import { curry } from '@vunio/utils';

const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

// Pass arguments one by one
curriedAdd(1)(2)(3); // 6

// Partial application
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6

// Pass all at once
curriedAdd(1, 2, 3); // 6
```

### Partial Application

```ts
import { curry } from '@vunio/utils';

const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

// Create partially applied functions
const add5 = curriedAdd(5);
add5(3, 2); // 10
add5(1)(1); // 7

const add5And3 = curriedAdd(5, 3);
add5And3(2); // 10
```

### Placeholder Feature

Use the `__` placeholder to skip certain parameter positions and fill them later.

```ts
import { curry, __ } from '@vunio/utils';

// Fix the second parameter
const divide = (a: number, b: number) => a / b;
const curriedDivide = curry(divide);

const divideBy2 = curriedDivide(__, 2);
divideBy2(10); // 5 (10 / 2)
divideBy2(8); // 4 (8 / 2)

// Fix the first parameter
const subtract = (a: number, b: number) => a - b;
const curriedSubtract = curry(subtract);

const subtractFrom10 = curriedSubtract(10, __);
subtractFrom10(3); // 7 (10 - 3)
subtractFrom10(5); // 5 (10 - 5)

// Multiple placeholders
const format = (prefix: string, value: string, suffix: string) => `${prefix}${value}${suffix}`;
const curriedFormat = curry(format);

const addBrackets = curriedFormat('[', __, ']');
addBrackets('Hello'); // "[Hello]"
addBrackets('World'); // "[World]"
```

### Advanced Scenarios

```ts
import { curry, __ } from '@vunio/utils';

const replace = (search: string, replacement: string, text: string) =>
  text.replace(search, replacement);
const curriedReplace = curry(replace);

// Fix text, replace different content
const replaceInHello = curriedReplace(__, __, 'Hello World');
replaceInHello('World', 'Vue'); // "Hello Vue"
replaceInHello('Hello', 'Hi'); // "Hi World"

// Fix replacement rule, apply to different texts
const replaceWorldWithVue = curriedReplace('World', 'Vue', __);
replaceWorldWithVue('Hello World'); // "Hello Vue"
replaceWorldWithVue('World is big'); // "Vue is big"
```

### Array Operations

```ts
import { curry, __ } from '@vunio/utils';

// map operation
const multiply = curry((a: number, b: number) => a * b);
const double = multiply(2);
const triple = multiply(3);

[1, 2, 3].map(double); // [2, 4, 6]
[1, 2, 3].map(triple); // [3, 6, 9]

// filter operation
const greaterThan = curry((min: number, value: number) => value > min);
const greaterThan5 = greaterThan(5);

[3, 7, 12, 5, 15].filter(greaterThan5); // [7, 12, 15]

// Create "divide by" functions using placeholder
const divide = curry((a: number, b: number) => a / b);
const divideBy = (divisor: number) => divide(__, divisor);

const divideBy2 = divideBy(2);
[10, 20, 30].map(divideBy2); // [5, 10, 15]
```

### Function Composition

```ts
import { curry } from '@vunio/utils';

const add = curry((a: number, b: number) => a + b);
const multiply = curry((a: number, b: number) => a * b);

const add5 = add(5);
const double = multiply(2);

// Compose: (x + 5) * 2
const addThenDouble = (x: number) => double(add5(x));
addThenDouble(3); // 16 ((3 + 5) * 2)
```

### Custom Arity

```ts
import { curry } from '@vunio/utils';

// For functions using rest parameters, you need to manually specify the arity
const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);

// Note: TypeScript cannot correctly infer types for rest parameter functions, use type assertion
const curriedSum = curry(sum, 3) as any;

curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6
```

### API

#### curry

```ts
function curry<F extends AnyFn>(fn: F, arity?: number): Curry<F>;
```

**Parameters:**

- `fn` - The function to curry
- `arity` - (Optional) Number of parameters, defaults to `fn.length`

**Returns:**

- The curried function

#### \_\_

```ts
const __: unique symbol;
```

Placeholder constant used to skip parameter positions in curried functions.

### Type Support

```ts
import { curry, type Curry, type Placeholder } from '@vunio/utils';

// Curry type
type AddFn = (a: number, b: number, c: number) => number;
const add: AddFn = (a, b, c) => a + b + c;
const curriedAdd: Curry<AddFn> = curry(add);

// Placeholder type
const placeholder: Placeholder = __;
```

### Notes

1. Placeholders `__` are converted to `undefined` after enough non-placeholder arguments are collected
2. If the function uses rest parameters (`...args`), you must manually specify the `arity` parameter
3. The curried function preserves the `this` context (when all arguments are passed at once)
4. Placeholders are filled in left-to-right order

### TypeScript Type Limitations

TypeScript cannot correctly infer curried function types in the following cases, requiring `as any` type assertion:

- Functions using rest parameters (`...args`)
- Custom arity exceeds the actual number of function parameters

```ts
// ❌ TypeScript type error
const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
const curriedSum = curry(sum, 3);
curriedSum(1)(2)(3); // TS2349: Type Number has no call signatures

// ✅ Use type assertion
const curriedSum = curry(sum, 3) as any;
curriedSum(1)(2)(3); // Works correctly
```
