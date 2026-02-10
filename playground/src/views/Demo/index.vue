<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { CommonTableConfig } from '~/dlib-ui';
import { useConfigs } from 'dlib-hooks';
import { spanMethodBuilder } from 'dlib-utils';

const type = ref('1');

const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称',
    field: 'field1',
    hidden: computed(() => type.value != '1'),
  },
  {
    label: '名称2',
    field: 'field2',
    align: 'center',
  },
  {
    label: '名称3',
    field: 'field3',
  },
  {
    label: '名称4',
    field: 'field4',
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
    field1: '1',
    field2: '名称21',
    field3: '名称33',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '1',
    field2: '名称21',
    field3: '名称32',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '2',
    field2: '名称21',
    field3: '名称32',
    field4: '名称4',
    field5: '名称6',
  },
]);

const spanMethod = spanMethodBuilder()
  .withData(tableData)
  .mergeRows(() => {
    if (type.value == '1') {
      return ['field1', 'field2', 'field3'];
    } else {
      return ['field2', 'field3'];
    }
  })
  .build();
</script>

<template>
  <el-radio-group v-model="type" size="large" fill="#409eff">
    <el-radio-button label="table1 York" value="1" />
    <el-radio-button label="table2" value="2" />
  </el-radio-group>

  <CommonTable :data="tableData" :config="config" :span-method="spanMethod" />
</template>

<style scoped></style>
