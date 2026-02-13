<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';
import { ElButton, ElDivider } from 'element-plus';
import { useRefCollect } from '@vunio/hooks';
const formData = ref({});
const formData2 = ref({});

const { clearRefsValidate, handleRef, refObj, getRefsValidateArr } = useRefCollect();
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    span: 12,
    rules: [
      {
        required: true,
        message: '请输入',
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'test2',
    label: '字段2',
    rules: [
      {
        required: true,
        message: '请输入',
        trigger: 'blur',
      },
    ],
  },
]);

function submit() {
  getRefsValidateArr().then(() => {
    alert('校验通过');
  });
}

function clear() {
  clearRefsValidate();
}

function getRef() {
  console.log(refObj['form1']);
}
</script>

<template>
  <CommonForm :ref="(el) => handleRef(el, 'form1')" v-model="formData" :config="config" />
  <el-divider />
  <CommonForm :ref="(el) => handleRef(el, 'form2')" v-model="formData2" :config="config" />
  <el-divider />
  <el-button @click="submit">
    提交
  </el-button>
  <el-button @click="clear">
    清除校验
  </el-button>
  <el-button @click="getRef">
    获取ref
  </el-button>
</template>

<style scoped></style>
