<script setup lang="ts">
import { CommonForm, CommonButton } from '~/components';
import type { CommonSearchEmits, CommonSearchProps } from './Search.types';
import { getCurrentInstance, ref, inject } from 'vue';
import { ElCol, ElFormItem } from 'element-plus';
import { commonKeysMap } from '~/components/CreateComponent/src/defaultMap.ts';
import { useComponentProps } from '~/_utils/componentUtils.ts';

defineOptions({
  name: 'CommonSearch',
  inheritAttrs: false,
});

const emits = defineEmits<CommonSearchEmits>();
const vm = getCurrentInstance();
const props = defineProps<CommonSearchProps>();
const searchProps: any = useComponentProps(props, 'CommonSearch');
const queryParams: any = defineModel();
const search: Function | null = inject<(() => void) | null>('search', null);
/**
 * 查询方法
 * */
function queryHandler() {
  //判断是否传入了search事件
  const vnode: any = vm?.vnode || {};
  if (vnode['props']?.onSearch) {
    emits('search');
  } else {
    search && search();
  }
}
/**
 * 重置所有参数
 * */
function resetAllParams() {
  for (let key in queryParams.value) {
    if (![commonKeysMap.page, commonKeysMap.size].includes(key)) {
      delete queryParams.value[key];
    }
  }
}
/**
 * 重置方法
 * */
function resetHandler() {
  if (searchProps.value.resetAll) {
    resetAllParams();
  } else {
    queryForm.value.resetFields();
  }
  emits('reset');
  if (!searchProps.value.resetWithoutSearch) {
    queryHandler();
  }
}

const queryForm = ref();
function collectFormRef(instance: any) {
  if (vm) {
    queryForm.value =
      vm.exposeProxy =
      vm.exposed =
        {
          ...(instance || {}),
        };
  }
}
</script>

<template>
  <CommonForm
    v-if="searchProps.config.length > 0"
    v-bind="searchProps"
    :ref="collectFormRef"
    v-model="queryParams"
    class="commonSearch"
  >
    <template #moreCol>
      <el-col
        style="display: flex; align-items: center; min-width: 140px"
        :span="searchProps.actionCol"
      >
        <el-form-item>
          <CommonButton :loading="searchProps.loading" type="primary" @click="queryHandler">
            搜索
          </CommonButton>
          <CommonButton
            :loading="searchProps.loading"
            type="normal"
            style="margin-left: 12px"
            plain
            @click="resetHandler"
          >
            重置
          </CommonButton>
        </el-form-item>
      </el-col>
    </template>
  </CommonForm>
</template>

<style lang="scss" scoped>
@use './Search.scss' as *;
</style>
