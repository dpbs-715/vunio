# 快速开始

## 介绍

vunio 是一个基于 Vue3、elementPlus 的组件库和工具集项目，包含以下几个部分：

- UI 组件库：提供常用的 UI 组件，包含动态组件
- 工具函数：提供常用的工具函数
- Hooks：提供可复用的组合式函数
- Directives：提供常用的指令

## 安装

使用包管理器安装：

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

## 使用

### UI 组件

> 三种导入方式

全局引入：

```ts [main.ts]
import { createApp } from 'vue';
import UI from '@vunio/ui';
import '@vunio/ui/style.css';

const app = createApp(App);
app.use(UI);
```

按需引入：

```ts
import { CommonButton } from '@vunio/ui';
import '@vunio/ui/style.css';

export default {
  components: {
    CommonButton,
  },
};
```

unplugin-vue-components 方式：

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

### 工具函数

```ts
import { isString } from '@vunio/utils';
console.log(isString('hello')); // true
```

### Hooks

```ts
import { useCounter } from '@vunio/hooks';
const { count, increment, decrement } = useCounter();
```

### 指令

```ts
import { vFocus } from '@vunio/directives';
// 全局引入
app.directive('focus', vFocus);

// 按需引入
import { vFocus } from '@vunio/directives';
app.directive('focus', vFocus);
```
