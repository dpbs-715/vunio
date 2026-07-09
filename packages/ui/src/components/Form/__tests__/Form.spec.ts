import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, reactive } from 'vue';

vi.mock('~/components/CreateComponent', async () => {
  const { defineComponent, h } = await import('vue');

  return {
    CreateComponent: defineComponent({
      name: 'MockCreateComponent',
      props: {
        config: Object,
        modelValue: [String, Number, Boolean, Object, Array],
      },
      emits: ['update:modelValue'],
      setup(props, { emit }) {
        return () =>
          h('input', {
            class: 'mock-create-component',
            value: props.modelValue ?? '',
            onInput: (event: Event) => {
              emit('update:modelValue', (event.target as HTMLInputElement).value);
            },
          });
      },
    }),
  };
});

vi.mock('~/_utils/dataHandlerClass.ts', () => ({
  DataHandlerClass: class {
    afterInit = () => {};

    initOptions() {
      this.afterInit();
    }

    getLabelByValue(value: string | number) {
      return value === '1' ? '选项1' : '';
    }
  },
}));

import Form from '../src/Form.vue';
import type { CommonFormConfig } from '../src/Form.types';

describe('CommonForm', () => {
  function mountForm(props: Record<string, any>) {
    return mount(
      defineComponent({
        setup() {
          return () => h(Form, props);
        },
      }),
    );
  }

  it('should keep dotted flat keys when the model already owns that key', async () => {
    const formData = reactive<Record<string, any>>({
      'style.color': 'red',
    });
    const config: CommonFormConfig[] = [
      {
        field: 'style.color',
        label: '颜色',
      },
    ];

    const wrapper = mountForm({
      modelValue: formData,
      config,
    });

    const input = wrapper.find<HTMLInputElement>('.mock-create-component');
    expect(input.element.value).toBe('red');

    await input.setValue('blue');

    expect(formData['style.color']).toBe('blue');
    expect(formData.style).toBeUndefined();
  });

  it('should react when a dotted flat key is assigned after mount', async () => {
    const formData = reactive<Record<string, any>>({});
    const config: CommonFormConfig[] = [
      {
        field: 'style.color',
        label: '颜色',
      },
    ];

    const wrapper = mountForm({
      modelValue: formData,
      config,
    });

    expect(wrapper.find<HTMLInputElement>('.mock-create-component').element.value).toBe('');

    Object.assign(formData, {
      'style.color': 'red',
    });
    await nextTick();

    expect(wrapper.find<HTMLInputElement>('.mock-create-component').element.value).toBe('red');
  });

  it('should write nested paths when no matching flat key exists', async () => {
    const formData = reactive<Record<string, any>>({});
    const config: CommonFormConfig[] = [
      {
        field: 'style.color',
        label: '颜色',
      },
    ];

    const wrapper = mountForm({
      modelValue: formData,
      config,
    });

    await wrapper.find('.mock-create-component').setValue('blue');

    expect(formData).toEqual({
      style: {
        color: 'blue',
      },
    });
  });

  it('should create arrays for bracket paths', async () => {
    const formData = reactive<Record<string, any>>({});
    const config: CommonFormConfig[] = [
      {
        field: 'users[0].name',
        label: '用户',
      },
    ];

    const wrapper = mountForm({
      modelValue: formData,
      config,
    });

    await wrapper.find('.mock-create-component').setValue('Alice');

    expect(formData).toEqual({
      users: [
        {
          name: 'Alice',
        },
      ],
    });
  });

  it('should merge custom class with commonForm class on the root el-form', () => {
    const config: CommonFormConfig[] = [
      {
        field: 'name',
        label: '名称',
      },
    ];

    const wrapper = mountForm({
      modelValue: {},
      config,
      class: 'custom-form-class',
    });

    const formEl = wrapper.find('.el-form');
    expect(formEl.classes()).toContain('commonForm');
    expect(formEl.classes()).toContain('custom-form-class');
  });

  it('should clear readonly select label when the field value is emptied', async () => {
    const formData = reactive<Record<string, any>>({
      choice: '1',
    });
    const config: CommonFormConfig[] = [
      {
        field: 'choice',
        label: '选择',
        component: 'commonSelect',
      },
    ];

    const wrapper = mountForm({
      modelValue: formData,
      config,
      readonly: true,
    });

    expect(wrapper.text()).toContain('选项1');

    formData.choice = '';
    await nextTick();

    expect(wrapper.text()).not.toContain('选项1');
    expect(wrapper.text()).toContain('/');
  });
});
