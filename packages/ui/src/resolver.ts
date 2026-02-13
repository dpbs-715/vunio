// src/resolver.ts
import type { ComponentResolver } from 'unplugin-vue-components';

export interface vunioUIResolverOptions {
  /**
   * 是否自动导入组件样式
   * @default true
   */
  importStyle?: boolean;
}

export function vunioUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Common')) {
        return {
          name: name,
          from: '@vunio/ui',
          sideEffects: undefined,
        };
      } else {
        return undefined;
      }
    },
  };
}
