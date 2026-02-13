<script setup lang="ts">
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import type { CommonFormConfig } from '~/components';
import { provide, reactive } from 'vue';
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  test3: 222,
});
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
    component: 'select',
    props: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
      onChange: (val: string, o: any) => {
        config[1].label = val;
        console.log(o);
      },
    },
  },
  {
    field: 'test2',
    label: '测试2',
    component: 'input',
  },
  {
    field: 'test3',
    label: '测试2',
    component: 'input',
  },
  {
    field: 'test4',
    label: '测试2',
    component: 'input',
  },
  {
    field: 'test5',
    label: '测试2',
    component: 'input',
  },
  {
    field: 'test6',
    label: '测试2',
    component: 'input',
  },
]);
function resetFun() {
  console.log('reset');
}
function searchFun() {
  alert('search');
}
function searchFun2() {
  alert('search2');
}
provide('search', searchFun);
</script>

<template>
  {{ queryParams }}
  <CommonSearch v-model="queryParams" :config="config" @search="searchFun2" @reset="resetFun" />
  <el-button @click="queryParams.pageNo++">
    下一页
  </el-button>
</template>

<style scoped></style>
