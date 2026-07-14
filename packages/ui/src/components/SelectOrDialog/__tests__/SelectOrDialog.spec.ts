import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, watch } from 'vue';

vi.mock('../../CreateComponent', () => ({
  commonKeysMap: {
    page: 'pageNo',
    size: 'pageSize',
    defaultSize: 10,
  },
}));

vi.mock('@vunio/hooks', async () => {
  const { reactive, ref } = await import('vue');

  return {
    createContext: () => [(fallback: any) => fallback, vi.fn()],
    useMixConfig: () => ({
      search: {
        config: [],
        setDisabledAll: vi.fn(),
        setDisabled: vi.fn(),
        setPropsByField: vi.fn(),
      },
      table: {
        config: [],
      },
      data: {
        queryParams: reactive<Record<string, any>>({}),
        tableData: reactive<any[]>([]),
        total: ref(0),
      },
    }),
  };
});

const CommonButtonStub = defineComponent({
  name: 'CommonButton',
  emits: ['click'],
  setup(_props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          'data-test': 'open-dialog',
          onClick: () => emit('click'),
        },
        slots.default?.(),
      );
  },
});

const CommonDialogStub = defineComponent({
  name: 'CommonDialog',
  emits: ['confirm'],
  setup(_props, { emit, slots }) {
    return () =>
      h('div', [
        slots.default?.(),
        h(
          'button',
          {
            'data-test': 'confirm-dialog',
            onClick: () => emit('confirm', () => {}),
          },
          'confirm',
        ),
      ]);
  },
});

const CommonTableLayoutStub = defineComponent({
  name: 'CommonTableLayout',
  setup(_props, { slots }) {
    return () => h('div', [slots.search?.(), slots.table?.(), slots.pagination?.()]);
  },
});

const CommonTableStub = defineComponent({
  name: 'CommonTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['selectionChange'],
  setup(props, { emit, expose }) {
    const selectedRows: any[] = [];
    const emitSelection = () => emit('selectionChange', [...selectedRows]);

    watch(() => props.data, emitSelection, { deep: 1 });

    expose({
      clearSelection() {
        selectedRows.splice(0, selectedRows.length);
        emitSelection();
      },
      toggleRowSelection(row: any, selected = true) {
        const index = selectedRows.indexOf(row);
        if (selected && index === -1) {
          selectedRows.push(row);
        } else if (!selected && index !== -1) {
          selectedRows.splice(index, 1);
        }
        emitSelection();
      },
      getSelectionRows() {
        return [...selectedRows];
      },
    });

    return () => h('div');
  },
});

const EmptyStub = defineComponent({
  setup() {
    return () => h('div');
  },
});

vi.doMock('../../Select', () => ({ CommonSelect: EmptyStub }));
vi.doMock('../../Button', () => ({ CommonButton: CommonButtonStub }));
vi.doMock('../../Dialog', () => ({ CommonDialog: CommonDialogStub }));
vi.doMock('../../TableLayout', () => ({ CommonTableLayout: CommonTableLayoutStub }));
vi.doMock('../../Search', () => ({ CommonSearch: EmptyStub }));
vi.doMock('../../Table', () => ({ CommonTable: CommonTableStub }));
vi.doMock('../../Pagination', () => ({ CommonPagination: EmptyStub }));

describe('CommonSelectOrDialog', () => {
  it('should preserve selections while the table reconciles refreshed rows', async () => {
    const { default: SelectOrDialog } = await import('../src/SelectOrDialog.vue');
    const wrapper = mount(SelectOrDialog, {
      props: {
        modelValue: 1,
        label: 'One',
        options: [{ label: 'One', value: 1 }],
        dialogFieldsConfig: [],
      },
    });

    await wrapper.get('[data-test="open-dialog"]').trigger('click');
    await nextTick();
    await nextTick();
    await wrapper.get('[data-test="confirm-dialog"]').trigger('click');

    expect(wrapper.emitted('change')?.at(-1)).toEqual([[1], ['One']]);
  });
});
