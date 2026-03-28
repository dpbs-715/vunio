import type { Ref } from 'vue';
import { ref, unref, watch } from 'vue';

type MaybeRef<T> = T | Ref<T>;
type MaybeElementRef<T extends EventTarget = EventTarget> = MaybeRef<T | null | undefined>;

// 通用事件监听器类型
interface GeneralEventListener<E = Event> {
  (evt: E): void;
}

/**
 * useEventListener 返回的控制对象
 */
export interface UseEventListenerControls {
  /** 当前监听器是否处于激活状态 */
  isActive: Readonly<Ref<boolean>>;
  /** 暂停事件监听 */
  pause: () => void;
  /** 恢复事件监听 */
  resume: () => void;
  /** 完全停止事件监听（无法恢复） */
  stop: () => void;
}

/**
 * 监听 window 事件
 */
export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: GeneralEventListener<WindowEventMap[K]>,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

/**
 * 监听 document 事件
 */
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  listener: GeneralEventListener<DocumentEventMap[K]>,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

/**
 * 监听 HTMLElement 事件
 */
export function useEventListener<E extends HTMLElement, K extends keyof HTMLElementEventMap>(
  target: MaybeElementRef<E>,
  event: K,
  listener: GeneralEventListener<HTMLElementEventMap[K]>,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

/**
 * 监听通用 EventTarget 事件
 */
export function useEventListener<E extends Event = Event>(
  target: MaybeElementRef<EventTarget>,
  event: string,
  listener: GeneralEventListener<E>,
  options?: boolean | AddEventListenerOptions,
): UseEventListenerControls;

export function useEventListener(...args: any[]): UseEventListenerControls {
  let target: MaybeElementRef<EventTarget> | undefined;
  let event: string;
  let listener: EventListener;
  let options: boolean | AddEventListenerOptions | undefined;

  if (typeof args[0] === 'string') {
    [event, listener, options] = args;
    target = typeof window !== 'undefined' ? window : undefined;
  } else {
    [target, event, listener, options] = args;
  }

  const isActive = ref(true);

  const stopWatch = watch(
    [() => unref(target), isActive],
    ([element, active], _, onCleanup) => {
      if (!active || !element) return;

      element.addEventListener(event, listener, options);

      onCleanup(() => {
        element.removeEventListener(event, listener, options);
      });
    },
    {
      immediate: true,
    },
  );

  return {
    isActive,
    pause() {
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop() {
      stopWatch();
    },
  };
}
