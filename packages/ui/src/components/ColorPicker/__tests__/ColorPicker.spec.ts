import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { ElColorPicker, ElInput } from 'element-plus';
import { defineComponent, h, nextTick, reactive } from 'vue';
import ColorPicker from '../src/ColorPicker.vue';
import { CommonColorPicker } from '../index';
import { CommonForm } from '../../Form';
import { BaseMap } from '../../CreateComponent/src/baseMap';
import { vunioUIResolver } from '../../../resolver';

const mountedWrappers: ReturnType<typeof mount>[] = [];

function mountColorPicker(props: Record<string, unknown> = {}) {
  const wrapper = mount(ColorPicker, {
    attachTo: document.body,
    props,
  });
  mountedWrappers.push(wrapper);
  return wrapper;
}

function nativeInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find<HTMLInputElement>('.el-input__inner');
}

afterEach(() => {
  mountedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('CommonColorPicker', () => {
  it('renders a swatch and editable input at full-width root', () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F' });

    expect(wrapper.classes()).toContain('CommonColorPicker');
    expect(wrapper.findComponent(ElColorPicker).exists()).toBe(true);
    expect(nativeInput(wrapper).element.value).toBe('#07111F');
  });

  it('synchronizes external modelValue changes', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F' });

    await wrapper.setProps({ modelValue: 'rgba(1, 2, 3, 0.5)' });

    expect(nativeInput(wrapper).element.value).toBe('rgba(1, 2, 3, 0.5)');
    expect(wrapper.findComponent(ElColorPicker).props('modelValue')).toBe('rgba(1, 2, 3, 0.5)');
  });

  it('submits a valid color on Enter', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const input = nativeInput(wrapper);

    await input.setValue('#abc');
    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ABC']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#ABC']);
  });

  it('submits a valid color when composite focus leaves', async () => {
    vi.useFakeTimers();
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const outside = document.createElement('button');
    document.body.append(outside);
    const input = nativeInput(wrapper);

    input.element.focus();
    await input.setValue('rgb(7,17,31)');
    outside.focus();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['rgb(7, 17, 31)']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['rgb(7, 17, 31)']);
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('does not emit change when Enter or blur commits an unchanged color', async () => {
    vi.useFakeTimers();
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const outside = document.createElement('button');
    document.body.append(outside);
    const input = nativeInput(wrapper);

    input.element.focus();
    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();

    outside.focus();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('restores modelValue on Escape', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const input = nativeInput(wrapper);

    await input.setValue('#07');
    await input.trigger('keydown', { key: 'Escape' });

    expect(input.element.value).toBe('#07111F');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('keeps invalid text without polluting modelValue', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const input = nativeInput(wrapper);

    await input.setValue('not-a-color');
    await input.trigger('keydown', { key: 'Enter' });

    expect(input.element.value).toBe('not-a-color');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.classes()).toContain('is-invalid');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('invalid')?.at(-1)).toEqual(['not-a-color']);
  });

  it('updates modelValue while the color panel is active', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F' });

    wrapper.findComponent(ElColorPicker).vm.$emit('activeChange', '#112233');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#112233']);
    expect(nativeInput(wrapper).element.value).toBe('#112233');
  });

  it('forwards showAlpha and predefine to the color panel', () => {
    const predefine = ['#07111F', 'rgba(64, 158, 255, 0.5)'];
    const wrapper = mountColorPicker({ showAlpha: true, predefine });
    const picker = wrapper.findComponent(ElColorPicker);

    expect(picker.props('showAlpha')).toBe(true);
    expect(picker.props('predefine')).toEqual(predefine);
  });

  it('clears from the input when clearable', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F', clearable: true });
    const inputComponent = wrapper
      .findAllComponents(ElInput)
      .find((component) => component.classes().includes('CommonColorPicker__input'));

    expect(inputComponent).toBeDefined();
    inputComponent!.vm.$emit('clear');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['']);
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('disables both input and panel', () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F', disabled: true });

    expect(nativeInput(wrapper).attributes('disabled')).toBeDefined();
    expect(wrapper.findComponent(ElColorPicker).props('disabled')).toBe(true);
  });

  it('keeps readonly text selectable while disabling panel changes', async () => {
    const wrapper = mountColorPicker({ modelValue: '#07111F', readonly: true });
    const input = nativeInput(wrapper);

    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('disabled')).toBeUndefined();
    expect(wrapper.findComponent(ElColorPicker).props('disabled')).toBe(true);

    wrapper.findComponent(ElColorPicker).vm.$emit('activeChange', '#FFFFFF');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('emits composite focus and blur only once across internal focus changes', async () => {
    vi.useFakeTimers();
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const input = nativeInput(wrapper);
    const swatch = wrapper.find<HTMLElement>('.el-color-picker');
    const outside = document.createElement('button');
    document.body.append(outside);

    input.element.focus();
    swatch.element.focus();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toBeUndefined();

    outside.focus();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('keeps composite focus while moving through the teleported panel', async () => {
    vi.useFakeTimers();
    const wrapper = mountColorPicker({ modelValue: '#07111F' });
    const input = nativeInput(wrapper);
    const panelClasses = wrapper.findComponent(ElColorPicker).props('popperClass') as string[];
    const instancePanelClass = panelClasses.at(-1) as string;
    const panel =
      document.querySelector<HTMLElement>(`.${instancePanelClass}`) ??
      document.createElement('div');
    const panelInput = document.createElement('input');
    const outside = document.createElement('button');
    panel.classList.add(...panelClasses);
    panel.append(panelInput);
    if (!panel.isConnected) document.body.append(panel);
    document.body.append(outside);

    input.element.focus();
    panelInput.focus();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toBeUndefined();

    outside.focus();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('renders from CommonForm with component: color', async () => {
    const formData = reactive({ backgroundColor: '#07111F' });
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(CommonForm, {
              modelValue: formData,
              labelPosition: 'top',
              config: [
                {
                  label: '背景颜色',
                  field: 'backgroundColor',
                  component: 'color',
                },
              ],
            });
        },
      }),
      { attachTo: document.body },
    );
    mountedWrappers.push(wrapper);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'CommonColorPicker' }).exists()).toBe(true);
    expect(nativeInput(wrapper).element.value).toBe('#07111F');
  });

  it('is exported, installed, registered as color, and auto-import compatible', () => {
    expect(CommonColorPicker.name).toBe('CommonColorPicker');
    expect(CommonColorPicker.install).toBeTypeOf('function');
    expect(BaseMap.color).toBe(CommonColorPicker);

    const resolver = vunioUIResolver() as {
      resolve: (name: string) => unknown;
    };
    expect(resolver.resolve('CommonColorPicker')).toEqual({
      name: 'CommonColorPicker',
      from: '@vunio/ui',
      sideEffects: '@vunio/ui/style.css',
    });
  });
});
