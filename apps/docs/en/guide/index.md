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

```ts
// Global import
import { createApp } from 'vue';
import UI from '@vunio/ui';
import '@vunio/ui/style.css';
const app = createApp(App);
app.use(UI);

// Import on demand
import { Button } from '@vunio/ui';
import '@vunio/ui/style.css';
const app = createApp(App);
app.use(Button);
// Components({
//   resolvers: [dUIResolver()],
// })
/// <reference types="@vunio/ui/dist/types/index.d.ts" />
```

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
