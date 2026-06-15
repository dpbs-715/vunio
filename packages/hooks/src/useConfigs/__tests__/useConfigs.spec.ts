import { describe, expect, it } from 'vitest';
import { useConfigs } from '../index';
import { defineComponent, h, onUnmounted } from 'vue';
import { mount } from '@vue/test-utils';

interface TestConfig {
  field: string;
  label?: string;
  hidden?: boolean;
  props?: Record<string, any>;
}

describe('useConfigs', () => {
  const createInitialConfig = (): TestConfig[] => [
    { field: 'name', label: 'Name' },
    { field: 'age', label: 'Age' },
    { field: 'email', label: 'Email' },
  ];

  it('should initialize with config', () => {
    const initialConfig = createInitialConfig();
    const { config } = useConfigs(initialConfig);

    expect(config).toHaveLength(3);
    expect(config[0].field).toBe('name');
  });
  it('should initialize with config', () => {
    const initialConfig = createInitialConfig();
    const [config, setHidden] = useConfigs(initialConfig);
    expect(config).toHaveLength(3);
    expect(config[0].field).toBe('name');
    setHidden(['name'], true);
    expect(config[0].hidden).toBe(true);
  });

  it('should set hidden state for fields', () => {
    const initialConfig = createInitialConfig();
    const { config, setHidden } = useConfigs(initialConfig);

    setHidden(['name', 'age'], true);

    expect(config[0].hidden).toBe(true);
    expect(config[1].hidden).toBe(true);
    expect(config[2].hidden).toBeUndefined();
  });

  it('should set disabled state for fields', () => {
    const initialConfig = createInitialConfig();
    const { config, setDisabled } = useConfigs(initialConfig);

    setDisabled(['name', 'age'], true);

    expect(config[0].props?.disabled).toBe(true);
    expect(config[1].props?.disabled).toBe(true);
    expect(config[2].props?.disabled).toBeUndefined();
  });

  it('should set disabled state for all fields', () => {
    const initialConfig = createInitialConfig();
    const { config, setDisabledAll } = useConfigs(initialConfig);

    setDisabledAll(true);

    expect(config[0].props?.disabled).toBe(true);
    expect(config[1].props?.disabled).toBe(true);
    expect(config[2].props?.disabled).toBe(true);
  });

  it('should enable all fields', () => {
    const initialConfig = createInitialConfig();
    const { config, setDisabledAll } = useConfigs(initialConfig);

    setDisabledAll(true);
    setDisabledAll(false);

    expect(config[0].props?.disabled).toBe(false);
    expect(config[1].props?.disabled).toBe(false);
    expect(config[2].props?.disabled).toBe(false);
  });

  it('should handle always disabled fields with * prefix', () => {
    const initialConfig = createInitialConfig();
    const { config, setDisabled, setDisabledAll } = useConfigs(initialConfig);

    // Mark 'name' as always disabled
    setDisabled(['*name'], true);
    setDisabled(['age'], true);

    // Try to enable all
    setDisabledAll(false);

    // 'name' should remain disabled, 'age' should be enabled
    expect(config[0].props?.disabled).toBe(true);
    expect(config[1].props?.disabled).toBe(false);
  });

  it('should remove field from always disabled with * prefix', () => {
    const initialConfig = createInitialConfig();
    const { config, setDisabled, setDisabledAll } = useConfigs(initialConfig);

    // Mark as always disabled
    setDisabled(['*name'], true);
    // Remove from always disabled
    setDisabled(['*name'], false);

    // Try to enable all
    setDisabledAll(false);

    // 'name' should be enabled now
    expect(config[0].props?.disabled).toBe(false);
  });

  it('should set props by field', () => {
    const initialConfig = createInitialConfig();
    const { config, setPropsByField } = useConfigs(initialConfig);

    setPropsByField('name', { placeholder: 'Enter name', maxLength: 50 });

    expect(config[0].props?.placeholder).toBe('Enter name');
    expect(config[0].props?.maxLength).toBe(50);
  });

  it('should merge props when setting props by field', () => {
    const initialConfig = createInitialConfig();
    const { config, setPropsByField } = useConfigs(initialConfig);

    setPropsByField('name', { placeholder: 'Enter name' });
    setPropsByField('name', { maxLength: 50 });

    expect(config[0].props?.placeholder).toBe('Enter name');
    expect(config[0].props?.maxLength).toBe(50);
  });

  it('should get config by field', () => {
    const initialConfig = createInitialConfig();
    const { getConfigByField } = useConfigs(initialConfig);

    const nameConfig = getConfigByField('name');

    expect(nameConfig?.field).toBe('name');
    expect(nameConfig?.label).toBe('Name');
  });

  it('should return an empty object for non-existent field', () => {
    const initialConfig = createInitialConfig();
    const { getConfigByField } = useConfigs(initialConfig);

    const result = getConfigByField('nonExistent');

    expect(result).toEqual({});
  });

  it('should filter configs', () => {
    const initialConfig = createInitialConfig();
    const { filterConfigs } = useConfigs(initialConfig);

    const filtered = filterConfigs((item) => item.field === 'name' || item.field === 'age');

    expect(filtered).toHaveLength(2);
    expect(filtered[0].field).toBe('name');
    expect(filtered[1].field).toBe('age');
  });

  it('should cleanup configs', () => {
    const initialConfig = createInitialConfig();
    const { config, cleanup } = useConfigs(initialConfig);

    expect(config).toHaveLength(3);

    cleanup();

    expect(config).toHaveLength(0);
  });

  it('should auto cleanup on unmount when autoCleanup is true', () => {
    const initialConfig = createInitialConfig();
    let configLength = 0;

    const TestComponent = defineComponent({
      setup() {
        const { config } = useConfigs(initialConfig, true);
        onUnmounted(() => {
          configLength = config.length;
        });
        return () => h('div', 'test');
      },
    });

    const wrapper = mount(TestComponent);
    wrapper.unmount();

    expect(configLength).toBe(0);
  });

  it('should not auto cleanup when autoCleanup is false', () => {
    const initialConfig = createInitialConfig();
    let configRef: TestConfig[] | null = null;

    const TestComponent = defineComponent({
      setup() {
        const { config } = useConfigs(initialConfig, false);
        configRef = config;
        return () => h('div', 'test');
      },
    });

    const wrapper = mount(TestComponent);
    wrapper.unmount();

    expect(configRef).toHaveLength(3);
  });

  it('should support tuple destructuring', () => {
    const initialConfig = createInitialConfig();
    const [
      config,
      setHidden,
      setDisabled,
      setDisabledAll,
      setPropsByField,
      getConfigByField,
      filterConfigs,
      cleanup,
    ] = useConfigs(initialConfig);

    expect(config).toHaveLength(3);
    expect(typeof setHidden).toBe('function');
    expect(typeof setDisabled).toBe('function');
    expect(typeof setDisabledAll).toBe('function');
    expect(typeof setPropsByField).toBe('function');
    expect(typeof getConfigByField).toBe('function');
    expect(typeof filterConfigs).toBe('function');
    expect(typeof cleanup).toBe('function');
  });

  it('should handle empty config array', () => {
    const { config } = useConfigs([]);

    expect(config).toHaveLength(0);
  });

  it('should ignore non-existent fields when setting hidden', () => {
    const initialConfig = createInitialConfig();
    const { setHidden } = useConfigs(initialConfig);

    expect(() => {
      setHidden(['nonExistent'], true);
    }).not.toThrow();
  });

  it('should ignore non-existent fields when setting disabled', () => {
    const initialConfig = createInitialConfig();
    const { setDisabled } = useConfigs(initialConfig);

    expect(() => {
      setDisabled(['nonExistent'], true);
    }).not.toThrow();
  });

  it('should ignore non-existent fields when setting props', () => {
    const initialConfig = createInitialConfig();
    const { setPropsByField } = useConfigs(initialConfig);

    expect(() => {
      setPropsByField('nonExistent', { test: 'value' });
    }).not.toThrow();
  });
});
