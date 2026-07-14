import { describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { configIterator, isHidden } from '../componentUtils';

describe('componentUtils', () => {
  describe('configIterator', () => {
    it('should resolve write args when enhanced function is called', () => {
      const handler = vi.fn();
      const aimConfig: Record<string, any> = {};
      let formData = { field: 'initial' };

      configIterator(aimConfig, {
        config: {
          component: 'input',
          props: {
            onChange: handler,
          },
        },
        getWriteArgs: () => ({
          formData,
        }),
      });

      aimConfig.props.onChange('first');
      formData = { field: 'latest' };
      aimConfig.props.onChange('second');

      expect(handler).toHaveBeenNthCalledWith(1, 'first', { formData: { field: 'initial' } });
      expect(handler).toHaveBeenNthCalledWith(2, 'second', { formData: { field: 'latest' } });
    });

    it('should not append write args repeatedly for wrapped functions', () => {
      const handler = vi.fn();
      const firstConfig: Record<string, any> = {};
      const secondConfig: Record<string, any> = {};

      configIterator(firstConfig, {
        config: {
          component: 'input',
          props: {
            onChange: handler,
          },
        },
        getWriteArgs: () => ({
          formData: { field: 'first' },
        }),
      });

      configIterator(secondConfig, {
        config: firstConfig,
        getWriteArgs: () => ({
          formData: { field: 'second' },
        }),
      });

      secondConfig.props.onChange('change');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0]).toHaveLength(2);
      expect(handler.mock.calls[0][0]).toBe('change');
    });

    it('should unwrap ref options without traversing Vue internals', () => {
      const options = ref([{ label: 'Option 1', value: 1 }]);
      const aimConfig: Record<string, any> = {};

      configIterator(aimConfig, {
        config: {
          props: { options },
        },
      });

      expect(aimConfig.props.options).toEqual(options.value);
      expect(aimConfig.props.options).not.toBe(options.value);
      expect(aimConfig.props.options[0]).not.toBe(options.value[0]);
    });

    it('should unwrap computed options without traversing Vue internals', () => {
      const source = ref([{ label: 'Option 1', value: 1 }]);
      const options = computed(() => source.value);
      const aimConfig: Record<string, any> = {};

      configIterator(aimConfig, {
        config: {
          props: { options },
        },
      });

      expect(aimConfig.props.options).toEqual(source.value);
      expect(aimConfig.props.options).not.toBe(source.value);
      expect(aimConfig.props.options[0]).not.toBe(source.value[0]);
    });

    it('should isolate downstream option mutations from plain source options', () => {
      const options = [
        {
          label: 'Parent',
          value: 1,
          children: [{ label: 'Child', value: 2 }],
        },
      ];
      const aimConfig: Record<string, any> = {};

      configIterator(aimConfig, {
        config: {
          props: { options },
        },
      });

      aimConfig.props.options[0].value = '1';
      aimConfig.props.options[0].children[0].value = '2';

      expect(options[0].value).toBe(1);
      expect(options[0].children[0].value).toBe(2);
    });

    it('should preserve direct and indirect circular references', () => {
      const direct: Record<string, any> = {};
      direct.self = direct;

      const parent: Record<string, any> = {};
      const child: Record<string, any> = { parent };
      parent.child = child;

      const aimConfig: Record<string, any> = {};
      configIterator(aimConfig, {
        config: { direct, parent },
      });

      expect(aimConfig.direct).not.toBe(direct);
      expect(aimConfig.direct.self).toBe(aimConfig.direct);
      expect(aimConfig.parent.child.parent).toBe(aimConfig.parent);
    });
  });

  describe('isHidden', () => {
    it('should unwrap computed hidden state', () => {
      const hidden = ref(false);
      const config = {
        component: 'input',
        field: 'name',
        hidden: computed(() => hidden.value),
      };

      expect(isHidden(config)).toBe(false);

      hidden.value = true;

      expect(isHidden(config)).toBe(true);
    });
  });
});
