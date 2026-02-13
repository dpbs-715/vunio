<script setup lang="ts">
import { ref, reactive } from 'vue';
import { CommonForm, type CommonFormConfig } from '@vunio/ui';
import { ElButton } from 'element-plus';

const formRef = ref();
const formData = reactive({
  category: '',
  product: '',
});

// 表单配置
const formConfig: CommonFormConfig[] = [
  {
    label: '分类',
    field: 'category',
    component: 'commonSelect',
    props: {
      api: () => {
        // 模拟 API 请求，延迟 1 秒返回
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              list: [
                { label: '电子产品', value: '1' },
                { label: '图书', value: '2' },
                { label: '服装', value: '3' },
              ],
            });
          }, 1000);
        });
      },
      autoSelect: true, // 自动选择第一项
    },
  },
  {
    label: '商品',
    field: 'product',
    component: 'commonSelect',
    props: {
      api: () => {
        // 模拟 API 请求，延迟 1.5 秒返回
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              list: [
                { label: 'iPhone', value: 'p1' },
                { label: 'MacBook', value: 'p2' },
                { label: 'iPad', value: 'p3' },
              ],
            });
          }, 1500);
        });
      },
    },
  },
];

// 错误示范：直接填充数据（options 可能还没加载完成）
const loadFormDataWrong = async () => {
  const mockData = { category: '2', product: 'p2' };
  Object.assign(formData, mockData);
  console.log('直接填充数据（可能失败）：', formData);
};

// 正确示范：等待子组件准备就绪后再填充数据
const loadFormDataCorrect = async () => {
  // 等待所有 Select 组件的 options 加载完成
  await formRef.value?.waitForReady();

  // 现在可以安全地填充表单数据
  const mockData = { category: '2', product: 'p2' };
  Object.assign(formData, mockData);
  console.log('等待 ready 后填充数据（成功）：', formData);
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, { category: '', product: '' });
};
</script>

<template>
  <div>
    <h3>利用生命周期解决 Select options 加载时序问题</h3>
    <p>当表单包含带 API 的 Select 时，需要等待 options 加载完成后再填充数据</p>

    <CommonForm ref="formRef" v-model="formData" :config="formConfig" />

    <div style="display: flex; gap: 8px; margin-top: 16px">
      <el-button type="primary" @click="loadFormDataCorrect">
        ✅ 正确：等待 ready 后加载数据
      </el-button>
      <el-button type="warning" @click="loadFormDataWrong">
        ❌ 错误：直接加载数据
      </el-button>
      <el-button @click="resetForm">
        重置
      </el-button>
    </div>

    <div style="padding: 12px; margin-top: 16px; background: #f5f5f5; border-radius: 4px">
      <strong>表单数据：</strong>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-bottom: 8px;
}

p {
  margin-bottom: 16px;
  color: #666;
}
</style>
