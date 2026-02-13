<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useMixConfig } from '@vunio/hooks/src/useMixConfig';
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  field1: 'value',
});
const total = ref(0);
const tableData = reactive([
  {
    field1: 'value',
  },
  {
    field1: 'value2',
  },
  {},
  {},
  {},
]);
const loading = ref(false);

const { search, table } = useMixConfig([
  {
    field: 'field1',
    label: '测试',
    search: {
      component: 'select',
      props: {
        options: [{ value: 'value', label: 'label' }],
        onChange: (...args: any[]) => {
          console.log(args);
          search.getConfigByField('field2').label = 13123;
        },
      },
    },
    table: true,
  },
  {
    field: 'field2',
    label: '测试2',
    search: true,
    table: true,
  },
]);

function searchFun() {
  console.log(11);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
</script>

<template>
  <CommonTableLayout>
    <template #search>
      <CommonSearch v-model="queryParams" :config="search.config" @search="searchFun" />
    </template>
    <template #operation-left>
      <CommonButton type="primary">
        测试
      </CommonButton>
    </template>
    <template #operation-right>
      <CommonButton type="create">
        新增
      </CommonButton>
      <CommonButton type="delete">
        删除
      </CommonButton>
      <CommonButton type="export">
        导出
      </CommonButton>

      <CommonTableFieldsConfig :config="table.config" />
    </template>
    <template #table="{ tableHeight }">
      <CommonTable
        :height="tableHeight"
        use-index
        empty-text="/"
        :data="tableData"
        :loading="loading"
        :config="table.config"
      />
    </template>
    <template #pagination>
      <CommonPagination
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="searchFun"
      />
    </template>
  </CommonTableLayout>
</template>

<style scoped></style>
