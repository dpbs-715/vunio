<script setup lang="ts">
import { CommonFoma } from '@vunio/ui';
import { ref } from 'vue';
const model = ref('1+3');
const error = ref('');
</script>

<template>
  <CommonFoma ref="CommonFomaRef" v-model="model" v-model:error="error" readonly />
</template>

<style scoped></style>
