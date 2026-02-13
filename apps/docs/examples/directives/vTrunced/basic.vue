<template>
  <ElDivider>文本内容</ElDivider>
  <ElInput v-model="obj.data" />
  <ElDivider>是否截断</ElDivider>
  {{ obj.flg }}
  <ElDivider>显示区域</ElDivider>
  <div v-trunced:flg="obj" class="test">
    {{ obj.data }}
  </div>
</template>

<script setup lang="ts">
import { vTrunced } from '@vunio/directives';
import { ElDivider } from 'element-plus';
import { ref } from 'vue';
const obj = ref({
  flg: false,
  data: '',
});
</script>
<style scoped>
.test {
  width: 100px;
  overflow: hidden;
}
</style>
