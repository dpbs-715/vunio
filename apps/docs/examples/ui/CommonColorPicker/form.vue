<script setup lang="ts">
import { ref } from 'vue';
import { CommonForm } from '@vunio/ui';

const formData = ref({ backgroundColor: '#07111F' });
const config = [
  {
    label: '背景颜色',
    field: 'backgroundColor',
    component: 'color',
    props: {
      showAlpha: true,
      clearable: true,
    },
  },
];
</script>

<template>
  <div class="color-form-demo">
    <CommonForm v-model="formData" :config="config" />
    <pre>{{ formData }}</pre>
  </div>
</template>

<style scoped>
.color-form-demo {
  max-width: 620px;
}
</style>
