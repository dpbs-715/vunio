<script setup lang="ts">
import { computed, reactive, ref, h } from 'vue';
import type { CommonTableConfig } from '~/@vunio/ui';
import { useConfigs } from '@vunio/hooks';
const hidden = ref(false);

const { config, getConfigByField } = useConfigs<CommonTableConfig>([
  {
    label: '名称',
    field: 'field1',
    helpText: '测试',
    component: ({ rowIndex }: any) => {
      if (rowIndex > 0) {
        return 'input';
      } else {
        return undefined;
      }
    },
    align: 'center',
    // renderHeaderScope: (
    //   _,
    //   { configItem, index }: { configItem: CommonTableConfig; index: number },
    // ) => {
    //   console.log('baseParams', _);
    //   console.log('otherParams', configItem, index);
    //   return '测试';
    // },
    props: {
      onChange: () => {
        const o = getConfigByField('field2');
        if (o) {
          o.component = 'input';
        }
      },
    },
    isDisabled: ({ rowIndex }: { rowIndex: number }) => {
      return rowIndex === 0;
    },
    rules: [
      {
        required: true,
        message: '请输入名称',
        trigger: 'blur',
      },
    ],
  },
  {
    label: '名称2',
    field: 'field2',
    hidden: hidden,
    align: 'center',
  },
  {
    label: '名称3',
    field: 'field3',
    hidden: computed(() => hidden.value),
  },
  {
    label: '名称4',
    field: 'field4',
    component: 'commonSelect',
    model: {
      label: 'testLabel',
    },
    props: {
      options: [
        {
          label: '测试1',
          value: '1',
        },
        {
          label: '测试2',
          value: '2',
        },
        {
          label: '测试3',
          value: '3',
        },
        {
          label: '测试4',
          value: '4',
        },
      ],
    },
  },
  {
    label: '名称5',
    field: 'field5',
    formatter: (row: any) => {
      return h('span', { style: { color: 'red' } }, `${row.field5}测试`);
    },
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
    field1: '2',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
]);

function pushData() {
  tableData.push({
    field1: '名称1',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  });
  hidden.value = true;
}
function clearData() {
  tableData.splice(0);
}

const v2 = ref(false);
setTimeout(() => {
  v2.value = true;
}, 3000);
</script>

<template>
  {{ tableData }}

  <div style="display: flex; width: 1300px; height: 500px">
    <CommonTable
      fixed
      use-selection
      index
      :data="tableData"
      :config="config"
      @row-dblclick="() => console.log(1111)"
    >
      <!--      <template #field4="{ cellData, column, rowData, rowIndex, tableData }">-->
      <!--        {{ rowIndex }} - {{ cellData }} - {{ column.label }} - {{ rowData.field3 }} - -->
      <!--        {{ tableData.length }}}-->
      <!--      </template>-->
    </CommonTable>
  </div>
  <el-divider />
  <el-button @click="pushData">
    添加行
  </el-button>
  <el-button @click="clearData">
    清空
  </el-button>
</template>

<style scoped></style>
