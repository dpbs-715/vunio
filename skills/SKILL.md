---
name: vunio
description: Vunio 是一个基于 Vue 3.5+ 和 TypeScript 5+ 的现代化组件库，采用 Monorepo 架构。当用户需要使用 @vunio 组件库（包括 @vunio/ui、@vunio/hooks、@vunio/directives、@vunio/utils）开发项目时使用此 skill。触发场景包括：用户提到 "vunio"、"@vunio"、任何 @vunio 包名、或者提到使用 vunio 组件库中的组件（如 CommonButton、CommonTable 等）、hooks、directives 或工具函数时。即使用户没有明确说 "vunio"，只要他们在讨论使用这个组件库的相关内容，也应该使用此 skill。
---

# Vunio 组件库开发助手

你正在帮助开发者使用 Vunio 组件库进行开发。Vunio 是一个基于 Turborepo + Vue 3.5 + TypeScript 5+ 的现代化组件库，采用 Monorepo 架构管理多个包。

## 核心原则

1. **生成可直接使用的代码** - 提供完整、可运行的代码示例，而不是抽象的说明
2. **遵循最佳实践** - 确保生成的代码符合 Vue 3 Composition API 和 TypeScript 的最佳实践
3. **提供完整的上下文** - 包括必要的导入语句、类型定义和配置
4. **考虑依赖关系** - 明确说明需要安装的依赖和 peer dependencies

## Vunio 包结构

Vunio 包含以下几个核心包：

### 1. @vunio/ui - UI 组件库

**特点：**
- 所有组件使用 `Common*` 前缀命名（如 CommonButton、CommonTable）
- 基于 Element Plus 构建
- 支持按需引入和自动导入
- 提供完整的 TypeScript 类型支持

**可用组件：**
- CommonButton - 按钮组件
- CommonTable - 表格组件
- CommonForm - 表单组件
- CommonDialog - 对话框组件
- CommonPagination - 分页组件
- CommonSearch - 搜索组件
- CommonSelect - 选择器组件
- CommonDescriptions - 描述列表组件
- CommonSelectOrDialog - 选择器或对话框组件
- CommonTableLayout - 表格布局组件
- CommonTableFieldsConfig - 表格字段配置组件
- CommonLazyRender - 懒加载渲染组件

**Peer Dependencies：**
```json
{
  "vue": "^3.5.0",
  "element-plus": "^2.6.1",
  "@element-plus/icons-vue": "^2.3.0"
}
```

### 2. @vunio/hooks - Vue 3 Composables

**可用 Hooks：**
- `createContext` - 创建上下文
- `useConfigs` - 配置管理
- `useCounter` - 计数器
- `useEventListener` - 事件监听
- `useIntersectionObserver` - 交叉观察器
- `useMixConfig` - 混合配置
- `useRefCollect` - Ref 收集
- `useRepeatConfig` - 重复配置

### 3. @vunio/directives - Vue 3 指令

**可用指令：**
- `v-focus` - 自动聚焦指令
- `v-trunced` - 文本截断指令

### 4. @vunio/utils - 工具函数库

**分类：**
- `string/` - 字符串操作（capitalize, camelToKebab 等）
- `array/` - 数组工具（diff, sort, chunk, unique 等）
- `object/` - 对象工具（pick, omit, getByPath, setByPath 等）
- `function/` - 函数式编程（curry 等）
- `is/` - 类型检查（isString, isArray, isObject 等）
- `async/` - 异步工具（asyncCache 等）
- `cache/` - 缓存工具（localStorage, sessionStorage, memory）
- `clone/` - 深拷贝工具
- `parse/` - 数据转换工具
- `ep/` - ElementPlus 相关工具

## 安装指南

### 基础安装

生成安装命令时，根据用户需求选择合适的包：

```bash
# 安装所有包
pnpm add @vunio/ui @vunio/hooks @vunio/directives @vunio/utils

# 或按需安装
pnpm add @vunio/ui        # 仅安装 UI 组件
pnpm add @vunio/hooks     # 仅安装 Hooks
pnpm add @vunio/directives # 仅安装指令
pnpm add @vunio/utils     # 仅安装工具函数
```

### Peer Dependencies

如果用户安装 `@vunio/ui`，必须同时安装 peer dependencies：

```bash
pnpm add vue element-plus @element-plus/icons-vue
```

## 使用模式

### 模式 1：全局注册（@vunio/ui）

适用于需要在整个应用中使用多个组件的场景。

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入 Vunio UI
import VunioUI from '@vunio/ui'
import '@vunio/ui/style.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(VunioUI)

app.mount('#app')
```

### 模式 2：按需引入（@vunio/ui）

适用于只需要使用少数几个组件的场景，可以减小打包体积。

```typescript
// 在组件中按需导入
import { CommonButton, CommonTable } from '@vunio/ui'
import '@vunio/ui/style.css'

export default {
  components: {
    CommonButton,
    CommonTable
  }
}
```

### 模式 3：自动导入（推荐）

使用 `unplugin-vue-components` 实现自动导入，无需手动导入组件。

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VunioResolver } from '@vunio/ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VunioResolver()]
    })
  ]
})
```

**注意：** Vunio 提供了自定义 resolver，位于 `@vunio/ui/resolver`。

### 使用 Hooks

```typescript
import { useCounter, useEventListener } from '@vunio/hooks'

export default {
  setup() {
    const { count, increment, decrement } = useCounter(0)

    useEventListener(window, 'resize', () => {
      console.log('Window resized')
    })

    return { count, increment, decrement }
  }
}
```

### 使用指令

```typescript
// 全局注册
import { createApp } from 'vue'
import { vFocus, vTrunced } from '@vunio/directives'

const app = createApp(App)
app.directive('focus', vFocus)
app.directive('trunced', vTrunced)

// 或在组件中局部使用
import { vFocus } from '@vunio/directives'

export default {
  directives: {
    focus: vFocus
  }
}
```

### 使用工具函数

```typescript
import {
  capitalize,
  camelToKebab
} from '@vunio/utils/string'

import {
  diff,
  unique,
  chunk
} from '@vunio/utils/array'

import {
  pick,
  omit,
  getByPath
} from '@vunio/utils/object'

import {
  isString,
  isArray,
  isObject
} from '@vunio/utils/is'

// 使用示例
const str = capitalize('hello') // 'Hello'
const kebab = camelToKebab('myVariable') // 'my-variable'
const uniqueArr = unique([1, 2, 2, 3]) // [1, 2, 3]
const picked = pick({ a: 1, b: 2, c: 3 }, ['a', 'b']) // { a: 1, b: 2 }
```

## 代码生成指南

当用户请求生成代码时，遵循以下原则：

### 1. 提供完整的导入语句

```typescript
// ✅ 好的示例 - 包含所有必要的导入
import { ref } from 'vue'
import { CommonButton, CommonTable } from '@vunio/ui'
import { useCounter } from '@vunio/hooks'
import { isString } from '@vunio/utils/is'
import '@vunio/ui/style.css'

// ❌ 避免 - 缺少导入语句
// 直接使用 CommonButton 而不说明从哪里导入
```

### 2. 包含 TypeScript 类型

```typescript
// ✅ 好的示例 - 提供类型定义
import type { Ref } from 'vue'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const users: Ref<User[]> = ref([])

// ❌ 避免 - 缺少类型定义
const users = ref([])
```

### 3. 使用 Composition API

Vunio 基于 Vue 3.5+，优先使用 Composition API 和 `<script setup>` 语法：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CommonButton } from '@vunio/ui'

const count = ref(0)
const increment = () => count.value++
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <CommonButton @click="increment">Increment</CommonButton>
  </div>
</template>
```

### 4. 说明配置要求

如果代码需要特定的配置（如 Vite 配置、TypeScript 配置），明确说明：

```typescript
// 需要在 vite.config.ts 中配置：
import Components from 'unplugin-vue-components/vite'
import { VunioResolver } from '@vunio/ui/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [VunioResolver()]
    })
  ]
})
```

### 5. 提供使用示例

对于复杂的组件或功能，提供完整的使用示例：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CommonTable } from '@vunio/ui'
import type { TableColumn } from '@vunio/ui'

interface User {
  id: number
  name: string
  email: string
  role: string
}

const columns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'role', label: '角色', width: 100 }
]

const tableData = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'Admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'User' }
])
</script>

<template>
  <CommonTable :data="tableData" :columns="columns" />
</template>
```

## 常见场景

### 场景 1：初始化项目并集成 Vunio

用户说："我想在我的 Vue 项目中使用 vunio 组件库"

**生成的代码应包括：**
1. 安装命令
2. main.ts 配置
3. vite.config.ts 配置（如果使用自动导入）
4. 简单的使用示例

### 场景 2：使用特定组件

用户说："我想用 vunio 的表格组件"

**生成的代码应包括：**
1. 导入语句
2. 类型定义
3. 完整的组件使用示例
4. 必要的配置说明

### 场景 3：使用工具函数

用户说："我需要一个数组去重的函数"

**生成的代码应包括：**
1. 从 @vunio/utils 导入相应的工具函数
2. 使用示例
3. 类型说明

### 场景 4：使用 Hooks

用户说："我想用 vunio 的计数器 hook"

**生成的代码应包括：**
1. 导入 useCounter
2. 在组件中的使用示例
3. 完整的 Vue 组件代码

## 文档参考

Vunio 提供了完整的在线文档：
- 文档地址：https://dpbs-715.github.io/vunio
- GitHub 仓库：https://github.com/dpbs-715/vunio

当用户需要更详细的 API 文档或高级用法时，可以引导他们查看在线文档。

## 注意事项

1. **组件命名规范**：所有 UI 组件都使用 `Common*` 前缀，这是 Vunio 的命名约定
2. **依赖管理**：Vunio 使用 pnpm 作为包管理器，生成安装命令时优先使用 pnpm
3. **样式导入**：使用 @vunio/ui 时，需要导入样式文件 `@vunio/ui/style.css`
4. **Element Plus**：@vunio/ui 基于 Element Plus，需要同时安装 Element Plus 及其图标库
5. **TypeScript**：Vunio 完全使用 TypeScript 编写，生成的代码应包含类型定义
6. **Vue 版本**：Vunio 要求 Vue 3.5+，确保用户的项目满足版本要求

## 输出格式

生成代码时，使用清晰的 Markdown 代码块，并标注语言类型：

```typescript
// TypeScript 代码
```

```vue
<!-- Vue 单文件组件 -->
```

```bash
# Shell 命令
```

对于复杂的集成场景，使用步骤列表组织内容：

1. **安装依赖**
   ```bash
   pnpm add @vunio/ui
   ```

2. **配置 Vite**
   ```typescript
   // vite.config.ts
   ```

3. **使用组件**
   ```vue
   <!-- App.vue -->
   ```

## 总结

你的目标是帮助开发者快速、正确地使用 Vunio 组件库。生成的代码应该是完整的、可运行的，并遵循 Vue 3 和 TypeScript 的最佳实践。始终考虑用户的具体需求，提供最合适的解决方案。
