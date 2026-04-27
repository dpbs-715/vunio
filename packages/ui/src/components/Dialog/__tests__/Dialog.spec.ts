import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, getCurrentInstance, h, inject, nextTick } from 'vue';

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('element-plus')>();
  const { defineComponent, h } = await import('vue');

  return {
    ...actual,
    ElDialog: defineComponent({
      name: 'ElDialog',
      inheritAttrs: false,
      props: {
        modelValue: Boolean,
        modalClass: String,
        showClose: Boolean,
        closeOnClickModal: Boolean,
        draggable: Boolean,
        appendToBody: Boolean,
        top: String,
      },
      emits: ['update:modelValue', 'closed'],
      setup(props, { attrs, slots }) {
        return () =>
          h(
            'div',
            {
              ...attrs,
              class: attrs.class,
              'data-modal-class': props.modalClass,
              'data-show-close': String(props.showClose),
              'data-close-on-click-modal': String(props.closeOnClickModal),
              'data-draggable': String(props.draggable),
              'data-append-to-body': String(props.appendToBody),
              'data-top': props.top,
            },
            [
              h('div', { class: 'dialog-body' }, slots.default?.()),
              slots.footer ? h('div', { class: 'dialog-footer' }, slots.footer()) : null,
            ],
          );
      },
    }),
  };
});

import Dialog from '../src/Dialog.vue';
import { renderDialog } from '../src/renderDialog';

describe('CommonDialog', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render default footer buttons', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
    });

    expect(wrapper.find('.dialog-footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('取消');
    expect(wrapper.text()).toContain('确定');
  });

  it('should hide default footer when footerHide is true', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        footerHide: true,
      },
    });

    expect(wrapper.find('.dialog-footer').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('取消');
    expect(wrapper.text()).not.toContain('确定');
  });

  it('should keep custom footer when footerHide is true', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        footerHide: true,
      },
      slots: {
        footer: '<button class="custom-footer">自定义底部</button>',
      },
    });

    expect(wrapper.find('.dialog-footer').exists()).toBe(true);
    expect(wrapper.find('.custom-footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('自定义底部');
    expect(wrapper.text()).not.toContain('取消');
    expect(wrapper.text()).not.toContain('确定');
  });

  it('should preserve user class and CommonDialog class together', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
      attrs: {
        class: 'user-dialog',
      },
    });

    const dialog = wrapper.find('.CommonDialog');
    expect(dialog.exists()).toBe(true);
    expect(dialog.classes()).toContain('user-dialog');
  });

  it('should pass through Element Plus dialog props', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        showClose: true,
        closeOnClickModal: false,
      },
    });

    const dialog = wrapper.find('.CommonDialog');
    expect(dialog.attributes('data-show-close')).toBe('true');
    expect(dialog.attributes('data-close-on-click-modal')).toBe('false');
  });

  it('should pass modalBlur to Element Plus modal class', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        modalBlur: true,
      },
    });

    const dialog = wrapper.find('.CommonDialog');
    expect(dialog.attributes('data-modal-class')).toContain('modalBlur');
  });

  it('should apply CommonDialog default props', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
    });

    const dialog = wrapper.find('.CommonDialog');
    expect(dialog.attributes('data-modal-class')).toContain('modalBlur');
    expect(dialog.attributes('data-draggable')).toBe('true');
    expect(dialog.attributes('data-append-to-body')).toBe('true');
    expect(dialog.attributes('data-top')).toBe('15vh');
  });

  it('should allow explicit boolean props to override CommonDialog defaults', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        modalBlur: false,
        draggable: false,
        appendToBody: false,
      },
    });

    const dialog = wrapper.find('.CommonDialog');
    expect(dialog.attributes('data-modal-class')).not.toContain('modalBlur');
    expect(dialog.attributes('data-draggable')).toBe('false');
    expect(dialog.attributes('data-append-to-body')).toBe('false');
  });

  it('should update merged defaults when boolean prop switches from omitted to explicit false', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
    });

    const dialog = wrapper.find('.CommonDialog');
    expect(dialog.attributes('data-draggable')).toBe('true');

    await wrapper.setProps({
      draggable: false,
    });

    expect(dialog.attributes('data-draggable')).toBe('false');
  });

  it('should inherit app context when renderDialog receives appContext', async () => {
    const injectionKey = Symbol('dialog-context');
    const Content = defineComponent({
      setup() {
        const value = inject(injectionKey, 'missing');
        return () => h('span', { class: 'injected-value' }, value as string);
      },
    });
    const Host = defineComponent({
      setup() {
        const instance = getCurrentInstance();
        renderDialog(Content, undefined, undefined, {
          appContext: instance!.appContext,
        });

        return () => null;
      },
    });

    mount(Host, {
      global: {
        provide: {
          [injectionKey]: 'provided',
        },
      },
    });
    await nextTick();

    expect(document.body.querySelector('.injected-value')?.textContent).toBe('provided');
  });
});
