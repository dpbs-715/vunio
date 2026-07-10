# CommonForm公共表单

公共表单。

## 基础使用

<demo ssg="true" vue="ui/CommonForm/basic.vue" />

## 表单默认参数

main.ts中使用

```js
registerComponentDefaultPropsMap({
  CommonForm: {
    size: 'large', //大小配置
    col: {
      //默认列配置
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
    },
    //...其他elForm参数
  },
});
```

## span设置宽度

 <demo ssg="true" vue="ui/CommonForm/span.vue" />

## 隐藏字段

<demo ssg="true" vue="ui/CommonForm/hidden.vue" />

## 切换组件

<demo ssg="true" vue="ui/CommonForm/changeComponent.vue" />

## 禁用字段

<demo ssg="true" vue="ui/CommonForm/disabled.vue" />

## 函数式配置参数

例如elSelect的change事件 commonForm统一对函数式配置追加参数

<demo ssg="true" vue="ui/CommonForm/functionArgs.vue" />

## 字段插槽

<demo ssg="true" vue="ui/CommonForm/fieldSlot.vue" />

字段插槽除 `config` 外，还会暴露当前字段的 `modelValue` 和
`updateModelValue(value)`。通过 `updateModelValue` 写入的值会经过
`commandDispatcher`，可与默认生成的字段共用同一套命令历史。

## 指令式撤销和重做

`CommonForm` 不维护历史栈。传入 `commandDispatcher` 后，每次字段写入都会生成一个
`CommonFormCommand`，由调用方决定如何执行、合并、撤销和重做。不传该属性时，表单保持原有的直接写入行为。

<demo ssg="true" vue="ui/CommonForm/commandHistory.vue" />

dispatcher 必须先调用 `command.execute()`。如果需要合并输入框的连续输入，可在自定义时间窗口内调用上一条命令的
`merge(command)`；撤销后执行新命令时应清空 redo 栈。

当外部代码整体替换 `modelValue` 时，应同时清空该表单的命令历史，因为已有命令的反向操作属于替换前的模型对象。

## 校验规则

<demo ssg="true" vue="ui/CommonForm/rules.vue" />

## API

| 方法         | 说明                 |
| ------------ | -------------------- |
| validateForm | 表单校验             |
| getFormData  | 获取表单数据         |
| ...          | 其它elForm暴露的方法 |

## Props

| 属性              | 说明                                       | 类型                                   | 默认值 |
| ----------------- | ------------------------------------------ | -------------------------------------- | ------ |
| config            | 组件生成配置                               | CommonFormConfig[]                     | 无     |
| commandDispatcher | 字段命令分发器，由调用方执行命令并维护历史 | `(command: CommonFormCommand) => void` | 无     |
| ...               | 其它elForm参数                             | CommonFormProps                        | 无     |

## CommonFormCommand

| 成员           | 说明                                                  |
| -------------- | ----------------------------------------------------- |
| kind           | 命令类型，字段写入为 `common-form:set-field`          |
| field          | 本次写入的字段路径                                    |
| createdAt      | 命令创建时间                                          |
| updatedAt      | 命令最近一次合并时间                                  |
| execute()      | 执行字段写入                                          |
| undo()         | 撤销字段写入                                          |
| redo()         | 重新执行字段写入                                      |
| merge(command) | 合并同一表单、同一字段的已执行命令，成功时返回 `true` |

## CommonFormConfig对象参数

| 属性          | 说明                                                          | 类型                                                                                    | 必填 |
| ------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---- |
| component     | 指定使用的表单组件名称，如 `'input'`, `'select'` 等,默认input | `string`                                                                                | 否   |
| span          | 表单项在布局中占的列数（基于 24 栅格系统）                    | `number`                                                                                | 否   |
| hidden        | 控制表单项是否隐藏，支持布尔值或函数                          | `boolean \| ({formData: any, configItem: any}) => boolean`                              | 否   |
| isDisabled    | 控制表单项是否禁用                                            | `boolean \| (formData: any, configItem: any) => boolean`                                | 否   |
| labelField    | 自定义标签显示字段名                                          | `string`                                                                                | 否   |
| formItemProps | 传递给 `el-form-item` 的额外属性                              | `{ labelWidth?: string; [key: string]: any }`                                           | 否   |
| rules         | 表单验证规则，可以是数组或返回规则的函数                      | `Array<FormItemRule> \| (formData: any, item: CommonFormConfig) => Array<FormItemRule>` | 否   |
