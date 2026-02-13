# createContext

> Create type-safe Vue provide/inject context utility function.

## Features

- 🔒 Full TypeScript type safety
- 🎯 Automatic error hints (when context is not provided)
- 📝 Clear error messages
- 🚀 Zero dependencies, lightweight
- 💡 Support multiple Provider component names
- 🎨 Support optional fallback values

## Why createContext?

In Vue 3, `provide/inject` is a common pattern for sharing data across component hierarchies. However, the native API has some issues:

1. **Poor Type Safety**: Requires manually defining `InjectionKey`, error-prone
2. **Unfriendly Error Messages**: When forgetting to provide context, error messages are unclear
3. **Repetitive Code**: Need to create key, provide, inject functions every time

`createContext` solves these problems and provides a better developer experience.

## Basic Usage

<demo vue="hooks/createContext/basic.vue" />

## API

### Function Signature

```text
function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string
): readonly [
  injectContext: <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T
  ) => T extends null ? ContextValue | null : ContextValue,
  provideContext: (contextValue: ContextValue) => ContextValue
]
```

### Parameters

| Name                  | Type                 | Required | Description                                                                               |
| --------------------- | -------------------- | -------- | ----------------------------------------------------------------------------------------- |
| providerComponentName | `string \| string[]` | Yes      | Provider component name(s) for error messages. Can be a single name or array of names     |
| contextName           | `string`             | No       | Custom context name for Symbol description. Defaults to `${providerComponentName}Context` |

### Return Value

Returns a tuple `[injectContext, provideContext]`:

**injectContext**

Function to inject context value.

- **Parameters**: `fallback?: T` - Optional default value to use when context doesn't exist
- **Returns**: Context value
- **Throws**: If no fallback provided and context doesn't exist, throws an error

**provideContext**

Function to provide context value.

- **Parameters**: `contextValue: ContextValue` - Context value to provide
- **Returns**: Returns the provided context value

## Examples

### Basic Usage

First, define the context in a separate file:

```typescript
// contexts/userContext.ts
import { createContext } from '@vunio/hooks';

interface UserContext {
  name: string;
  age: number;
}

// Create context (call only once)
export const [injectUser, provideUser] = createContext<UserContext>('UserProvider');
```

Then provide the value in the Provider component:

```vue
<!-- UserProvider.vue -->
<script setup lang="ts">
import { provideUser } from '@/contexts/userContext';

// Provide context
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

Inject and use in child components:

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import { injectUser } from '@/contexts/userContext';

// Inject context
const user = injectUser();
</script>

<template>
  <div>
    <p>Name: {{ user.name }}</p>
    <p>Age: {{ user.age }}</p>
  </div>
</template>
```

### Using Fallback Values

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

// Provide fallback value, won't throw error even without Provider
const theme = injectTheme({
  color: 'blue',
  mode: 'light',
});
</script>
```

### Multiple Provider Components

```typescript
// contexts/formContext.ts
import { createContext } from '@vunio/hooks';

interface FormContext {
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
}

// Support multiple components that can provide this context
export const [injectForm, provideForm] = createContext<FormContext>([
  'Form',
  'FormDialog',
  'FormDrawer',
]);
```

```vue
<script setup lang="ts">
import { provideForm } from '@/contexts/formContext';

// Provide in any of these components
provideForm({ disabled: false, size: 'medium' });
</script>
```

### Custom Context Name

```typescript
// contexts/appContext.ts
import { createContext } from '@vunio/hooks';

interface AppContext {
  locale: string;
  timezone: string;
}

// Use custom context name
export const [injectApp, provideApp] = createContext<AppContext>(
  'App',
  'GlobalAppContext', // Custom name
);
```

### Complete Example: Theme System

First, define the context:

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

Provider component:

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

// Provide theme context
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

Consumer component:

```vue
<!-- ThemeSwitcher.vue -->
<script setup lang="ts">
import { injectTheme } from '@/contexts/themeContext';

const theme = injectTheme();
</script>

<template>
  <div>
    <button @click="theme.toggleMode">
      Switch to {{ theme.mode === 'light' ? 'dark' : 'light' }} mode
    </button>
    <select :value="theme.color" @change="theme.setColor($event.target.value)">
      <option value="blue">Blue</option>
      <option value="red">Red</option>
      <option value="green">Green</option>
    </select>
  </div>
</template>
```

## Error Handling

### Error When Context Not Provided

If `injectContext()` is called without a corresponding Provider and no fallback is provided, it throws a clear error:

```typescript
// Single component name
const [injectUser] = createContext<UserContext>('UserProvider');
injectUser(); // Error: Injection `Symbol(UserProviderContext)` not found.
// Component must be used within `UserProvider`

// Multiple component names
const [injectForm] = createContext<FormContext>(['Form', 'FormDialog']);
injectForm(); // Error: Injection `Symbol(...)` not found.
// Component must be used within one of the following components: Form, FormDialog
```

### Safe Fallback Values

```typescript
// Use fallback to avoid errors
const user = injectUser({ name: 'Guest', age: 0 }); // Won't throw error

// Allow null as fallback
const user = injectUser(null); // Returns UserContext | null
```

## Notes

1. **⚠️ Important: Call `createContext` only once**: `createContext` uses Symbol to create InjectionKey internally. Each call creates a new Symbol. Therefore, you must call it once outside components and reuse the returned `[injectContext, provideContext]` in different components.

   ```typescript
   // ❌ Wrong: Calling multiple times in different components
   // ThemeProvider.vue
   const [, provideTheme] = createContext('ThemeProvider'); // Symbol 1

   // ThemeConsumer.vue
   const [injectTheme] = createContext('ThemeProvider'); // Symbol 2 (different Symbol!)

   // ✅ Correct: Call once outside components or in a separate file
   // contexts/theme.ts
   export const [injectTheme, provideTheme] = createContext('ThemeProvider');

   // Then import and use in different components
   import { injectTheme, provideTheme } from '@/contexts/theme';
   ```

2. **Type Safety**: `injectContext` and `provideContext` must use the same type definition
3. **Component Hierarchy**: `injectContext` must be called in a child component of `provideContext`
4. **Fallback Values**: If fallback is provided, won't throw error even without Provider
5. **Naming Convention**: Provider component names should use PascalCase with uppercase first letter
6. **Multiple Providers**: When multiple Providers of the same type exist, uses the nearest parent Provider's value

## Best Practices

### 1. ⭐ Define Context in Separate Files (Strongly Recommended)

Since `createContext` creates a new Symbol key each time it's called, it's **strongly recommended** to define and export it in a separate file:

```typescript
// contexts/userContext.ts
import { createContext } from '@vunio/hooks';

export interface UserContext {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

// Call createContext only once
export const [injectUser, provideUser] = createContext<UserContext>('UserProvider');
```

Then import and use in different components:

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

### 2. Export Types for Reuse

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

### 3. Provide Reasonable Default Values

```typescript
const DEFAULT_THEME = {
  mode: 'light' as const,
  color: 'blue',
};

const theme = injectTheme(DEFAULT_THEME);
```

## Type Definitions

```typescript
/**
 * Create type-safe Vue provide/inject context
 */
function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string,
): readonly [
  /**
   * Inject context value
   */
  injectContext: <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ) => T extends null ? ContextValue | null : ContextValue,

  /**
   * Provide context value
   */
  provideContext: (contextValue: ContextValue) => ContextValue,
];
```
