import { onActivated, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { componentDefaultPropsMap } from '~/components/CreateComponent/src/defaultMap.ts';

/**
 * 计算表格高度的钩子函数
 * @param otherRefs 可能是包含多个ref对象的数组，用于参考其他元素的高度
 * @param ignorePage 一个布尔值，表示是否忽略页面特定高度
 * @returns 返回一个对象，包含表格高度和获取高度的函数
 */
export const useTableHeight = (otherRefs?: any[] | any) => {
  // 初始化表格高度为200px
  const tableHeight = ref(200);
  const isClient = typeof window !== 'undefined';
  // 计算需要忽略的固定高度
  const ignoreHeight = componentDefaultPropsMap.CommonTable.ignoreHeight;
  /**
   * 计算表格的高度
   * 此函数会根据窗口高度和其他元素的高度来计算表格的高度
   */
  function getHeight() {
    if (!isClient) {
      return;
    }

    let height = window.innerHeight;
    // 如果otherRefs是数组，则遍历数组中的每个ref对象，减去其高度
    if (Array.isArray(otherRefs)) {
      otherRefs.forEach((item: any) => {
        height -= item?.value?.offsetHeight || 0;
      });
      height -= ignoreHeight;
    } else {
      // 如果otherRefs不是数组，直接减去其高度
      height -= (otherRefs?.value?.offsetHeight || 0) + ignoreHeight;
    }
    // 确保计算的高度不小于200px
    tableHeight.value = height > 200 ? height : 200;
  }

  onMounted(() => {
    if (!isClient) {
      return;
    }

    getHeight();
    window.addEventListener('resize', getHeight);
  });

  // 在组件卸载前移除事件监听器
  onBeforeUnmount?.(() => {
    if (!isClient) {
      return;
    }

    window.removeEventListener('resize', getHeight);
  });

  // 初始化高度以及监听
  const observer =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          // 重新计算高度
          getHeight();
        })
      : null;

  function resetObserver(element?: HTMLElement | null) {
    if (!observer) {
      getHeight();
      return;
    }

    observer.disconnect();

    if (element) {
      observer.observe(element);
      return;
    }

    getHeight();
  }

  // 根据otherRefs的类型，监听ref对象的变化，以便更新观察目标
  if (Array.isArray(otherRefs)) {
    otherRefs.forEach((ref) => {
      watch(
        () => ref.value,
        () => {
          resetObserver(ref.value);
        },
        { immediate: true },
      );
    });
  } else {
    watch(
      () => otherRefs?.value,
      () => {
        if (otherRefs?.value) {
          resetObserver(otherRefs.value);
        } else {
          getHeight();
        }
      },
      {
        immediate: true,
      },
    );
  }

  // 在keepalive组件重新激活时计算高度
  onActivated?.(() => {
    getHeight();
  });
  // 在组件卸载时断开观察器连接
  onUnmounted(() => {
    observer?.disconnect();
  });

  // 返回表格高度和获取高度的函数
  return {
    tableHeight,
    getHeight,
  };
};
