<script setup lang="ts">
import { ElPagination } from 'element-plus';
import { type PropType, type Ref, toValue, computed } from 'vue';
import { commonKeysMap } from '../../CreateComponent';

defineOptions({
  name: 'CommonPagination',
  inheritAttrs: false,
});

// Lazy getter for defaultSize to avoid initialization issues
const getDefaultSize = () => commonKeysMap?.defaultSize ?? 10;

const props = defineProps({
  // 总条目数
  total: {
    required: true,
    type: [Number, Object] as PropType<number | Ref<number>>,
    default: 0,
  },
  // 当前页数：pageNo
  page: {
    type: Number,
    default: 1,
  },
  // 每页显示条目个数：pageSize
  limit: {
    type: Number,
    default: undefined,
  },
  pagerCount: {
    type: Number,
    default: 7,
  },
  pageSizes: {
    type: Array as () => number[],
    default: () => [10, 20, 30, 50, 100],
  },
});

const emit = defineEmits(['pagination']);
const currentPage = defineModel('page', {
  default: 1,
});
const pageSize = defineModel('limit', {
  default: 0,
});

// Compute actual limit value
const actualPageSize = computed({
  get: () => pageSize.value ?? getDefaultSize(),
  set: (val) => {
    pageSize.value = val;
  },
});
const handleSizeChange = (val: number) => {
  // 如果修改后超过最大页面，强制跳转到第 1 页
  if (currentPage.value * val > toValue(props.total)) {
    currentPage.value = 1;
  }
  // 触发 pagination 事件，重新加载列表
  emit('pagination', { page: currentPage.value, limit: val });
};
const handleCurrentChange = (val: number) => {
  // 触发 pagination 事件，重新加载列表
  emit('pagination', { page: val, limit: actualPageSize.value });
};
</script>

<template>
  <el-pagination
    v-bind="$attrs"
    v-model:current-page="currentPage"
    v-model:page-size="actualPageSize"
    :background="true"
    :page-sizes="props.pageSizes"
    :pager-count="props.pagerCount"
    :total="toValue(props.total)"
    layout="total, sizes, prev, pager, next"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style scoped></style>
