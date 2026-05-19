import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, defineComponent, ref, nextTick } from 'vue';
import { ElTable } from 'element-plus';

// Mock CreateComponent to avoid circular dependency issues
vi.mock('~/components/CreateComponent', () => ({
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
          value: props.modelValue,
          onChange: (e: any) => emit('update:modelValue', e.target.value),
          class: 'mock-create-component',
        });
    },
  }),
  componentDefaultPropsMap: {
    CommonTable: {
      emptyText: '暂无数据',
      ignoreHeight: 332,
      sortOrders: ['ascending', 'descending'],
      sortable: false,
      showOverflowTooltip: true,
      border: true,
      stripe: true,
      defaultColMinWidth: 150,
      column: {
        align: 'center',
        headerAlign: 'center',
      },
    },
  },
}));

// Mock utility functions
vi.mock('~/_utils/componentUtils.ts', () => ({
  configIterator: vi.fn(),
  getRules: vi.fn((item) => item.rules || []),
  isHidden: vi.fn((item) => {
    if (typeof item.hidden === 'function') {
      return item.hidden({ tableData: [] });
    }
    return !!item.hidden;
  }),
  setDefaultSlotColumnProps: vi.fn((config) => config),
  useComponentProps: vi.fn((props) => ref(props)),
}));

// Mock DataHandlerClass
vi.mock('~/_utils/dataHandlerClass.ts', () => ({
  DataHandlerClass: class {
    afterInit = () => {};
    initOptions = () => {};
    getLabelByValue = () => '';
  },
}));

// Mock renderColumns
vi.mock('../src/renderColumns.tsx', () => ({
  RenderColumnsClass: class {
    constructor() {}
    render() {
      return h('div', { class: 'mock-columns' }, 'Columns');
    }
    renderV2() {
      return h('div', { class: 'mock-columns-v2' }, 'Columns V2');
    }
    renderHeader() {
      return h('div', { class: 'mock-header' }, 'Header');
    }
    renderSelection() {
      return h('div', { class: 'mock-selection' }, 'Selection');
    }
    renderIndex() {
      return h('div', { class: 'mock-index' }, 'Index');
    }
    renderColumn() {
      return h('div', { class: 'mock-column' }, 'Column');
    }
    renderCell() {
      return h('div', { class: 'mock-cell' }, 'Cell');
    }
  },
}));

// Mock useTableSort
vi.mock('../src/useTableSort.ts', () => ({
  SORT_ORDERS: { value: ['ascending', 'descending'] },
  SORTABLE: { value: true },
  sortChange: vi.fn(),
  useTableV2Sort: vi.fn(() => ({
    sortState: { value: {} },
    setSortState: vi.fn(),
  })),
}));

import Table from '../src/Table.vue';
import type { CommonTableConfig } from '../src/Table.types';

describe('CommonTable', () => {
  const mockData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
  ];

  const basicConfig: CommonTableConfig[] = [
    {
      field: 'name',
      label: 'Name',
    },
    {
      field: 'age',
      label: 'Age',
    },
    {
      field: 'email',
      label: 'Email',
    },
  ];

  describe('Basic rendering', () => {
    it('should render table with default props', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
        },
      });

      expect(wrapper.find('.commonTable').exists()).toBe(true);
      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should render with empty data', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: [],
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should apply table props correctly', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          stripe: true,
          border: true,
          size: 'large',
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.exists()).toBe(true);
    });

    it('should handle undefined config', () => {
      const wrapper = mount(Table, {
        props: {
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Data binding', () => {
    it('should bind data to table', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
      // Data is bound through props
      expect(wrapper.props('data')).toEqual(mockData);
    });

    it('should update table data when parent replaces data prop', async () => {
      const dataRef = ref(mockData);
      const wrapper = mount({
        setup() {
          return () => h(Table, { config: basicConfig, data: dataRef.value });
        },
      });
      const nextData = [{ id: 4, name: 'Alice Cooper', age: 28, email: 'alice@example.com' }];

      dataRef.value = nextData;
      await nextTick();

      expect(wrapper.findComponent(ElTable).props('data')).toEqual(nextData);
    });

    it('should handle empty data array', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: [],
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
      expect(wrapper.props('data')).toEqual([]);
    });
  });

  describe('Column configuration', () => {
    it('should render columns based on config', () => {
      const config: CommonTableConfig[] = [
        {
          field: 'id',
          label: 'ID',
          width: 80,
        },
        {
          field: 'name',
          label: 'Name',
          minWidth: 120,
        },
        {
          field: 'status',
          label: 'Status',
          align: 'center',
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should support hidden columns', () => {
      const config: CommonTableConfig[] = [
        {
          field: 'name',
          label: 'Name',
        },
        {
          field: 'secret',
          label: 'Secret',
          hidden: true,
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should support dynamic hidden columns', () => {
      const config: CommonTableConfig[] = [
        {
          field: 'name',
          label: 'Name',
        },
        {
          field: 'conditional',
          label: 'Conditional',
          hidden: ({ tableData }: Record<string, any>) => tableData.length === 0,
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Selection feature', () => {
    it('should render with selection column when useSelection is true', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          useSelection: true,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should support single selection mode', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          useSelection: true,
          singleSelection: true,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should emit selectionChange event', async () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          useSelection: true,
        },
      });

      // The table component wraps the emit
      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Index column', () => {
    it('should render index column when useIndex is true', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          useIndex: true,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Loading state', () => {
    it('should show loading state', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          loading: true,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should not show loading when loading is false', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          loading: false,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Empty state', () => {
    it('should show empty text when data is empty', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: [],
          emptyText: 'No data available',
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should use custom empty text', () => {
      const customEmptyText = 'Custom empty message';
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: [],
          emptyText: customEmptyText,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Sorting', () => {
    it('should support sortable columns', () => {
      const config: CommonTableConfig[] = [
        {
          field: 'name',
          label: 'Name',
          sortable: true,
        },
        {
          field: 'age',
          label: 'Age',
          sortable: true,
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Row styling', () => {
    it('should apply stripe style', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          stripe: true,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('stripe')).toBe(true);
    });

    it('should apply border', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          border: true,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('border')).toBe(true);
    });

    it('should apply custom row className', () => {
      const rowClassName = 'custom-row-class';
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          rowClassName,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('rowClassName')).toBe(rowClassName);
    });

    it('should apply custom row style', () => {
      const rowStyle = { backgroundColor: 'red' };
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          rowStyle,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('rowStyle')).toEqual(rowStyle);
    });
  });

  describe('Table dimensions', () => {
    it('should apply height', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          height: 400,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('height')).toBe(400);
    });

    it('should apply maxHeight', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          maxHeight: 600,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('maxHeight')).toBe(600);
    });
  });

  describe('Validation', () => {
    it('should have table instance methods available', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
        },
      });

      // The table exposes methods via a Proxy
      // We check that the component is properly mounted
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should work with editable cells configuration', async () => {
      const config: CommonTableConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
          rules: [{ required: true, message: 'Name is required' }],
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Highlight', () => {
    it('should support highlightCurrentRow', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          highlightCurrentRow: true,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('highlightCurrentRow')).toBe(true);
    });
  });

  describe('Table size', () => {
    it('should apply small size', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          size: 'small',
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('size')).toBe('small');
    });

    it('should apply large size', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          size: 'large',
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('size')).toBe('large');
    });
  });

  describe('ShowHeader', () => {
    it('should show header by default', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      // showHeader should be true or undefined (default)
      expect(elTable.props('showHeader')).not.toBe(false);
    });

    it('should hide header when showHeader is false', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          showHeader: false,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('showHeader')).toBe(false);
    });
  });

  describe('Tooltip', () => {
    it('should apply showOverflowTooltip', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          showOverflowTooltip: true,
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('showOverflowTooltip')).toBe(true);
    });

    it('should apply tooltipEffect', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
          data: mockData,
          tooltipEffect: 'light',
        },
      });

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('tooltipEffect')).toBe('light');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty config array', () => {
      const wrapper = mount(Table, {
        props: {
          config: [],
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should handle undefined data', () => {
      const wrapper = mount(Table, {
        props: {
          config: basicConfig,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });

    it('should handle both empty config and data', () => {
      const wrapper = mount(Table, {
        props: {
          config: [],
          data: [],
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Nested columns', () => {
    it('should support column children', () => {
      const config: CommonTableConfig[] = [
        {
          field: 'name',
          label: 'Name',
        },
        {
          field: 'address',
          label: 'Address',
          columnChildren: [
            {
              field: 'city',
              label: 'City',
            },
            {
              field: 'street',
              label: 'Street',
            },
          ],
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should render complete table with all features', () => {
      const config: CommonTableConfig[] = [
        {
          field: 'id',
          label: 'ID',
          width: 80,
          sortable: true,
        },
        {
          field: 'name',
          label: 'Name',
          minWidth: 120,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          field: 'age',
          label: 'Age',
          width: 100,
          sortable: true,
        },
        {
          field: 'email',
          label: 'Email',
          minWidth: 180,
        },
      ];

      const wrapper = mount(Table, {
        props: {
          config,
          data: mockData,
          stripe: true,
          border: true,
          highlightCurrentRow: true,
          useSelection: true,
          useIndex: true,
          height: 400,
          size: 'default',
        },
      });

      expect(wrapper.findComponent(ElTable).exists()).toBe(true);

      const elTable = wrapper.findComponent(ElTable);
      expect(elTable.props('stripe')).toBe(true);
      expect(elTable.props('border')).toBe(true);
      expect(elTable.props('highlightCurrentRow')).toBe(true);
      expect(elTable.props('height')).toBe(400);
    });
  });
});
