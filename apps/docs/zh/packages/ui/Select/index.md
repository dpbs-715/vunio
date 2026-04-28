# CommonSelect公共选择器

公共选择器支持select selectV2 treeSelect。

## 基础使用

<demo ssg="true" vue="ui/CommonSelect/basic.vue" />

## 组件类型

<demo ssg="true" vue="ui/CommonSelect/componentType.vue" />

## 多选

<demo ssg="true" vue="ui/CommonSelect/multiple.vue" />

## 多选添加分隔符

<demo ssg="true" vue="ui/CommonSelect/joinSplit.vue" />

## 获取请求数据

> 下面我们模拟一个请求  
> 内部默认做了api的包装器 如果想自定义可以通过hooks asyncCache包装后传入会进行复写

<demo ssg="true" vue="ui/CommonSelect/api.vue" />

## 请求结果字段对照

> 如果请求结果不是value label形式 则使用labelField valueField 获取

<demo ssg="true" vue="ui/CommonSelect/apiResultKey.vue" />

## 结果的格式转化

> 比如接口给出的数据是字符串 我们业务中存的是数字 可能就匹配不上 使用valueType

<demo ssg="true" vue="ui/CommonSelect/valueType.vue" />

## 如果请求格式不一致或者value label等需要拼接

> 使用parseData当然这个可以全局注册一下 开发中如果不满足 在config中复写下

<demo ssg="true" vue="ui/CommonSelect/parseData.vue" />

## 字典

> 首先需要在main.ts中全局注册下 这个项目的字典数据获取方法 注入这个getDictOptions参数 函数返回一个Promise 下面我们模拟下

<demo ssg="true" vue="ui/CommonSelect/dict.vue" />

## 请求参数/过滤options

> 在api情况下是给传入的函数添加参数 并且query返回的数据变化会触发用新参数请求

<demo ssg="true" vue="ui/CommonSelect/apiQuery.vue" />

<demo ssg="true" vue="ui/CommonSelect/optionsQuery.vue" />

<demo ssg="true" vue="ui/CommonSelect/dictQuery.vue" />

## 等待全部query参数都有值时 获取数据

<demo ssg="true" vue="ui/CommonSelect/needAllQueryParams.vue" />

## 自动选中

> 支持多种自动选择策略，只有 api 和 dict 才有效
>
> - `false`: 不自动选择
> - `true` 或 `'one'`: 只有一个选项时自动选择（默认行为）
> - `'first'`: 总是自动选择第一个选项
> - `'last'`: 总是自动选择最后一个选项
>
> **注意**: 如果 model 已经有值，不会执行自动选择（防止覆盖用户数据）

<demo ssg="true" vue="ui/CommonSelect/autoSelect.vue" />

## 追加选项

> 追加选项 内部会去重

<demo ssg="true" vue="ui/CommonSelect/appendOptions.vue" />

## 排序

<demo ssg="true" vue="ui/CommonSelect/sort.vue" />

## CommonSelect 属性 (Props)

| 属性                 | 说明                                                                                                         | 类型                                                 | 默认值       |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------ |
| `api`                | 请求 API 接口方法                                                                                            | `Function`                                           | -            |
| `dict`               | 字典名称，用于从字典中获取选项                                                                               | `string \| string[]`                                 | -            |
| `query`              | 请求参数配置方法                                                                                             | `Function`                                           | -            |
| `valueField`         | 值字段的对照字段名                                                                                           | `string`                                             | -            |
| `labelField`         | 文本字段的对照字段名                                                                                         | `string`                                             | -            |
| `parseData`          | 转化请求结果的方法                                                                                           | `Function`                                           | -            |
| `autoSelect`         | 自动选择策略：`false` 不选择 / `true\|'one'` 仅一个时选择 / `'first'` 总是选第一个 / `'last'` 总是选最后一个 | `boolean \| 'one' \| 'first' \| 'last'`              | `false`      |
| `multiple`           | 是否为多选                                                                                                   | `boolean`                                            | `false`      |
| `needAllQueryParams` | 是否需要传递所有查询参数                                                                                     | `boolean`                                            | `false`      |
| `appendOptions`      | 追加的选项列表或方法                                                                                         | `Record<any, any>[] \| Function`                     | -            |
| `valueType`          | 值类型，支持 `'string'`, `'String'`, `'int'`, `'Int'`                                                        | `'string' \| 'String' \| 'int' \| 'Int'`             | -            |
| `options`            | 绑定的选项列表                                                                                               | `Record<any, any>[]`                                 | -            |
| `ignoreByLabel`      | 忽略的标签列表                                                                                               | `string[]`                                           | -            |
| `disabledValues`     | 按值禁用选项，支持值列表、响应式映射对象、函数返回列表/映射或函数直接判断选项                                | `any[] \| Record<string \| number, any> \| Function` | `[]`         |
| `componentType`      | 组件类型，支持 `'ElSelectV2'`, `'ElSelect'`, `'ElTreeSelect'`                                                | `'ElSelectV2' \| 'ElSelect' \| 'ElTreeSelect'`       | `'ElSelect'` |
| `joinSplit`          | 多选时结果合并的拼接符                                                                                       | `string`                                             | 无           |
| `orderBy`            | 排序字段名                                                                                                   | `string`                                             | -            |
| `orderType`          | 排序方式，支持 `'asc'` 或 `'desc'`                                                                           | `'asc' \| 'desc'`                                    | -            |
| `getDictOptions`     | 获取字典选项的方法                                                                                           | `Function`                                           | -            |
