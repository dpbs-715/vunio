# CommonColorPicker 颜色选择器

`CommonColorPicker` 将独立色块、Element Plus 完整选色面板与可编辑颜色文本组合成一个表单控件。文本编辑时允许暂时不完整的值，只有按 Enter 或离开整个组合控件时才提交。

## 基础用法

点击左侧色块打开颜色面板，也可以直接输入、复制或粘贴颜色值。

<demo ssg="true" vue="ui/CommonColorPicker/basic.vue" />

## 允许透明度

设置 `show-alpha` 后，颜色面板显示透明度控制；`clearable` 同时允许从输入框或面板清空。透明色与半透明色均使用棋盘格呈现。

<demo ssg="true" vue="ui/CommonColorPicker/alpha.vue" />

## 预定义颜色

通过 `predefine` 提供业务需要的候选颜色。组件不会保存“最近使用颜色”，也不会操作 `localStorage`。

<demo ssg="true" vue="ui/CommonColorPicker/predefine.vue" />

## 禁用和只读

`disabled` 禁用整个组合控件。`readonly` 禁止修改和打开颜色面板，但输入文本仍可聚焦、选择和复制。

<demo ssg="true" vue="ui/CommonColorPicker/states.vue" />

## 非法输入表现

首版支持 `#RGB`、`#RGBA`、`#RRGGBB`、`#RRGGBBAA`、`rgb()`、`rgba()` 和 `transparent`。非法值不会覆盖 `modelValue`；输入框保留草稿并显示错误边框，同时设置 `aria-invalid="true"` 和触发 `invalid`。按 Escape 可放弃草稿并恢复外部值。

<demo ssg="true" vue="ui/CommonColorPicker/invalid.vue" />

## 与 CommonForm 配合使用

`color` 已注册到 `CreateComponent` 的 `BaseMap`，无需手动注册 `ElColorPicker`。

```ts
{
  label: '背景颜色',
  field: 'backgroundColor',
  component: 'color'
}
```

<demo ssg="true" vue="ui/CommonColorPicker/form.vue" />

## Props

| 属性          | 说明                                     | 类型                              | 默认值      |
| ------------- | ---------------------------------------- | --------------------------------- | ----------- |
| `modelValue`  | 当前已提交颜色值                         | `string`                          | `''`        |
| `size`        | 控件尺寸                                 | `'large' \| 'default' \| 'small'` | `'default'` |
| `disabled`    | 是否禁用整个控件                         | `boolean`                         | `false`     |
| `readonly`    | 是否只读                                 | `boolean`                         | `false`     |
| `clearable`   | 是否允许清空                             | `boolean`                         | `false`     |
| `showAlpha`   | 是否在颜色面板中显示透明度控制           | `boolean`                         | `false`     |
| `predefine`   | 预定义颜色列表                           | `string[]`                        | -           |
| `placeholder` | 输入框占位文本                           | `string`                          | `''`        |
| `colorFormat` | 提交格式；`auto` 保持输入的 Hex/RGB 类型 | `'auto' \| 'hex' \| 'rgb'`        | `'auto'`    |

## Events

| 事件                | 说明                                      | 参数                  |
| ------------------- | ----------------------------------------- | --------------------- |
| `update:modelValue` | 有效文本提交、面板实时选色或清空时触发    | `(value: string)`     |
| `change`            | 文本提交、面板确认或清空时触发            | `(value: string)`     |
| `focus`             | 焦点首次进入组合控件时触发                | `(event: FocusEvent)` |
| `blur`              | 焦点离开输入框、色块和选色面板后触发      | `(event: FocusEvent)` |
| `clear`             | 通过清空操作移除颜色时触发                | `()`                  |
| `invalid`           | 提交非法文本时触发，`modelValue` 保持不变 | `(value: string)`     |
