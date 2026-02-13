<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from '@vunio/hooks/src/useConfigs';
import { CommonForm } from '@vunio/ui';
import type { CommonFormConfig } from '@vunio/ui';

const formData = ref({});
const { config, setHidden } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    props: {
      onChange: (value: string, p: Record<string, any>) => {
        if (value === '1' && !p.formData.test2) {
          setHidden(['test2'], true);
        } else {
          setHidden(['test2'], false);
        }
      },
    },
  },
  {
    field: 'test2',
    label: '字段2',
  },
]);
</script>

<template>
  <CommonForm v-model="formData" :config="config" />
</template>

<style scoped></style>
