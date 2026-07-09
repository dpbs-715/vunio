# @vunio/ui

Vue 3 组件库，基于 Vue 3 + TypeScript 构建的现代化组件库。

## 特性

- 🚀 基于 Vue 3 + TypeScript 构建
- 📦 支持按需引入
- 💪 使用 Monorepo + pnpm 工作区管理
- 📝 完整的类型定义
- 🔧 完善的开发工具链

## 安装

```bash
npm install @vunio/ui

yarn add @vunio/ui

pnpm add @vunio/ui
```

## 快速开始

### 全局引入

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

import VUI from '@vunio/ui';
import '@vunio/ui/style.css';

const app = createApp(App);
app.use(VUI);
app.mount('#app');
```

### 按需引入

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

import { Button } from '@vunio/ui';
import '@vunio/ui/style.css';

const app = createApp(App);
app.use(Button);
app.mount('#app');
```

### 与 Element Plus Resolver 一起使用

如果项目同时使用 Element Plus 和 Vunio 的 resolver，请在入口文件全局引入 Element Plus 样式：

```ts
import 'element-plus/dist/index.css';
```

并建议关闭 Element Plus resolver 的按需样式导入：

```ts
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { vunioUIResolver } from '@vunio/ui/resolver';

Components({
  resolvers: [ElementPlusResolver({ importStyle: false }), vunioUIResolver()],
});
```

`vunioUIResolver()` 会自动导入 `@vunio/ui/style.css`。如果关闭了 `vunioUIResolver` 的样式导入，请在入口文件中手动引入 `@vunio/ui/style.css`。

## 使用示例

```vue
<template>
  <VButton @click="open = true">弹窗</VButton>
  <VButton type="primary">按钮</VButton>
  <VButton type="success">按钮</VButton>
  <VButton type="warning">按钮</VButton>
  <VButton type="danger">按钮</VButton>
  <VButton type="info">按钮</VButton>
  <VDialog v-model:open="open">
    <div>弹窗测试2222</div>
  </VDialog>
</template>

<script setup lang="ts">
import { VButton, VDialog } from '@vunio/ui';
import { ref } from 'vue';
const open = ref(false);
</script>
```
