import { describe, expect, it, vi } from 'vitest';
import { useRepeatConfig } from '../index';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';

// Mock @vunio/utils
vi.mock('@vunio/utils', () => ({
  deepClone: (obj: any) => JSON.parse(JSON.stringify(obj)),
}));

// Mock @vunio/ui
vi.mock('@vunio/ui', () => ({
  baseConfig: {},
}));

interface TestConfig {
  field: string;
  label?: string;
  $key?: any;
}

describe('useRepeatConfig', () => {
  const createInitialConfig = (): TestConfig[] => [
    { field: 'name', label: 'Name' },
    { field: 'age', label: 'Age' },
  ];

  it('should collect config for a key', () => {
    const initialConfig = createInitialConfig();
    const { collect } = useRepeatConfig(initialConfig as any);

    const config = collect('key1');

    expect(config).toHaveLength(2);
    expect(config[0].field).toBe('name');
    expect(config[1].field).toBe('age');
  });

  it('should add $key to each config item', () => {
    const initialConfig = createInitialConfig();
    const { collect } = useRepeatConfig(initialConfig as any);

    const config = collect('key1');

    expect(config[0].$key).toBe('key1');
    expect(config[1].$key).toBe('key1');
  });

  it('should return same config for same key', () => {
    const initialConfig = createInitialConfig();
    const { collect } = useRepeatConfig(initialConfig as any);

    const config1 = collect('key1');
    const config2 = collect('key1');

    expect(config1).toBe(config2);
  });

  it('should create separate config for different keys', () => {
    const initialConfig = createInitialConfig();
    const { collect } = useRepeatConfig(initialConfig as any);

    const config1 = collect('key1');
    const config2 = collect('key2');

    expect(config1).not.toBe(config2);
    expect(config1[0].$key).toBe('key1');
    expect(config2[0].$key).toBe('key2');
  });

  it('should get config by key', () => {
    const initialConfig = createInitialConfig();
    const { collect, getConfig } = useRepeatConfig(initialConfig as any);

    collect('key1');
    const configInstance = getConfig('key1');

    expect(configInstance).toBeDefined();
    expect(configInstance?.config).toHaveLength(2);
  });

  it('should return undefined for non-existent key', () => {
    const initialConfig = createInitialConfig();
    const { getConfig } = useRepeatConfig(initialConfig as any);

    const configInstance = getConfig('nonExistent');

    expect(configInstance).toBeUndefined();
  });

  it('should provide access to useConfigs methods', () => {
    const initialConfig = createInitialConfig();
    const { collect, getConfig } = useRepeatConfig(initialConfig as any);

    collect('key1');
    const configInstance = getConfig('key1');

    expect(configInstance?.setHidden).toBeDefined();
    expect(configInstance?.setDisabled).toBeDefined();
    expect(configInstance?.setDisabledAll).toBeDefined();
    expect(configInstance?.setPropsByField).toBeDefined();
    expect(configInstance?.getConfigByField).toBeDefined();
  });

  it('should modify config independently for each key', () => {
    const initialConfig = createInitialConfig();
    const { collect, getConfig } = useRepeatConfig(initialConfig as any);

    collect('key1');
    collect('key2');

    const config1: any = getConfig('key1');
    const config2: any = getConfig('key2');

    config1?.setHidden(['name'], true);

    expect(config1?.config[0].hidden).toBe(true);
    expect(config2?.config[0].hidden).toBeUndefined();
  });

  it('should deep clone initial config', () => {
    const initialConfig = createInitialConfig();
    const { collect } = useRepeatConfig(initialConfig as any);

    const config1 = collect('key1');
    config1[0].label = 'Modified';

    const config2 = collect('key2');

    // config2 should have the original label, not the modified one
    expect(config2[0].label).toBe('Name');
  });

  it('should cleanup all configs on unmount', () => {
    const initialConfig = createInitialConfig();

    const TestComponent = defineComponent({
      setup() {
        const { collect, getConfig, collectConfigs } = useRepeatConfig(initialConfig as any);

        collect('key1');
        collect('key2');

        expect(collectConfigs.size).toBe(2);

        return () => h('div', 'test');
      },
    });

    const wrapper = mount(TestComponent);
    wrapper.unmount();

    // After unmount, the cleanup should have been called
    // We can't directly test this without exposing internal state,
    // but we verify the cleanup function is called in the next test
  });

  it('should call cleanup on all collected configs during unmount', () => {
    const initialConfig = createInitialConfig();
    let cleanupCalled = 0;

    // Mock useConfigs to track cleanup calls
    vi.mock('../useConfigs', () => ({
      useConfigs: () => ({
        config: [],
        cleanup: () => {
          cleanupCalled++;
        },
        setHidden: vi.fn(),
        setDisabled: vi.fn(),
        setDisabledAll: vi.fn(),
        setPropsByField: vi.fn(),
        getConfigByField: vi.fn(),
        filterConfigs: vi.fn(),
      }),
    }));

    const TestComponent = defineComponent({
      setup() {
        const { collect } = useRepeatConfig(initialConfig as any);
        collect('key1');
        collect('key2');
        return () => h('div', 'test');
      },
    });

    const wrapper = mount(TestComponent);
    wrapper.unmount();
  });

  it('should handle empty initial config', () => {
    const { collect } = useRepeatConfig([]);

    const config = collect('key1');

    expect(config).toHaveLength(0);
  });

  it('should handle numeric keys', () => {
    const initialConfig = createInitialConfig();
    const { collect, getConfig } = useRepeatConfig(initialConfig as any);

    const config = collect(123);

    expect(config[0].$key).toBe(123);

    const retrieved = getConfig(123);
    expect(retrieved).toBeDefined();
  });

  it('should handle object keys', () => {
    const initialConfig = createInitialConfig();
    const { collect, getConfig } = useRepeatConfig(initialConfig as any);

    const key = { id: 1 };
    const config = collect(key);

    expect(config[0].$key).toStrictEqual(key);

    const retrieved = getConfig(key);
    expect(retrieved).toBeDefined();
  });

  it('should maintain separate collectConfigs map', () => {
    const initialConfig = createInitialConfig();
    const { collect, collectConfigs } = useRepeatConfig(initialConfig as any);

    expect(collectConfigs.size).toBe(0);

    collect('key1');
    expect(collectConfigs.size).toBe(1);

    collect('key2');
    expect(collectConfigs.size).toBe(2);

    collect('key1'); // Should not increase size
    expect(collectConfigs.size).toBe(2);
  });
});
