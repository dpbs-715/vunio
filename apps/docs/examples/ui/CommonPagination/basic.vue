<script setup lang="ts">
import { ref, reactive } from 'vue';
import { CommonPagination } from '@vunio/ui';

const total = ref(50);
const queryParams = reactive({
  current: 1,
  size: 10,
});

function getList() {
  console.log(queryParams);
}
</script>

<template>
  {{ total }}
  {{ queryParams }}
  <CommonPagination
    v-model:page="queryParams.current"
    v-model:limit="queryParams.size"
    :total="total"
    @pagination="getList"
  />
</template>

<style scoped></style>
