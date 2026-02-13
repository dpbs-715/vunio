import { describe, expect, it, vi } from 'vitest';
import { useMixConfig } from '../index';

// Mock @vunio/ui types and @vunio/utils
vi.mock('@vunio/ui', () => ({
  CommonTableConfig: {},
  CommonFormConfig: {},
  CommonTableLayoutConfig: {},
}));

vi.mock('@vunio/utils', () => ({
  deepClone: (obj: any) => JSON.parse(JSON.stringify(obj)),
}));

interface MockTableLayoutConfig {
  field: string;
  label?: string;
  table?: Record<string, any>;
  form?: Record<string, any>;
  search?: Record<string, any>;
}

describe('useMixConfig', () => {
  it('should initialize with empty config', () => {
    const result = useMixConfig();

    expect(result.table.config).toHaveLength(0);
    expect(result.form.config).toHaveLength(0);
    expect(result.search.config).toHaveLength(0);
  });

  it('should initialize data properties', () => {
    const result = useMixConfig();

    expect(result.data.tableData).toEqual([]);
    expect(result.data.queryParams).toEqual({});
    expect(result.data.total.value).toBe(0);
  });

  it('should split config into table, form, and search', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Name',
        table: { width: 100 },
        form: { required: true },
        search: { placeholder: 'Search name' },
      },
      {
        field: 'age',
        label: 'Age',
        table: { width: 80 },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config).toHaveLength(2);
    expect(result.form.config).toHaveLength(1);
    expect(result.search.config).toHaveLength(1);
  });

  it('should merge base config with specific config', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Name',
        table: { width: 100, sortable: true },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config[0].field).toBe('name');
    expect(result.table.config[0].label).toBe('Name');
    expect(result.table.config[0].width).toBe(100);
    expect(result.table.config[0].sortable).toBe(true);
  });

  it('should remove table, form, search keys from merged config', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Name',
        table: { width: 100 },
        form: { required: true },
        search: { placeholder: 'Search' },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config[0]).not.toHaveProperty('table');
    expect(result.table.config[0]).not.toHaveProperty('form');
    expect(result.table.config[0]).not.toHaveProperty('search');
  });

  it('should handle config with only table property', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Name',
        table: { width: 100 },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config).toHaveLength(1);
    expect(result.form.config).toHaveLength(0);
    expect(result.search.config).toHaveLength(0);
  });

  it('should handle config with only form property', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Name',
        form: { required: true },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config).toHaveLength(0);
    expect(result.form.config).toHaveLength(1);
    expect(result.search.config).toHaveLength(0);
  });

  it('should handle config with only search property', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Name',
        search: { placeholder: 'Search' },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config).toHaveLength(0);
    expect(result.form.config).toHaveLength(0);
    expect(result.search.config).toHaveLength(1);
  });

  it('should return useConfigs instances with all methods', () => {
    const result = useMixConfig();

    expect(typeof result.table.setHidden).toBe('function');
    expect(typeof result.table.setDisabled).toBe('function');
    expect(typeof result.form.setHidden).toBe('function');
    expect(typeof result.search.setDisabled).toBe('function');
  });

  it('should handle multiple config items', () => {
    const configData: MockTableLayoutConfig[] = [
      {
        field: 'name',
        table: { width: 100 },
        form: { required: true },
        search: { placeholder: 'Name' },
      },
      {
        field: 'age',
        table: { width: 80 },
        form: { type: 'number' },
      },
      {
        field: 'email',
        search: { placeholder: 'Email' },
      },
    ];

    const result = useMixConfig(configData as any);

    expect(result.table.config).toHaveLength(2);
    expect(result.form.config).toHaveLength(2);
    expect(result.search.config).toHaveLength(2);
  });

  it('should maintain reactive data properties', () => {
    const result = useMixConfig();

    result.data.tableData.push({ id: 1, name: 'test' });
    result.data.total.value = 10;
    result.data.queryParams.page = 1;

    expect(result.data.tableData).toHaveLength(1);
    expect(result.data.total.value).toBe(10);
    expect(result.data.queryParams.page).toBe(1);
  });

  it('should deep clone config to prevent mutation', () => {
    const originalConfig: MockTableLayoutConfig[] = [
      {
        field: 'name',
        label: 'Original',
        table: { width: 100 },
      },
    ];

    const result = useMixConfig(originalConfig as any);

    // Modify the result config
    result.table.config[0].label = 'Modified';

    // Original should remain unchanged (deepClone should have been called)
    expect(originalConfig[0].label).toBe('Original');
  });
});
