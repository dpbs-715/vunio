---
name: vunio
description: 当用户提到 `vunio`、`@vunio/*`、`Common*` 组件，或在本仓库中开发 UI、hooks、directives、utils、docs 时使用此 skill。此 skill 用于把功能名路由到对应的 Vunio GitHub 文档源码和本地源码位置，必须使用实际存在的具体功能路径，不能给分类首页地址。
---

# Vunio 功能路由

## 用途

根据用户提到的具体功能名，返回可直接访问的 GitHub 文档源码地址和对应本地源码目录。

## 路由规则

- 中文文档源码：`https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/<分类>/<功能>/index.md`
- 英文文档源码：`https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/<分类>/<功能>/index.md`
- 必须使用实际存在的功能目录名，不能只返回分类目录，否则无法直接定位文档源码

## UI 组件

- `button`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/button/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/button/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/button`
  - 源码目录：`packages/ui`

- `dialog`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/dialog/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/dialog/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/dialog`
  - 源码目录：`packages/ui`

- `Descriptions`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Descriptions/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Descriptions/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Descriptions`
  - 源码目录：`packages/ui`

- `CreateComponent`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/CreateComponent/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/CreateComponent/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/CreateComponent`
  - 源码目录：`packages/ui`

- `Foma`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Foma/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Foma/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Foma`
  - 源码目录：`packages/ui`

- `Form`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Form/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Form/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Form`
  - 源码目录：`packages/ui`

- `Pagination`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Pagination/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Pagination/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Pagination`
  - 源码目录：`packages/ui`

- `Search`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Search/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Search/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Search`
  - 源码目录：`packages/ui`

- `Select`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Select/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Select/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Select`
  - 源码目录：`packages/ui`

- `SelectOrDialog`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/SelectOrDialog/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/SelectOrDialog/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/SelectOrDialog`
  - 源码目录：`packages/ui`

- `Table`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/Table/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/Table/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/Table`
  - 源码目录：`packages/ui`

- `TableFieldsConfig`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/TableFieldsConfig/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/TableFieldsConfig/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/TableFieldsConfig`
  - 源码目录：`packages/ui`

- `TableLayout`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/ui/TableLayout/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/ui/TableLayout/index.md)
  - 文档目录：`apps/docs/zh/packages/ui/TableLayout`
  - 源码目录：`packages/ui`

## Hooks

- `createContext`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/createContext/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/createContext/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/createContext`
  - 源码目录：`packages/hooks`

- `useConfigs`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/useConfigs/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/useConfigs/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/useConfigs`
  - 源码目录：`packages/hooks`

- `useCounter`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/useCounter/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/useCounter/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/useCounter`
  - 源码目录：`packages/hooks`

- `useEventListener`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/useEventListener/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/useEventListener/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/useEventListener`
  - 源码目录：`packages/hooks`

- `useMixConfig`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/useMixConfig/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/useMixConfig/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/useMixConfig`
  - 源码目录：`packages/hooks`

- `useRefCollect`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/useRefCollect/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/useRefCollect/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/useRefCollect`
  - 源码目录：`packages/hooks`

- `useRepeatConfig`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/hooks/useRepeatConfig/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/hooks/useRepeatConfig/index.md)
  - 文档目录：`apps/docs/zh/packages/hooks/useRepeatConfig`
  - 源码目录：`packages/hooks`

## Directives

- `vFocus`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/directives/vFocus/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/directives/vFocus/index.md)
  - 文档目录：`apps/docs/zh/packages/directives/vFocus`
  - 源码目录：`packages/directives`

- `vTrunced`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/directives/vTrunced/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/directives/vTrunced/index.md)
  - 文档目录：`apps/docs/zh/packages/directives/vTrunced`
  - 源码目录：`packages/directives`

## Utils

- `array`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/array/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/array/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/array`
  - 源码目录：`packages/utils/src/array`

- `async`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/async/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/async/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/async`
  - 源码目录：`packages/utils/src/async`

- `cache`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/cache/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/cache/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/cache`
  - 源码目录：`packages/utils/src/cache`

- `clone`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/clone/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/clone/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/clone`
  - 源码目录：`packages/utils/src/clone`

- `ep`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/ep/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/ep/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/ep`
  - 源码目录：`packages/utils/src/ep`

- `function`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/function/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/function/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/function`
  - 源码目录：`packages/utils/src/function`

- `is`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/is/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/is/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/is`
  - 源码目录：`packages/utils/src/is`

- `parse`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/parse/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/parse/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/parse`
  - 源码目录：`packages/utils/src/parse`

- `string`
  - 中文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/zh/packages/utils/string/index.md)
  - 英文文档源码：[index.md](https://github.com/dpbs-715/vunio/blob/main/apps/docs/en/packages/utils/string/index.md)
  - 文档目录：`apps/docs/zh/packages/utils/string`
  - 源码目录：`packages/utils/src/string`

## 总览

- GitHub 仓库：<https://github.com/dpbs-715/vunio>
- 中文说明：[README.zh-CN.md](https://github.com/dpbs-715/vunio/blob/main/README.zh-CN.md)
- 英文说明：[README.md](https://github.com/dpbs-715/vunio/blob/main/README.md)
