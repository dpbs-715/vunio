<template>
  <ElInput v-model="obj.data" />
  {{ obj.flg }}
  <div v-trunced:flg="obj" class="test">
    {{ obj.data }}
  </div>
</template>

<script setup lang="ts">
import { vTrunced } from '@vunio/directives';
import { ref } from 'vue';
const obj = ref({
  flg: false,
  data: '',
});
</script>
<style scoped>
.test {
  width: 100px;
  height: 100px;
  overflow: hidden;
}
</style>
