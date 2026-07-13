import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

// Import directly to avoid module loading issues
import { ComMap } from '~/components/CreateComponent/src/comMap';
import componentFactory from '~/components/CreateComponent/src/componentFactory';
import { BaseMap } from '~/components/CreateComponent/src/baseMap';

// Use the factory directly instead of the installed component
const CreateComponent = componentFactory;

describe('CreateComponent', () => {
  let comMapInstance: ComMap;

  beforeAll(() => {
    // Get the singleton instance
    comMapInstance = ComMap.getInstance();
  });

  beforeEach(() => {
    // Clear components before each test
    comMapInstance.clear();
    // Re-register base components (HTML tags, etc.)
    comMapInstance.registerBatch(BaseMap);
  });

  describe('Basic rendering', () => {
    it('should render with a simple string config', () => {
      const wrapper = mount(CreateComponent, {
        props: {
          config: 'Hello World',
        },
      });

      expect(wrapper.text()).toBe('Hello World');
    });

    it('should render registered component', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', { class: 'test-component' }, 'Test Content');
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
          },
        },
      });

      expect(wrapper.find('.test-component').exists()).toBe(true);
      expect(wrapper.text()).toBe('Test Content');
    });

    it('should show error message for unregistered component', () => {
      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'UnregisteredComponent',
          },
        },
      });

      expect(wrapper.text()).toContain('组件未注册: UnregisteredComponent');
    });

    it('should show custom empty text for unregistered component', () => {
      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'UnregisteredComponent',
          },
          emptyText: 'Custom Empty Text',
        },
      });

      expect(wrapper.text()).toBe('Custom Empty Text');
    });
  });

  describe('Props handling', () => {
    it('should pass props to child component', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        props: {
          title: String,
          count: Number,
        },
        setup(props) {
          return () => h('div', `${props.title}: ${props.count}`);
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
            props: {
              title: 'Counter',
              count: 10,
            },
          },
        },
      });

      expect(wrapper.text()).toBe('Counter: 10');
    });

    it('should handle event props starting with "on"', () => {
      const onClick = vi.fn();
      const TestComponent = defineComponent({
        name: 'TestComponent',
        props: {
          onClick: Function,
        },
        setup(props) {
          return () =>
            h(
              'button',
              {
                onClick: props.onClick,
              },
              'Click me',
            );
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
            props: {
              onClick,
            },
          },
        },
      });

      wrapper.find('button').trigger('click');
      expect(onClick).toHaveBeenCalled();
    });

    it('should render radio options as standard radios by default', () => {
      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'radioGroup',
            props: {
              options: [{ label: 'Option 1', value: '1' }],
            },
          },
        },
      });

      expect(wrapper.find('.el-radio').exists()).toBe(true);
      expect(wrapper.find('.el-radio-button').exists()).toBe(false);
    });

    it('should render radio options as buttons when radioType is button', () => {
      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'radioGroup',
            props: {
              radioType: 'button',
              options: [{ label: 'Option 1', value: '1' }],
            },
          },
        },
      });

      expect(wrapper.find('.el-radio-button').exists()).toBe(true);
      expect(wrapper.attributes('radiotype')).toBeUndefined();
    });
  });

  describe('Children rendering', () => {
    it('should render string children', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup(_, { slots }) {
          return () => h('div', { class: 'wrapper' }, slots.default?.());
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
            children: 'Child Content',
          },
        },
      });

      expect(wrapper.find('.wrapper').text()).toBe('Child Content');
    });
  });

  describe('Slots handling', () => {
    it('should handle custom slots from config', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup(_, { slots }) {
          return () =>
            h('div', [
              h('div', { class: 'header' }, slots.header?.()),
              h('div', { class: 'default' }, slots.default?.()),
            ]);
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
            slots: {
              header: () => 'Header Content',
            },
            children: 'Default Content',
          },
        },
      });

      expect(wrapper.find('.header').text()).toBe('Header Content');
      expect(wrapper.find('.default').text()).toBe('Default Content');
    });
  });

  describe('v-model support', () => {
    it('should handle v-model binding', async () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        props: {
          modelValue: String,
        },
        emits: ['update:modelValue'],
        setup(props, { emit }) {
          return () =>
            h('input', {
              value: props.modelValue,
              onInput: (e: any) => emit('update:modelValue', e.target.value),
            });
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
          },
          modelValue: 'initial',
        },
      });

      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('initial');

      await wrapper.find('input').setValue('updated');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['updated']);
    });
  });

  describe('Component function type', () => {
    it('should handle component as function', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', { class: 'test' }, 'Function Component');
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const componentFunction = () => 'TestComponent';

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: componentFunction,
          },
        },
      });

      expect(wrapper.find('.test').text()).toBe('Function Component');
    });

    it('should handle direct component reference', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', { class: 'direct' }, 'Direct Component');
        },
      });

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: TestComponent,
          },
        },
      });

      expect(wrapper.find('.direct').text()).toBe('Direct Component');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty props object', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'No Props');
        },
      });

      comMapInstance.register('TestComponent', TestComponent);

      const wrapper = mount(CreateComponent, {
        props: {
          config: {
            component: 'TestComponent',
            props: {},
          },
        },
      });

      expect(wrapper.text()).toBe('No Props');
    });
  });
});
