<script setup lang="ts">
import { reactive } from 'vue';
import { useRefCollect } from '@vunio/hooks/src/useRefCollect';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import type { CommonFormConfig } from '~/components';
const { handleRef, getRefsValidateArr, clearRefsValidate } = useRefCollect();
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
    component: 'commonSelect',
    model: {
      label: 'test',
    },
    rules: [
      {
        required: true,
        message: '请选择',
        trigger: 'change',
      },
    ],
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
      onChange: (val: string) => {
        config[1].label = val;
      },
    },
  },
  {
    field: 'test2',
    label: '测试2',
    component: 'input',
    hidden: ({ formData }) => {
      return formData.test1 === '1';
    },
    rules: [
      {
        required: true,
        message: '请输入',
        trigger: 'blur',
      },
    ],
  },
]);
setTimeout(() => {
  config.push({
    component: 'input',
    field: 'test3',
    label: '测试3',
    props: {},
  });
}, 2000);
const formData = reactive({});
const formData2 = reactive({});
function submit() {
  getRefsValidateArr().then(() => {
    console.log(1111);
  });
}

function clear() {
  clearRefsValidate();
}
</script>

<template>
  {{ formData }}
  <CommonForm :ref="(el) => handleRef(el, 'form1')" v-model="formData" :config="config" />

  <CommonForm :ref="(el) => handleRef(el, 'form2')" v-model="formData2" :config="config" />
  <el-button @click="submit">
    校验
  </el-button>
  <el-button @click="clear">
    清除校验
  </el-button>
</template>

<style scoped></style>
