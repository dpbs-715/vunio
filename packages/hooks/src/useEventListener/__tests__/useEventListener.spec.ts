import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEventListener } from '../index';
import { nextTick, ref } from 'vue';

describe('useEventListener', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should listen to window events', () => {
    const handler = vi.fn();
    useEventListener('click', handler);

    window.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not throw when window is unavailable', () => {
    vi.stubGlobal('window', undefined);
    const handler = vi.fn();

    expect(() => useEventListener('click', handler)).not.toThrow();
  });

  it('should listen to element events', () => {
    const handler = vi.fn();
    useEventListener(element, 'click', handler);

    element.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should listen to document events', () => {
    const handler = vi.fn();
    useEventListener(document, 'click', handler);

    document.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should handle ref element', async () => {
    const handler = vi.fn();
    const elementRef = ref<HTMLElement | null>(null);

    useEventListener(elementRef, 'click', handler);
    elementRef.value = element;

    await nextTick();

    element.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should pause event listener', async () => {
    const handler = vi.fn();
    const { pause } = useEventListener(element, 'click', handler);

    element.click();
    expect(handler).toHaveBeenCalledTimes(1);

    pause();
    await nextTick();
    element.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should resume event listener', async () => {
    const handler = vi.fn();
    const { pause, resume } = useEventListener(element, 'click', handler);

    element.click();
    expect(handler).toHaveBeenCalledTimes(1);

    pause();
    await nextTick();
    element.click();
    expect(handler).toHaveBeenCalledTimes(1);

    resume();
    await nextTick();
    element.click();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should stop event listener completely', async () => {
    const handler = vi.fn();
    const { stop } = useEventListener(element, 'click', handler);

    element.click();
    expect(handler).toHaveBeenCalledTimes(1);

    stop();
    await nextTick();
    element.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should return correct isActive state', () => {
    const handler = vi.fn();
    const { isActive, pause, resume } = useEventListener(element, 'click', handler);

    expect(isActive.value).toBe(true);

    pause();
    expect(isActive.value).toBe(false);

    resume();
    expect(isActive.value).toBe(true);
  });

  it('should handle element change in ref', async () => {
    const handler = vi.fn();
    const elementRef = ref<HTMLElement | null>(element);

    useEventListener(elementRef, 'click', handler);

    element.click();
    expect(handler).toHaveBeenCalledTimes(1);

    const newElement = document.createElement('div');
    document.body.appendChild(newElement);
    elementRef.value = newElement;

    await nextTick();

    // Old element should not trigger handler
    element.click();
    expect(handler).toHaveBeenCalledTimes(1);

    // New element should trigger handler
    newElement.click();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should handle null ref element', async () => {
    const handler = vi.fn();
    const elementRef = ref<HTMLElement | null>(null);

    useEventListener(elementRef, 'click', handler);

    await nextTick();

    // Should not throw error when element is null
    expect(() => window.dispatchEvent(new Event('click'))).not.toThrow();
  });

  it('should pass event options', () => {
    const handler = vi.fn();
    const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

    useEventListener(element, 'click', handler, { capture: true, once: true });

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', handler, {
      capture: true,
      once: true,
    });
  });
});
