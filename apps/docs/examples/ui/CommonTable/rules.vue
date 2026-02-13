<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CommonTable, type CommonTableConfig } from '@vunio/ui';
import { useConfigs, useRefCollect } from '@vunio/hooks';
import { ElInput } from 'element-plus';

const { handleRef, getRefsValidateArr } = useRefCollect();
const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称1',
    field: 'field1',
    component: 'input',
    rules: [
      {
        required: true,
        message: '请输入名称1',
        trigger: 'blur',
      },
    ],
  },
  {
    label: '名称2',
    field: 'field2',
    component: ElInput,
  },
  {
    label: '名称3',
    field: 'field3',
  },
  {
    label: '名称4',
    field: 'field4',
  },
  {
    label: '名称5',
    field: 'field5',
  },
]);
const tableData = reactive([
  {
    field1: '1',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
]);

const tableRef: any = ref();
function submit() {
  tableRef.value.validateForm();
}
function submit2() {
  getRefsValidateArr().then(() => {
    alert('校验通过');
  });
}
</script>

<template>
  <CommonTable ref="tableRef" :data="tableData" :config="config" />
  <el-divider />
  <el-button @click="submit">
    校验
  </el-button>
  <el-divider />
  <CommonTable :ref="(el) => handleRef(el, 'table2Ref')" :data="tableData" :config="config" />
  <el-divider />
  <el-button @click="submit2">
    校验
  </el-button>
</template>

<style scoped></style>
