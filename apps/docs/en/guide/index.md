# Quick Start

## Introduction

vunio is a component library and toolset project based on Vue3 and elementPlus, consisting of the following parts:

- UI Component Library: Provides commonly used UI components, including dynamic components
- Utility Functions: Offers common utility functions
- Hooks: Provides reusable composable functions
- Directives: Offers commonly used directives

## Installation

Install using a package manager:

::: code-group

```bash [npm]
npm install @vunio/ui @vunio/utils @vunio/hooks @vunio/directives
```

```bash [yarn]
yarn add @vunio/ui @vunio/utils @vunio/hooks @vunio/directives
```

```bash [pnpm]
pnpm add @vunio/ui @vunio/utils @vunio/hooks @vunio/directives
```

```bash [bun]
bun add @vunio/ui @vunio/utils @vunio/hooks @vunio/directives
```

:::

## Usage

### UI Components

Global import:

```ts [main.ts]
import { createApp } from 'vue';
import UI from '@vunio/ui';
import '@vunio/ui/style.css';

const app = createApp(App);
app.use(UI);
```

Import on demand:

```ts
import { CommonButton } from '@vunio/ui';
import '@vunio/ui/style.css';

export default {
  components: {
    CommonButton,
  },
};
```

unplugin-vue-components:

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { vunioUIResolver } from '@vunio/ui/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [vunioUIResolver()],
      dts: true,
    }),
  ],
});
```

When using both Element Plus and Vunio resolvers, import the Element Plus stylesheet globally in the app entry:

```ts [main.ts]
import 'element-plus/dist/index.css';
```

It is also recommended to disable style imports in `ElementPlusResolver` to avoid duplicating the global stylesheet:

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { vunioUIResolver } from '@vunio/ui/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [ElementPlusResolver({ importStyle: false }), vunioUIResolver()],
      dts: true,
    }),
  ],
});
```

`vunioUIResolver()` automatically imports `@vunio/ui/style.css`. If you disable style imports in `vunioUIResolver`, import `@vunio/ui/style.css` manually in the app entry.

### Utility Functions

```ts
import { isString } from '@vunio/utils';
console.log(isString('hello')); // true
```

### Hooks

```ts
import { useCounter } from '@vunio/hooks';
const { count, increment, decrement } = useCounter();
```

### Directives

```ts
import { vFocus } from '@vunio/directives';
// Global import
app.directive('focus', vFocus);

// Import on demand
import { vFocus } from '@vunio/directives';
app.directive('focus', vFocus);
```
