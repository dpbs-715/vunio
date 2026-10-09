# CommonSearch公共查询

基于CommonForm的组件

## 全局注册属性

```js
registerComponentDefaultPropsMap({
  CommonSearch: {
    col: {
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
    },
    actionCol: 12,
  },
});
```

<demo ssg="true" vue="ui/CommonSearch/registerProps.vue" />

## 操作按钮列宽

通过 `actionCol` 设置搜索和重置按钮所在列的栅格跨度。组件传入的值优先于全局注册的 `CommonSearch.actionCol`；未传入或传入 `undefined` 时使用全局默认配置，内置默认值为 `4`。

```vue
<CommonSearch v-model="queryParams" :config="config" :action-col="12" />
```

上例将当前组件的操作按钮列跨度设为 `12`。动态修改 `actionCol` 时，列宽会同步更新。

## props传入事件

<demo ssg="true" vue="ui/CommonSearch/bindProps.vue" />

## provide传入事件

<demo ssg="true" vue="ui/CommonSearch/provide.vue" />

## Props

| 属性               | 说明                                               | 类型                                                 | 默认值                             |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| config             | 表单配置项，用于定义搜索表单项的结构和行为         | `CommonFormConfig[]`                                 | -                                  |
| col                | 定义在不同屏幕尺寸下的列数，用于响应式布局         | `{ sm: number; md: number; lg: number; xl: number }` | `{ sm: 24, md: 12, lg: 8, xl: 6 }` |
| actionCol          | 搜索和重置按钮所在列的栅格跨度，优先于全局默认配置 | `number`                                             | `4`                                |
| resetAll           | 是否重置所有表单字段，包括默认值                   | `boolean`                                            | `false`                            |
| resetWithoutSearch | 重置时是否不触发搜索操作                           | `boolean`                                            | `false`                            |
