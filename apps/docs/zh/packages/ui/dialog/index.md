# Dialog 弹窗

基础的弹窗组件。

## 基础用法

<demo ssg="true" vue="ui/dialog/basic.vue" />

## 命令式弹窗

<demo ssg="true" vue="ui/dialog/renderDialog.vue" />

## API

## Props

| 属性          | 说明        | 类型    | 默认值   |
|-------------|-----------| ------- |-------|
| modelValue  | 控制弹窗的显示状态 | boolean | false |
| modalBlur   | 启用模态背景的模糊 | boolean | true  |

## Events

| 事件名 | 说明             | 回调参数 |
| ------ | ---------------- | -------- |
| close  | 当弹窗关闭时触发 | -        |
