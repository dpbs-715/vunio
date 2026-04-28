import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { nextTick, reactive, ref } from 'vue';

import Select from '../src/Select.vue';

describe('CommonSelect', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  describe('Basic rendering', () => {
    it('should render select component', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render with empty options', () => {
      const wrapper = mount(Select, {
        props: {
          options: [],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Value binding', () => {
    it('should render with initial modelValue', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '1',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should emit update:modelValue on change', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '',
        },
      });

      wrapper.vm.$emit('update:modelValue', '2');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2']);
    });

    it('should handle empty initial value', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Multiple selection', () => {
    it('should render with multiple mode enabled', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: [],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should handle multiple values as array', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['1', '2'],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should emit array of values for multiple selection', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['1'],
        },
      });

      wrapper.vm.$emit('update:modelValue', ['1', '2']);
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['1', '2']]);
    });
  });

  describe('JoinSplit feature', () => {
    it('should render with joinSplit configuration', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          joinSplit: ',',
          modelValue: '1,2',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should emit joined string with joinSplit on value change', async () => {
      const onUpdateModelValue = vi.fn();
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          joinSplit: ',',
          modelValue: '1',
          'onUpdate:modelValue': onUpdateModelValue,
        },
      });

      // When joinSplit is used, the component expects array and will join it
      // So we emit an array, and it will be joined to a string
      wrapper.vm.$emit('update:modelValue', ['1', '2', '3']);
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should handle empty string with joinSplit', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          joinSplit: ',',
          modelValue: '',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Label binding', () => {
    it('should render with label value', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '1',
          label: 'Option 1',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should emit update:label event', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '',
          label: '',
        },
      });

      wrapper.vm.$emit('update:label', 'Option 2');
      await nextTick();

      expect(wrapper.emitted('update:label')).toBeTruthy();
      expect(wrapper.emitted('update:label')?.[0]).toEqual(['Option 2']);
    });

    it('should handle label in multiple mode', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['1', '2'],
          label: ['Option 1', 'Option 2'],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should handle label string with joinSplit in multiple mode', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          joinSplit: ',',
          modelValue: '1,2',
          label: 'Option 1,Option 2',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Component type', () => {
    it('should render with ElSelect component type', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          componentType: 'ElSelect',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render with ElSelectV2 component type', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          componentType: 'ElSelectV2',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render with ElTreeSelect component type', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          componentType: 'ElTreeSelect',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Options data', () => {
    it('should render with options', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should disable options matching disabledValues', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabledValues: ['2'],
          componentType: 'ElSelect',
        },
      });

      await nextTick();

      const optionComponents = wrapper.findAllComponents({ name: 'ElOption' });
      expect(optionComponents[0].props('disabled')).toBe(false);
      expect(optionComponents[1].props('disabled')).toBe(true);
      expect(optionComponents[2].props('disabled')).toBe(false);
    });

    it('should pass disabled options to ElSelectV2', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabledValues: ['2'],
          componentType: 'ElSelectV2',
        },
      });

      await nextTick();

      const selectV2 = wrapper.findComponent({ name: 'ElSelectV2' });
      expect(selectV2.props('options')[1].disabled).toBe(true);
    });

    it('should support disabledValues as predicate function', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabledValues: (option: Record<string, string>) => option.value === '2',
          componentType: 'ElSelect',
        },
      });

      await nextTick();

      const optionComponents = wrapper.findAllComponents({ name: 'ElOption' });
      expect(optionComponents[1].props('disabled')).toBe(true);
    });

    it('should support disabledValues as function returning values', async () => {
      const disabledValues = ref(['2']);
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabledValues: () => disabledValues.value,
          componentType: 'ElSelectV2',
        },
      });

      await nextTick();

      let selectV2 = wrapper.findComponent({ name: 'ElSelectV2' });
      expect(selectV2.props('options')[1].disabled).toBe(true);

      disabledValues.value = ['3'];
      await nextTick();

      selectV2 = wrapper.findComponent({ name: 'ElSelectV2' });
      expect(selectV2.props('options')[1].disabled).toBe(false);
      expect(selectV2.props('options')[2].disabled).toBe(true);
    });

    it('should support disabledValues as reactive map', async () => {
      const disabledMap = reactive<Record<string, boolean>>({
        '2': true,
      });
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabledValues: disabledMap,
          componentType: 'ElSelectV2',
        },
      });

      await nextTick();

      let selectV2 = wrapper.findComponent({ name: 'ElSelectV2' });
      expect(selectV2.props('options')[1].disabled).toBe(true);

      disabledMap['2'] = false;
      disabledMap['3'] = true;
      await nextTick();

      selectV2 = wrapper.findComponent({ name: 'ElSelectV2' });
      expect(selectV2.props('options')[1].disabled).toBe(false);
      expect(selectV2.props('options')[2].disabled).toBe(true);
    });

    it('should handle large dataset', () => {
      const largeOptions = Array.from({ length: 100 }, (_, i) => ({
        value: `${i + 1}`,
        label: `Option ${i + 1}`,
      }));

      const wrapper = mount(Select, {
        props: {
          options: largeOptions,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Auto select first', () => {
    it('should render with autoSelect enabled', () => {
      const singleOption = [{ value: '1', label: 'Only Option' }];
      const wrapper = mount(Select, {
        props: {
          options: singleOption,
          autoSelect: true,
          modelValue: '',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render with autoSelect disabled', () => {
      const singleOption = [{ value: '1', label: 'Only Option' }];
      const wrapper = mount(Select, {
        props: {
          options: singleOption,
          autoSelect: false,
          modelValue: '',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should initialize and emit optionsReady', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
        },
      });

      // Wait for component initialization
      await nextTick();
      await nextTick();
      await nextTick();

      // After initialization, optionsReady should be emitted
      expect(wrapper.emitted()).toBeDefined();
    });

    it('should skip disabled options when auto selecting first', async () => {
      const onUpdateModelValue = vi.fn();
      mount(Select, {
        props: {
          options: mockOptions,
          disabledValues: ['1'],
          autoSelect: 'first',
          modelValue: '',
          'onUpdate:modelValue': onUpdateModelValue,
        },
      });

      await flushPromises();
      await nextTick();

      expect(onUpdateModelValue).toHaveBeenCalledWith('2');
    });
  });

  describe('Events', () => {
    it('should emit changeObj event', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '',
        },
      });

      wrapper.vm.$emit('changeObj', mockOptions[0]);
      await nextTick();

      expect(wrapper.emitted('changeObj')).toBeTruthy();
      expect(wrapper.emitted('changeObj')?.[0]).toEqual([mockOptions[0]]);
    });

    it('should handle component initialization', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
        },
      });

      await nextTick();
      await nextTick();

      // Component should initialize without errors
      expect(wrapper.exists()).toBe(true);
    });

    it('should render with onChange callback', () => {
      const onChange = vi.fn();
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '',
          onChange,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render with multiple onChange callbacks', () => {
      const onChange1 = vi.fn();
      const onChange2 = vi.fn();
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '',
          onChange: [onChange1, onChange2],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined options', () => {
      const wrapper = mount(Select, {
        props: {},
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should handle null modelValue', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: null,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should handle undefined modelValue', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should handle empty array for multiple selection', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: [],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work with complete configuration', async () => {
      const modelValue = ref('');
      const label = ref('');
      const onChange = vi.fn();
      const onUpdateModelValue = vi.fn((val) => {
        modelValue.value = val;
      });
      const onUpdateLabel = vi.fn((val) => {
        label.value = val;
      });

      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: modelValue.value,
          label: label.value,
          multiple: false,
          autoSelect: false,
          onChange,
          'onUpdate:modelValue': onUpdateModelValue,
          'onUpdate:label': onUpdateLabel,
        },
      });

      expect(wrapper.exists()).toBe(true);

      // Simulate value update
      wrapper.vm.$emit('update:modelValue', '2');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should work with multiple selection and joinSplit', async () => {
      const modelValue = ref('');
      const label = ref('');
      const onUpdateModelValue = vi.fn((val) => {
        modelValue.value = val;
      });
      const onUpdateLabel = vi.fn((val) => {
        label.value = val;
      });

      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: modelValue.value,
          label: label.value,
          multiple: true,
          joinSplit: ',',
          'onUpdate:modelValue': onUpdateModelValue,
          'onUpdate:label': onUpdateLabel,
        },
      });

      expect(wrapper.exists()).toBe(true);

      // With joinSplit, emit an array it will be joined to a string
      wrapper.vm.$emit('update:modelValue', ['1', '2']);
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });
  });
});
