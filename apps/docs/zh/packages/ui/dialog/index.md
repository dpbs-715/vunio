# Dialog 弹窗

基础的弹窗组件。

## 基础用法

<demo ssg="true" vue="ui/dialog/basic.vue" />

## 命令式弹窗

<demo ssg="true" vue="ui/dialog/renderDialog.vue" />

## API

## Props

| 属性       | 说明               | 类型    | 默认值 |
| ---------- | ------------------ | ------- | ------ |
| modelValue | 控制弹窗的显示状态 | boolean | false  |
| modalBlur  | 启用模态背景的模糊 | boolean | true   |
| footerHide | 隐藏默认底部按钮   | boolean | false  |

除以上属性外，支持透传 Element Plus Dialog 的属性。

## renderDialog

| 参数        | 说明                              | 类型                           |
| ----------- | --------------------------------- | ------------------------------ |
| component   | 弹窗内容组件、VNode 或渲染函数    | Component \| VNode \| Function |
| props       | 传递给弹窗内容组件的属性          | object                         |
| dialogProps | 传递给 CommonDialog 的属性和事件  | DialogPropsWithEvents          |
| options     | 命令式弹窗配置，可传入 appContext | RenderDialogOptions            |

### 继承应用上下文

当弹窗内容需要使用应用级 `provide`、插件、`globalProperties`、i18n、Pinia 或路由等上下文时，可以从当前组件实例中取出 `appContext` 并传给 `renderDialog`。

```ts
import { getCurrentInstance, h } from 'vue';
import { CommonForm, renderDialog } from '@vunio/ui';

const instance = getCurrentInstance();

function openDialog() {
  renderDialog(
    h(CommonForm),
    {
      modelValue: formData,
      config,
    },
    {
      title: '测试',
    },
    {
      appContext: instance?.appContext,
    },
  );
}
```

## Events

| 事件名 | 说明             | 回调参数 |
| ------ | ---------------- | -------- |
| close  | 当弹窗关闭时触发 | -        |
