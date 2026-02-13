# UI 包测试指南

## 已完成的工作

### ✅ 测试环境配置

1. **vitest.config.ts** - Vitest 配置
   - 支持 Vue 单文件组件
   - JSX 支持
   - 路径别名配置
   - 覆盖率配置

2. **vitest.setup.ts** - 测试环境设置
   - 全局注册 Element Plus
   - 抑制测试环境中的预期警告

3. **package.json** - 添加测试脚本
   - `pnpm test` - 运行测试
   - `pnpm test:watch` - 监听模式
   - `pnpm test:coverage` - 生成覆盖率报告

### ✅ Button 组件完整测试 (18 个测试用例)

测试覆盖：

- ✅ 基础渲染和插槽
- ✅ Props (type, size, round, circle, plain, disabled, loading)
- ✅ 点击事件处理
- ✅ Promise loading 状态
- ✅ 图标显示
- ✅ 错误处理
- ✅ 多个 class 组合

### ✅ CreateComponent 组件完整测试 (38 个测试用例)

#### ComMap.spec.ts (26 个测试用例)

- ✅ Singleton 模式验证
- ✅ 组件注册 (register/registerBatch)
- ✅ 组件获取 (多种输入类型)
- ✅ 组件检查 (has)
- ✅ 组件注销 (unregister/unregisterBatch)
- ✅ 清空功能 (clear)
- ✅ HTML 标签识别
- ✅ BaseMap 初始化
- ✅ 复杂场景测试

#### CreateComponent.spec.ts (12 个测试用例)

- ✅ 基础渲染 (字符串、注册组件、错误处理)
- ✅ Props 处理 (普通 props、事件 props)
- ✅ Children 渲染
- ✅ Slots 处理
- ✅ v-model 支持
- ✅ 组件函数类型
- ✅ 边界情况

## 如何为其他组件添加测试

### 测试文件位置

```
packages/ui/src/components/[ComponentName]/__tests__/[ComponentName].spec.ts
```

### 基础测试模板

\`\`\`typescript
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YourComponent from '../src/YourComponent.vue';

describe('YourComponent', () => {
it('should render correctly', () => {
const wrapper = mount(YourComponent);
expect(wrapper.exists()).toBe(true);
});

it('should handle props', () => {
const wrapper = mount(YourComponent, {
props: {
someProp: 'value',
},
});
expect(wrapper.props('someProp')).toBe('value');
});

it('should emit events', async () => {
const wrapper = mount(YourComponent);
await wrapper.find('button').trigger('click');
expect(wrapper.emitted('click')).toBeTruthy();
});
});
\`\`\`

## 组件测试优先级建议

### 🔥 高优先级 - 核心组件

1. ✅ **Button** - 已完成 (18 tests)
2. ✅ **CreateComponent** - 已完成 (38 tests: 26 ComMap + 12 CreateComponent)
3. **Form** - 表单核心，建议测试：
   - 字段渲染
   - 数据绑定
   - 验证功能

4. **Table** - 表格核心，建议测试：
   - 数据渲染
   - 排序功能
   - 分页集成

### ⭐ 中优先级 - 常用组件

5. **Search** - 搜索功能
6. **Select** - 选择器
7. **Pagination** - 分页器
8. **Dialog** - 弹窗

### 📝 低优先级 - 复杂/辅助组件

9. **Descriptions** - 描述列表
10. **TableLayout** - 表格布局（复杂）
11. **SelectOrDialog** - 组合组件（复杂）
12. **TableFieldsConfig** - 配置组件
13. **Foma** - 动态表单（复杂）

## 测试策略建议

### 1. 单元测试 - 测试组件独立功能

- Props 传递
- 事件触发
- 插槽渲染
- 计算属性
- 方法调用

### 2. 集成测试 - 测试组件交互

- 父子组件通信
- Element Plus 组件集成
- 状态管理

### 3. Mock 策略

#### Mock Element Plus 组件

\`\`\`typescript
vi.mock('element-plus', () => ({
ElButton: {
name: 'ElButton',
template: '<button><slot /></button>',
},
// ... 其他组件
}));
\`\`\`

#### Mock 异步操作

\`\`\`typescript
const mockFetch = vi.fn().mockResolvedValue({ data: [] });
\`\`\`

## 运行测试

\`\`\`bash

# 运行所有测试

pnpm -F @vunio/ui run test

# 监听模式

pnpm -F @vunio/ui run test:watch

# 生成覆盖率报告

pnpm -F @vunio/ui run test:coverage

# 运行特定文件

pnpm -F @vunio/ui run test Button.spec.ts
\`\`\`

## 测试覆盖率目标

- 核心组件：≥ 80%
- 常用组件：≥ 60%
- 辅助组件：≥ 40%

## 注意事项

1. **避免测试实现细节**
   - ❌ 不要测试内部变量名
   - ✅ 测试用户可见的行为

2. **使用语义化的查询**
   - ❌ `wrapper.find('.class')`
   - ✅ `wrapper.find('button[type="submit"]')`

3. **异步操作处理**
   - 使用 `await nextTick()`
   - 使用 `vi.waitFor()`

4. **清理副作用**
   - 在 `afterEach` 中清理 mock
   - 恢复控制台方法

## 参考资源

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Element Plus Testing](https://element-plus.org/en-US/guide/dev-guide.html#testing)

## 当前状态

- ✅ 测试环境已配置完成
- ✅ Button 组件测试完成 (18 tests)
- ✅ CreateComponent 组件测试完成 (38 tests)
  - ComMap 组件注册系统 (26 tests)
  - CreateComponent 动态组件创建 (12 tests)
- ⏳ 其他组件待添加

**测试覆盖率**: 56 个测试用例全部通过

根据你的实际需求和时间，可以逐步为其他组件添加测试用例。
