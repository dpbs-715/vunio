import { MaybeRef, toValue } from 'vue';

/**
 * 缓存管理器 - 封装缓存失效检测和指纹计算逻辑
 * 使用微任务队列实现同一渲染周期内的指纹复用
 *
 * @param enableCache - 是否启用缓存
 * @param cacheKey - 用户提供的缓存键（可选）
 * @param calculateFingerprint - 计算数据指纹的函数
 * @returns 缓存管理器实例
 */
export function createCacheManager<T>(
  enableCache: boolean,
  cacheKey: MaybeRef<string | number> | undefined,
  calculateFingerprint: () => string,
) {
  let cache: T | null = null;
  let lastCacheKey: string | number | undefined = undefined;
  let cachedFingerprint = '';

  // 渲染周期内的临时指纹缓存
  let tempFingerprint = '';
  let tempFingerprintValid = false;

  return {
    /**
     * 获取缓存
     */
    getCache(): T | null {
      return cache;
    },

    /**
     * 设置缓存
     */
    setCache(value: T | null): void {
      cache = value;
    },

    /**
     * 检查是否需要失效缓存
     * @returns true 表示缓存已失效，需要重新计算
     */
    shouldInvalidate(): boolean {
      if (!enableCache) {
        return true;
      }

      if (cacheKey !== undefined) {
        // 策略1：使用用户提供的 cacheKey
        const currentCacheKey = toValue(cacheKey);
        if (currentCacheKey !== lastCacheKey) {
          lastCacheKey = currentCacheKey;
          cachedFingerprint = '';
          tempFingerprintValid = false;
          return true;
        }
        return false;
      } else {
        // 策略2：自动检测数据变化（同一渲染周期内复用指纹）
        if (!tempFingerprintValid) {
          tempFingerprint = calculateFingerprint();
          tempFingerprintValid = true;

          // 在当前渲染周期结束后失效临时指纹
          queueMicrotask(() => {
            tempFingerprintValid = false;
          });
        }

        if (tempFingerprint !== cachedFingerprint) {
          cachedFingerprint = tempFingerprint;
          return true;
        }
        return false;
      }
    },

    /**
     * 主动失效缓存
     */
    invalidate(): void {
      cache = null;
    },
  };
}
