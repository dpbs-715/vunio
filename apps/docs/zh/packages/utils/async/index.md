# async异步包装器

## asyncCache

> 包装异步任务,在时间范围内只执行一次 或使用缓存。

```ts
import { asyncCache, CACHE_TYPE } from '@vunio/utils';

export function getApi(query) {
  return axios({
    url: '',
    method: 'get',
    params: query,
  });
}

/**
 * @param1 api
 * @param2 {
 *   expireTime ?: 过期时间(需要启用缓存)
 *   cacheKey ?: string, 默认为方法名
 *   version ?: string, 默认为 v1.0.0
 *   cacheType ?: CACHE_TYPE | undefined, 默认为空不启用缓存
 *   }
 *   CACHE_TYPE = localStorage|sessionStorage|memory
 * */
export const oncegetApi = asyncCache(getApi);
```
