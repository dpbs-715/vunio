# useEventListener

> An elegant event listener management Hook with automatic cleanup and dynamic control.

## Features

- 🎯 Support multiple event targets (Window, Document, HTMLElement, EventTarget)
- 🔄 Automatic event listener cleanup (on component unmount)
- ⏯️ Support pause/resume/stop listening
- 📝 Full TypeScript type support
- 🎨 Support reactive target elements (Ref)

## Basic Usage

### Listen to Window Events

<demo vue="hooks/useEventListener/window.vue" />

### Listen to DOM Element Events

<demo vue="hooks/useEventListener/element.vue" />

### Control Listener

<demo vue="hooks/useEventListener/control.vue" />

## API

### Function Signature

```typescript
// Listen to window events
function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: (evt: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

// Listen to document events
function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  listener: (evt: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

// Listen to HTMLElement events
function useEventListener<E extends HTMLElement, K extends keyof HTMLElementEventMap>(
  target: MaybeElementRef<E>,
  event: K,
  listener: (evt: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

// Listen to generic EventTarget events
function useEventListener<E extends Event = Event>(
  target: MaybeElementRef<EventTarget>,
  event: string,
  listener: (evt: E) => void,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;
```

### Parameters

| Name     | Type                                                 | Required | Description                                        |
| -------- | ---------------------------------------------------- | -------- | -------------------------------------------------- |
| target   | `Window \| Document \| MaybeElementRef<EventTarget>` | No       | Event target, defaults to `window` if not provided |
| event    | `string`                                             | Yes      | Event name                                         |
| listener | `Function`                                           | Yes      | Event handler function                             |
| options  | `boolean \| AddEventListenerOptions`                 | No       | Event listener options                             |

### Return Value

`UseEventListenerControls` object contains the following properties:

| Property | Type                     | Description                                         |
| -------- | ------------------------ | --------------------------------------------------- |
| isActive | `Readonly<Ref<boolean>>` | Whether the listener is currently active            |
| pause    | `() => void`             | Pause event listening                               |
| resume   | `() => void`             | Resume event listening                              |
| stop     | `() => void`             | Completely stop event listening (cannot be resumed) |

## Examples

### Listen to Keyboard Events

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';

useEventListener('keydown', (event) => {
  console.log('Key pressed:', event.key);
});
</script>
```

### Listen to Mouse Movement

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
  <div>Mouse position: {{ position.x }}, {{ position.y }}</div>
</template>
```

### Dynamic Element Listening

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const buttonRef = ref<HTMLButtonElement>();
const clickCount = ref(0);

// Supports reactive ref elements
useEventListener(buttonRef, 'click', () => {
  clickCount.value++;
});
</script>

<template>
  <button ref="buttonRef">Click count: {{ clickCount }}</button>
</template>
```

### Control Listener State

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';
import { ref } from 'vue';

const count = ref(0);

const { pause, resume, isActive, stop } = useEventListener('click', () => {
  count.value++;
});

// Pause listening
function handlePause() {
  pause();
}

// Resume listening
function handleResume() {
  resume();
}

// Stop listening (cannot be resumed)
function handleStop() {
  stop();
}
</script>
```

### Using Options

```vue
<script setup lang="ts">
import { useEventListener } from '@vunio/hooks';

// Use capture phase
useEventListener('click', handler, true);

// Use options object
useEventListener('scroll', handler, {
  passive: true, // Improve scroll performance
  capture: false,
  once: false,
});
</script>
```

## Notes

1. **Automatic Cleanup**: Event listeners are automatically removed on component unmount, no manual cleanup needed
2. **Reactive Target**: Supports `ref`-wrapped elements, automatically updates listener when element changes
3. **Pause vs Stop**: `pause()` can be resumed with `resume()`, `stop()` is permanent
4. **Performance Optimization**: For high-frequency events (like `scroll`, `mousemove`), consider using `passive: true` option
5. **TypeScript**: Event types are automatically inferred based on target and event name, no manual annotation needed

## Type Definitions

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
