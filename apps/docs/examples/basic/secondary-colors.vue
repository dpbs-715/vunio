<script lang="ts" setup>
const colorsType = ['success', 'warning', 'danger', 'info'];
const isClient = typeof window !== 'undefined';

const colorLevel = [1, 3, 7, 8, 9].map((item) => `light-${item}`);
colorLevel.unshift('dark-2');

const getColorValue = (type: string) => {
  if (!isClient) {
    return `var(--el-color-${type})`;
  }

  const color = getComputedStyle(document.documentElement).getPropertyValue(`--el-color-${type}`);
  return color;
};
</script>

<template>
  <el-row :gutter="12">
    <el-col
      v-for="(type, i) in colorsType"
      :key="i"
      :span="6"
      :xs="{ span: 12 }"
    >
      <div
        class="demo-color-box"
        :style="{ background: getColorValue(type) }"
      >
        {{ type.charAt(0).toUpperCase() + type.slice(1) }}
        <div
          class="value"
          text="xs"
        >
          {{ getColorValue(type).toUpperCase() }}
        </div>
        <div class="bg-color-sub">
          <div
            v-for="(level, key) in colorLevel"
            :key="key"
            class="bg-secondary-sub-item transition cursor-pointer hover:shadow"
            :style="{
              width: `${100 / 6}%`,
              background: `var(--el-color-${type}-` + level + ')',
            }"
          >
            <!--            {{ useCssVar(`&#45;&#45;el-color-${type}-` + level) }}-->
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.demo-color-box {
  position: relative;
  box-sizing: border-box;
  height: 112px;
  padding: 20px;
  margin: 8px 0;
  font-size: 14px;
  color: var(--el-color-white);
  border-radius: 4px;

  .bg-color-sub {
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% + 1px);
    height: 40px;

    .bg-blue-sub-item {
      display: inline-block;
      height: 100%;

      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }

    .bg-secondary-sub-item {
      display: inline-block;
      height: 100%;

      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }
  }

  .value {
    margin-top: 2px;
  }
}

.demo-color-box-lite {
  color: var(--el-text-color-primary);
}
</style>
