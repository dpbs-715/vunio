/// <reference types="vite/client" />
/// <reference types="@vunio/ui/global.d.ts" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vunio/ui' {
  export * from '@vunio/ui';
}
