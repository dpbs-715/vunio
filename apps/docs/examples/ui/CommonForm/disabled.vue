<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';
const formData = ref({});
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
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
    },
  },
  {
    field: 'test2',
    label: '字段2',
    isDisabled: ({ formData, configItem }: Record<string, any>) => {
      if (formData.field1 === '1') {
        console.log(formData, configItem);
        return true;
      } else {
        return false;
      }
    },
  },
]);
</script>

<template>
  <CommonForm v-model="formData" :config="config" />
</template>

<style scoped></style>
