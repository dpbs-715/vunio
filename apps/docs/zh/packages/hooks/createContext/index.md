# createContext

> 创建类型安全的 Vue provide/inject 上下文工具函数。

## 特性

- 🔒 完整的 TypeScript 类型安全
- 🎯 自动错误提示(未提供 context 时)
- 📝 清晰的错误信息
- 🚀 零依赖,轻量级
- 💡 支持多个 Provider 组件名称
- 🎨 支持可选的默认值(fallback)

## 为什么需要 createContext?

在 Vue 3 中,`provide/inject` 是跨组件层级共享数据的常用方案。但原生 API 存在一些问题:

1. **类型安全性差**: 需要手动定义 `InjectionKey`,容易出错
2. **错误信息不友好**: 忘记提供 context 时,错误信息不明确
3. **重复代码**: 每次都要创建 key、provide、inject 函数

`createContext` 解决了这些问题,提供了更好的开发体验。

## 基础用法

<demo vue="hooks/createContext/basic.vue" />

## API

### 函数签名

```typescript
function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string,
): readonly [
  injectContext: <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ) => T extends null ? ContextValue | null : ContextValue,
  provideContext: (contextValue: ContextValue) => ContextValue,
];
```

### 参数

| 参数名                | 类型                 | 必填 | 说明                                                                                      |
| --------------------- | -------------------- | ---- | ----------------------------------------------------------------------------------------- |
| providerComponentName | `string \| string[]` | 是   | Provider 组件名称,用于错误提示。可以是单个组件名或多个组件名数组                          |
| contextName           | `string`             | 否   | 自定义 context 名称,用于 Symbol description。不传则使用 `${providerComponentName}Context` |

### 返回值

返回一个元组 `[injectContext, provideContext]`:

**injectContext**

注入 context 值的函数。

- **参数**: `fallback?: T` - 可选的默认值,当 context 不存在时使用
- **返回**: Context 值
- **异常**: 如果未提供 fallback 且 context 不存在,则抛出错误

**provideContext**

提供 context 值的函数。

- **参数**: `contextValue: ContextValue` - 要提供的 context 值
- **返回**: 返回提供的 context 值

## 使用示例

### 基础用法

首先在独立文件中定义 context：

```typescript
// contexts/userContext.ts
import { createContext } from '@vunio/hooks';

interface UserContext {
  name: string;
  age: number;
}

// 创建 context（只调用一次）
export const [injectUser, provideUser] = createContext<UserContext>('UserProvider');
```

然后在 Provider 组件中提供值：

```vue
<!-- UserProvider.vue -->
<script setup lang="ts">
import { provideUser } from '@/contexts/userContext';

// 提供 context
provideUser({
  name: 'Alice',
  age: 30,
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>
```

在子组件中注入使用：

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import { injectUser } from '@/contexts/userContext';

// 注入 context
const user = injectUser();
</script>

<template>
  <div>
    <p>姓名: {{ user.name }}</p>
    <p>年龄: {{ user.age }}</p>
  </div>
</template>
```

### 使用默认值(Fallback)

```typescript
// contexts/themeContext.ts
import { createContext } from '@vunio/hooks';

interface ThemeContext {
  color: string;
  mode: 'light' | 'dark';
}

export const [injectTheme, provideTheme] = createContext<ThemeContext>('ThemeProvider');
```

```vue
<script setup lang="ts">
import { injectTheme } from '@/contexts/themeContext';

// 提供默认值,即使没有 Provider 也不会报错
const theme = injectTheme({
  color: 'blue',
  mode: 'light',
});
</script>
```

### 多个 Provider 组件

```typescript
// contexts/formContext.ts
import { createContext } from '@vunio/hooks';

interface FormContext {
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
}

// 支持多个组件都可以提供此 context
export const [injectForm, provideForm] = createContext<FormContext>([
  'Form',
  'FormDialog',
  'FormDrawer',
]);
```

```vue
<script setup lang="ts">
import { provideForm } from '@/contexts/formContext';

// 在任意一个组件中提供
provideForm({ disabled: false, size: 'medium' });
</script>
```

### 自定义 Context 名称

```typescript
// contexts/appContext.ts
import { createContext } from '@vunio/hooks';

interface AppContext {
  locale: string;
  timezone: string;
}

// 使用自定义的 context 名称
export const [injectApp, provideApp] = createContext<AppContext>(
  'App',
  'GlobalAppContext', // 自定义名称
);
```

### 完整示例:主题系统

首先定义 context：

```typescript
// contexts/themeContext.ts
import { createContext } from '@vunio/hooks';

export interface ThemeContext {
  mode: 'light' | 'dark';
  color: string;
  toggleMode: () => void;
  setColor: (color: string) => void;
}

export const [injectTheme, provideTheme] = createContext<ThemeContext>('ThemeProvider');
```

Provider 组件：

```vue
<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { provideTheme } from '@/contexts/themeContext';
import { ref } from 'vue';

const mode = ref<'light' | 'dark'>('light');
const color = ref('blue');

const toggleMode = () => {
  mode.value = mode.value === 'light' ? 'dark' : 'light';
};

const setColor = (newColor: string) => {
  color.value = newColor;
};

// 提供主题 context
provideTheme({
  mode: mode.value,
  color: color.value,
  toggleMode,
  setColor,
});
</script>

<template>
  <div :class="mode">
    <slot />
  </div>
</template>
```

Consumer 组件：

```vue
<!-- ThemeSwitcher.vue -->
<script setup lang="ts">
import { injectTheme } from '@/contexts/themeContext';

const theme = injectTheme();
</script>

<template>
  <div>
    <button @click="theme.toggleMode">
      切换到 {{ theme.mode === 'light' ? '暗色' : '亮色' }} 模式
    </button>
    <select :value="theme.color" @change="theme.setColor($event.target.value)">
      <option value="blue">蓝色</option>
      <option value="red">红色</option>
      <option value="green">绿色</option>
    </select>
  </div>
</template>
```

## 错误处理

### 未提供 Context 时的错误

如果在没有对应 Provider 的情况下调用 `injectContext()`,且没有提供 fallback,会抛出清晰的错误:

```typescript
// 单个组件名
const [injectUser] = createContext<UserContext>('UserProvider');
injectUser(); // Error: Injection `Symbol(UserProviderContext)` not found.
// Component must be used within `UserProvider`

// 多个组件名
const [injectForm] = createContext<FormContext>(['Form', 'FormDialog']);
injectForm(); // Error: Injection `Symbol(...)` not found.
// Component must be used within one of the following components: Form, FormDialog
```

### 安全的默认值

```typescript
// 使用 fallback 避免错误
const user = injectUser({ name: 'Guest', age: 0 }); // 不会抛出错误

// 允许 null 作为 fallback
const user = injectUser(null); // 返回 UserContext | null
```

## 注意事项

1. **⚠️ 重要：只调用一次 `createContext`**: `createContext` 内部使用 Symbol 创建 InjectionKey，每次调用都会创建新的 Symbol。因此必须在组件外部调用一次，然后在不同组件中复用返回的 `[injectContext, provideContext]`。

   ```typescript
   // ❌ 错误：在不同组件中多次调用
   // ThemeProvider.vue
   const [, provideTheme] = createContext('ThemeProvider'); // Symbol 1

   // ThemeConsumer.vue
   const [injectTheme] = createContext('ThemeProvider'); // Symbol 2（不同的 Symbol！）

   // ✅ 正确：在组件外部或单独文件中调用一次
   // contexts/theme.ts
   export const [injectTheme, provideTheme] = createContext('ThemeProvider');

   // 然后在不同组件中导入使用
   import { injectTheme, provideTheme } from '@/contexts/theme';
   ```

2. **类型安全**: `injectContext` 和 `provideContext` 必须使用相同的类型定义
3. **组件层级**: `injectContext` 必须在 `provideContext` 的子组件中调用
4. **默认值**: 如果提供了 fallback,即使没有 Provider 也不会报错
5. **命名规范**: 建议 Provider 组件名使用大写开头的 PascalCase
6. **多个 Provider**: 当有多个同类型的 Provider 时,会使用最近的父级 Provider 的值

## 最佳实践

### 1. ⭐ 在独立文件中定义 Context（强烈推荐）

由于 `createContext` 每次调用都会创建新的 Symbol key，**强烈建议**在独立文件中定义并导出：

```typescript
// contexts/userContext.ts
import { createContext } from '@vunio/hooks';

export interface UserContext {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

// 只调用一次 createContext
export const [injectUser, provideUser] = createContext<UserContext>('UserProvider');
```

然后在不同组件中导入使用：

```vue
<!-- UserProvider.vue -->
<script setup lang="ts">
import { provideUser } from '@/contexts/userContext';

provideUser({
  id: '123',
  name: 'Alice',
  role: 'admin',
});
</script>

<!-- UserProfile.vue -->
<script setup lang="ts">
import { injectUser } from '@/contexts/userContext';

const user = injectUser();
</script>
```

### 2. 导出类型以便复用

```typescript
// contexts/formContext.ts
import { createContext } from '@vunio/hooks';

export interface FormContext {
  disabled: boolean;
  readonly: boolean;
  size: 'small' | 'medium' | 'large';
}

export const [injectForm, provideForm] = createContext<FormContext>('Form');
```

### 3. 提供合理的默认值

```typescript
const DEFAULT_THEME = {
  mode: 'light' as const,
  color: 'blue',
};

const theme = injectTheme(DEFAULT_THEME);
```

## 类型定义

```typescript
/**
 * 创建类型安全的 Vue provide/inject 上下文
 */
function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string,
): readonly [
  /**
   * 注入 context 值
   */
  injectContext: <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ) => T extends null ? ContextValue | null : ContextValue,

  /**
   * 提供 context 值
   */
  provideContext: (contextValue: ContextValue) => ContextValue,
];
```
