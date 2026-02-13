<script setup lang="ts">
import { CommonSelect } from '../../Select';
import { CommonDialog } from '../../Dialog';
import { CommonButton } from '../../Button';
import { CommonTableLayout } from '../../TableLayout';
import { CommonSearch } from '../../Search';
import { CommonTable } from '../../Table';
import { CommonPagination } from '../../Pagination';
import { defineModel, ref, watch, type Ref, useAttrs } from 'vue';
import type { SelectOrDialogEmits, SelectOrDialogProps } from './SelectOrDialog.types';
import { useMixConfig } from '@vunio/hooks';
import { DataHandlerClass } from '~/_utils/dataHandlerClass.ts';
import { commonKeysMap } from '../../CreateComponent';
import { isEmpty } from '@vunio/utils';
defineOptions({
  name: 'CommonSelectOrDialog',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<SelectOrDialogProps>(), {});

const emits = defineEmits<SelectOrDialogEmits>();

const attrs = useAttrs();
const model: any = defineModel();
const label: any = defineModel('label');
const visible = ref(false);
const selections = ref<any>([]);
const labelSelections = ref<any>([]);
const isSettingSelection = ref(false); // 标志位：是否正在程序化设置选中状态

const tableRef = ref();

const dataHandler = new DataHandlerClass(props);
dataHandler.init();
const loading: Ref<Boolean> = dataHandler.loading;

async function open() {
  await props.beforeOpen?.();
  visible.value = true;
  initSelection(); // 总是初始化选中状态，包括清空的情况
  searchFun();
}
/**
 * 初始化选中数据
 * */
function initSelection() {
  selections.value = [];
  labelSelections.value = [];

  // 如果 model.value 为空，保持 selections 为空数组
  if (isEmpty(model.value)) {
    return;
  }

  if (props.multiple) {
    if (props.joinSplit) {
      selections.value = model.value.split(props.joinSplit);
      labelSelections.value = label.value?.split(props.joinSplit) || [];
    } else {
      selections.value = model.value;
      labelSelections.value = label.value || [];
    }
  } else {
    selections.value = [model.value];
    labelSelections.value = [label.value];
  }
}
/**
 * 获取数据
 * */
function searchFun() {
  dataHandler.setMoreQueryParams(queryParams);
  dataHandler.preInitOptions();
}

const { search, table, data } = useMixConfig(props.dialogFieldsConfig);
const { queryParams, tableData, total } = data;
queryParams[commonKeysMap.size] = commonKeysMap.defaultSize;
/**
 * 监听query
 * 如果query有值，则设置query参数，并禁用query参数的输入框
 * */
watch(
  props.query ?? (() => ({})),
  () => {
    const queryData = props.query?.() || {};
    search.setDisabledAll(false);
    search.setDisabled(Object.keys(queryData), true);
    for (let key in queryData) {
      queryParams[key] = queryData[key];
      search.setPropsByField(key, {
        placeholder: '自动',
      });
    }
  },
  {
    immediate: true,
  },
);

/**
 * 获取字典数据或者手动绑定的数据结果
 * */
dataHandler.afterInit = (options: any[]) => {
  tableData.splice(0, tableData.length, ...options);
  if (!props.api) {
    total.value = 0;
  } else {
    total.value = dataHandler.total;
  }
  handlerDataSelections();
};

/**
 * 处理数据选中状态
 * */
async function handlerDataSelections() {
  if (!tableRef.value) return;

  isSettingSelection.value = true; // 开始程序化设置选中状态

  tableRef.value.clearSelection();
  // 处理选中
  tableData.forEach((item) => {
    if (selections.value.includes(item[dataHandler.VALUE_FIELD.value])) {
      tableRef.value.toggleRowSelection(item, true);
    }
  });

  isSettingSelection.value = false; // 结束程序化设置选中状态
}

/**
 * 选中项修改
 * */
function selectChange(selection: any[]) {
  // 如果是程序化设置选中状态，不处理，避免干扰 selections.value
  if (isSettingSelection.value) return;

  const valueKey = dataHandler.VALUE_FIELD.value;
  const labelKey = dataHandler.LABEL_FIELD.value;

  // 当前页 value、label 的快速集合
  const currentPageValues = new Set(tableData.map((item) => item[valueKey]));
  const currentPageLabels = new Set(tableData.map((item) => item[labelKey]));

  // 过滤掉当前页旧选中项（保持原逻辑）
  selections.value = selections.value.filter((v: any[]) => !currentPageValues.has(v));
  labelSelections.value = labelSelections.value.filter((l: any[]) => !currentPageLabels.has(l));

  // 添加当前页新的选中项
  selection.forEach((row) => {
    selections.value.push(row[valueKey]);
    labelSelections.value.push(row[labelKey]);
  });
}

/**
 * 确认
 * */
async function confirmHandler(close: Function) {
  //1.beforeConfirm 数据确认前 可能会有校验等操作 中断选中
  await props.beforeConfirm?.(selections.value, labelSelections.value);

  if (props.multiple) {
    if (props.joinSplit) {
      model.value = selections.value.join(props.joinSplit);
      label.value = labelSelections.value.join(props.joinSplit);
    } else {
      model.value = selections.value;
      label.value = labelSelections.value;
    }
  } else {
    model.value = selections.value.at(-1) ?? '';
    label.value = labelSelections.value.at(-1) ?? '';
  }

  //2.执行各种change事件
  emits('change', selections.value, labelSelections.value);
  emits('changeObj', tableRef.value.getSelectionRows());
  close();
}

function selectHandler(_selection: any[], row: Record<any, any>) {
  if (selections.value.some((v: any[]) => v === row[dataHandler.VALUE_FIELD.value])) {
    emits('removeRow', row, tableData);
  } else {
    emits('addRow', row, tableData);
  }
}

//当前页面选择全部
function selectAllHandler(selection: any[]) {
  if (selection.length === 0) {
    emits('removePageRows', tableData);
  } else {
    emits('addPageRows', tableData);
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: row; align-items: center; width: 100%">
    <CommonSelect
      v-model="model"
      v-model:label="label"
      style="flex: 1"
      v-bind="{ ...props, ...attrs }"
    />
    <CommonButton
      style="flex-shrink: 0; margin-left: 5px"
      :disabled="props.disabled"
      type="primary"
      plain
      @click="open"
    >
      选择
    </CommonButton>
    <CommonDialog
      v-model="visible"
      width="800px"
      title="数据选择"
      v-bind="props.dialogProps"
      @confirm="confirmHandler"
    >
      <CommonTableLayout>
        <template #search>
          <CommonSearch
            v-model="queryParams"
            :loading="loading"
            :col="{
              sm: 24,
              md: 24,
              lg: 12,
              xl: 12,
            }"
            :config="search.config"
            @search="searchFun"
          />
        </template>
        <template #table>
          <CommonTable
            v-bind="props.tableProps"
            ref="tableRef"
            :loading="dataHandler.loading"
            reserve-selection
            use-index
            use-selection
            :row-key="dataHandler.VALUE_FIELD.value"
            :single-selection="!props.multiple"
            :config="table.config"
            :data="tableData"
            @selection-change="selectChange"
            @select="selectHandler"
            @select-all="selectAllHandler"
          />
        </template>
        <template #pagination>
          <CommonPagination
            v-if="total"
            v-model:page="queryParams[commonKeysMap.page]"
            v-model:limit="queryParams[commonKeysMap.size]"
            :total="total"
            @pagination="searchFun"
          />
        </template>
      </CommonTableLayout>
    </CommonDialog>
  </div>
</template>

<style scoped></style>
