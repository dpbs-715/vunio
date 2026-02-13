# useEventListener

> 优雅的事件监听管理 Hook,支持自动清理和动态控制。

## 特性

- 🎯 支持多种事件目标(Window、Document、HTMLElement、EventTarget)
- 🔄 自动清理事件监听器(组件卸载时)
- ⏯️ 支持暂停/恢复/停止监听
- 📝 完整的 TypeScript 类型支持
- 🎨 支持响应式目标元素(Ref)

## 基础用法

### 监听 Window 事件

<demo vue="hooks/useEventListener/window.vue" />

### 监听 DOM 元素事件

<demo vue="hooks/useEventListener/element.vue" />

### 控制监听器

<demo vue="hooks/useEventListener/control.vue" />

## API

### 函数签名

```typescript
// 监听 window 事件
function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: (evt: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

// 监听 document 事件
function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  listener: (evt: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

// 监听 HTMLElement 事件
function useEventListener<E extends HTMLElement, K extends keyof HTMLElementEventMap>(
  target: MaybeElementRef<E>,
  event: K,
  listener: (evt: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

// 监听通用 EventTarget 事件
function useEventListener<E extends Event = Event>(
  target: MaybeElementRef<EventTarget>,
  event: string,
  listener: (evt: E) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;
```

### 参数

| 参数名   | 类型                                                 | 必填 | 说明                           |
| -------- | ---------------------------------------------------- | ---- | ------------------------------ |
| target   | `Window \| Document \| MaybeElementRef<EventTarget>` | 否   | 事件目标,不传则默认为 `window` |
| event    | `string`                                             | 是   | 事件名称                       |
| listener | `Function`                                           | 是   | 事件处理函数                   |
| options  | `boolean \| AddEventListenerOptions`                 | 否   | 事件监听选项                   |

### 返回值

`UseEventListenerControls` 对象包含以下属性:

| 属性名   | 类型                     | 说明                       |
| -------- | ------------------------ | -------------------------- |
| isActive | `Readonly<Ref<boolean>>` | 当前监听器是否处于激活状态 |
| pause    | `() => void`             | 暂停事件监听               |
| resume   | `() => void`             | 恢复事件监听               |
| stop     | `() => void`             | 完全停止事件监听(无法恢复) |

## 使用示例

### 监听键盘事件

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';

useEventListener('keydown', (event) => {
  console.log('按下的键:', event.key);
});
</script>
```

### 监听鼠标移动

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const position = ref({ x: 0, y: 0 });

useEventListener('mousemove', (event) => {
  position.value = {
    x: event.clientX,
    y: event.clientY,
  };
});
</script>

<template>
  <div>鼠标位置: {{ position.x }}, {{ position.y }}</div>
</template>
```

### 动态元素监听

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const buttonRef = ref<HTMLButtonElement>();
const clickCount = ref(0);

// 支持响应式的 ref 元素
useEventListener(buttonRef, 'click', () => {
  clickCount.value++;
});
</script>

<template>
  <button ref="buttonRef">点击次数: {{ clickCount }}</button>
</template>
```

### 控制监听器状态

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const count = ref(0);

const { pause, resume, isActive, stop } = useEventListener('click', () => {
  count.value++;
});

// 暂停监听
function handlePause() {
  pause();
}

// 恢复监听
function handleResume() {
  resume();
}

// 停止监听(不可恢复)
function handleStop() {
  stop();
}
</script>
```

### 使用选项

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';

// 使用捕获阶段
useEventListener('click', handler, true);

// 使用选项对象
useEventListener('scroll', handler, {
  passive: true, // 提升滚动性能
  capture: false,
  once: false,
});
</script>
```

## 注意事项

1. **自动清理**: 组件卸载时会自动移除事件监听器,无需手动清理
2. **响应式目标**: 支持 `ref` 包裹的元素,元素变化时会自动更新监听
3. **暂停vs停止**: `pause()` 可以通过 `resume()` 恢复,`stop()` 则是永久停止
4. **性能优化**: 对于高频事件(如 `scroll`、`mousemove`),建议使用 `passive: true` 选项
5. **TypeScript**: 事件类型会根据目标和事件名自动推导,无需手动标注

## 类型定义

```typescript
type MaybeRef<T> = T | Ref<T>;
type MaybeElementRef<T extends EventTarget = EventTarget> = MaybeRef<T | null | undefined>;

interface UseEventListenerControls {
  isActive: Readonly<Ref<boolean>>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}
```
