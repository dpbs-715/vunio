import { describe, expect, it, vi } from 'vitest';
import { configIterator } from '../componentUtils';

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
  });
});
