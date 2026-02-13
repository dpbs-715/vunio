// // For this project development
// import 'vue';

/**
 * 用作给全局引入的UI组件类型提示：
 * tsconfig.json 需要添加配置："types": ["@vunio/ui/global.d.ts"]
 *
 * 或者
 * 一个全局的类型声明文件.d.ts写入：/// <reference types="@vunio/ui/global.d.ts" />
 * 类似于：/// <reference types="vite/client" /> 具体可参考playground下的env.d.ts
 */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    CommonButton: (typeof import('@vunio/ui'))['CommonButton'];
    CommonDialog: (typeof import('@vunio/ui'))['CommonDialog'];
    CreateComponent: (typeof import('@vunio/ui'))['CreateComponent'];
    CommonForm: (typeof import('@vunio/ui'))['CommonForm'];
    CommonSearch: (typeof import('@vunio/ui'))['CommonSearch'];
    CommonTable: (typeof import('@vunio/ui'))['CommonTable'];
    CommonPagination: (typeof import('@vunio/ui'))['CommonPagination'];
    CommonTableLayout: (typeof import('@vunio/ui'))['CommonTableLayout'];
    CommonTableFieldsConfig: (typeof import('@vunio/ui'))['CommonTableFieldsConfig'];
    CommonSelect: (typeof import('@vunio/ui'))['CommonSelect'];
    CommonSelectOrDialog: (typeof import('@vunio/ui'))['CommonSelectOrDialog'];
    CommonDescriptions: (typeof import('@vunio/ui'))['CommonDescriptions'];
    CommonFoma: (typeof import('@vunio/ui'))['CommonFoma'];
  }
}

export {};
