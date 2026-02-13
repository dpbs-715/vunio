# Async Wrapper

## asyncCache

> Wraps asynchronous tasks to execute only once within a time range or use cache.

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
 *   expireTime ?: expiration time (cache must be enabled)
 *   cacheKey ?: string, defaults to function name
 *   version ?: string, defaults to v1.0.0
 *   cacheType ?: CACHE_TYPE | undefined, defaults to empty (cache disabled)
 *   }
 *   CACHE_TYPE = localStorage|sessionStorage|memory
 * */
export const oncegetApi = asyncCache(getApi);
```
