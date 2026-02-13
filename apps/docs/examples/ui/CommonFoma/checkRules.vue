<script setup lang="ts">
import { CommonFoma } from '@vunio/ui';
import { ref } from 'vue';
const model = ref('');
const error = ref('');
</script>

<template>
  <CommonFoma ref="CommonFomaRef" v-model="model" v-model:error="error" :check-rules="false" />
</template>

<style scoped></style>
