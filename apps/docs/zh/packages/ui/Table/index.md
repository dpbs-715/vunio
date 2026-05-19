# CommonTable公共表格

支持elTableV1与elTableV2。

## 尺寸

<demo ssg="true" vue="ui/CommonTable/size.vue" />

## 基础使用

下面案例使用了useConfigs拿到的config,内部用reactive包装了下,当然直接传入一个数组也可以
推荐使用useConfigs后面不断扩展函数做一些数据操作

<demo ssg="true" vue="ui/CommonTable/basic.vue" />

## 使用虚拟化

使用虚拟化表格时注意外部容器需要确定高度宽度

<demo ssg="true" vue="ui/CommonTable/tableV2.vue" />

## 支持原生的所有table组件用法

会先渲染原生插槽 后追加config配置 操作列可以使用fixed定位到右边

<demo ssg="true" vue="ui/CommonTable/elTable.vue" />

## 启用序号

<demo ssg="true" vue="ui/CommonTable/useIndex.vue" />

## 启用选择

<demo ssg="true" vue="ui/CommonTable/useSelection.vue" />

## 多级表头

<demo ssg="true" vue="ui/CommonTable/heads.vue" />

## 使用插槽

```html
<template #field1="{cellData,column,rowData,rowIndex,tableData}">
  cellData 当前单元格数据 column 当前配置项 rowData 当前行数据 rowIndex 当行索引 tableData 表格数据
</template>
```

需要特殊处理的可以使用插槽 根据field 作为插槽名使用

<demo ssg="true" vue="ui/CommonTable/slots.vue" />

## 使用排序

可以在config配置sortable排序 如果需要全部支持排序可以使用全局注册的方式注入

```text
registerComponentDefaultPropsMap({
    CommonTable:{
        sortable: true,
    }
})
```

<demo ssg="true" vue="ui/CommonTable/sort.vue" />

## 表头添加提示

<demo ssg="true" vue="ui/CommonTable/helpText.vue" />

## 自定义头部渲染

```js
function renderHeaderScope({ $index, column, store, _self }, { configItem, index }) {
  //{ $index, column, store, _self } 原始参数
  //$index 索引
  //column 列配置
  //store
  //_self
  //{ configItem, index } 扩展参数
  //configItem 列配置项
  //index 列索引
}
```

<demo ssg="true" vue="ui/CommonTable/renderHeaderScope.vue" />

## 单元格formatter

```js
function formatter(rowData) {
  //rowData 行数据
}
```

<demo ssg="true" vue="ui/CommonTable/formatter.vue" />

## 单元格自定义渲染

```js
function cellRenderer({ cellData, column, rowData, rowIndex, tableData }) {
  //cellData 单元格数据
  //column column配置
  //rowData 行数据
  //rowIndex 行索引
  //tableData 表格数据
}
```

<demo ssg="true" vue="ui/CommonTable/cellRenderer.vue" />

## 隐藏列

```js
//可以是 Boolean | 函数型 | 响应式
//函数型用法
function hidden({ configItem, tableData }) {
  //configItem 列配置
  //tableData 表格数据
}
```

<demo ssg="true" vue="ui/CommonTable/hidden.vue" />

## 组件切换

```js
function component({ cellData, column, rowData, rowIndex, tableData }) {
  //cellData 单元格数据
  //column column配置
  //rowData 行数据
  //rowIndex 行索引
  //tableData 表格数据
}
```

<demo ssg="true" vue="ui/CommonTable/changeComponent.vue" />

## 字段可编辑

<demo ssg="true" vue="ui/CommonTable/edit.vue" />

## 禁用单元格

```js
function isDisabled({ cellData, column, rowData, rowIndex, tableData }) {
  //cellData 单元格数据
  //column column配置
  //rowData 行数据
  //rowIndex 行索引
  //tableData 表格数据

  return true | false;
}
```

<demo ssg="true" vue="ui/CommonTable/disabled.vue" />

## 字段校验

<demo ssg="true" vue="ui/CommonTable/rules.vue" />

## 行拖拽排序

<demo ssg="true" vue="ui/CommonTable/drag.vue" />

## Table Props

| 参数            | 类型                  | 默认值  | 说明                                       |
| --------------- | --------------------- | ------- | ------------------------------------------ |
| config          | `CommonTableConfig[]` | -       | 表格列配置数组，用于定义每列的属性和行为。 |
| v2              | `boolean`             | `false` | 是否启用 v2 版本样式与功能（兼容旧版）。   |
| data            | `DataType`            | -       | 表格数据源，通常是一个对象数组。           |
| loading         | `boolean`             | `false` | 是否显示加载状态。                         |
| emptyValue      | `string`              | -       | 数据为空时显示的文本。                     |
| useIndex        | `boolean`             | `false` | 是否显示索引列。                           |
| useSelection    | `boolean`             | `false` | 是否显示多选列。                           |
| singleSelection | `boolean`             | `false` | 启用selection单选。                        |
| useDrag         | `boolean`             | `false` | 启用行拖拽。可以配合使用dragEnd事件        |

## Element Plus 原生支持 Props (`elTable`)

| 参数                  | 类型                                     | 默认值                                                 | 说明                                             |
| --------------------- | ---------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| rowKey                | `string \| Function \| symbol \| number` | -                                                      | 行数据唯一标识字段名或函数。                     |
| height                | `number \| string`                       | -                                                      | 表格高度，若为字符串则需包含单位（如 '300px'）。 |
| width                 | `number \| string`                       | -                                                      | 表格宽度，若为字符串则需包含单位。               |
| maxHeight             | `number \| string`                       | -                                                      | 表格最大高度，若为字符串则需包含单位。           |
| stripe                | `boolean`                                | `false`                                                | 是否为斑马纹表格。                               |
| border                | `boolean`                                | `false`                                                | 是否带有纵向边框。                               |
| size                  | `'large' \| 'default' \| 'small'`        | `'default'`                                            | 设置表格元素的尺寸。                             |
| fit                   | `boolean`                                | `true`                                                 | 列的宽度是否自适应。                             |
| showHeader            | `boolean`                                | `true`                                                 | 是否显示表头。                                   |
| highlightCurrentRow   | `boolean`                                | `false`                                                | 是否高亮当前行。                                 |
| currentRowKey         | `string \| number`                       | -                                                      | 当前行的 key，用于高亮指定行。                   |
| rowClassName          | `string \| Function`                     | -                                                      | 行的 class 名称或返回 class 的函数。             |
| rowStyle              | `object \| Function`                     | -                                                      | 行的内联样式对象或返回样式的函数。               |
| cellClassName         | `string \| Function`                     | -                                                      | 单元格的 class 名称或返回 class 的函数。         |
| cellStyle             | `object \| Function`                     | -                                                      | 单元格的内联样式对象或返回样式的函数。           |
| headerRowClassName    | `string \| Function`                     | -                                                      | 表头行的 class 名称或返回 class 的函数。         |
| headerRowStyle        | `object \| Function`                     | -                                                      | 表头行的内联样式对象或返回样式的函数。           |
| headerCellClassName   | `string \| Function`                     | -                                                      | 表头单元格的 class 名称或返回 class 的函数。     |
| headerCellStyle       | `object \| Function`                     | -                                                      | 表头单元格的内联样式对象或返回样式的函数。       |
| defaultExpandAll      | `boolean`                                | `false`                                                | 是否默认展开所有行（树形表格时有效）。           |
| expandRowKeys         | `Array<string \| number>`                | -                                                      | 可控制初始展开的行 keys 数组。                   |
| tooltipEffect         | `'dark' \| 'light'`                      | `'dark'`                                               | tooltip 主题样式。                               |
| tooltipOption         | `object`                                 | -                                                      | 自定义 tooltip 配置项。                          |
| showSummary           | `boolean`                                | `false`                                                | 是否在底部显示合计行。                           |
| sumText               | `string`                                 | `'合计'`                                               | 合计行第一列的文本。                             |
| summaryMethod         | `Function`                               | -                                                      | 自定义合计计算方法。                             |
| spanMethod            | `Function`                               | -                                                      | 合并行或列的方法。                               |
| selectOnIndeterminate | `boolean`                                | `false`                                                | 控制复选框是否在不确定状态下选择。               |
| indent                | `number`                                 | `16`                                                   | 树形结构中每一层缩进的像素数。                   |
| lazy                  | `boolean`                                | `false`                                                | 是否懒加载子节点数据。                           |
| load                  | `Function`                               | -                                                      | 懒加载回调函数，用于加载子节点数据。             |
| treeProps             | `object`                                 | `{ hasChildren: 'hasChildren', children: 'children' }` | 定义树形结构的属性名。                           |
| tableLayout           | `string`                                 | `'auto'`                                               | 设置表格的布局方式，如 'fixed' 或 'auto'。       |
| scrollbarAlwaysOn     | `boolean`                                | `false`                                                | 是否始终显示滚动条。                             |
| showOverflowTooltip   | `boolean`                                | `false`                                                | 单元格内容溢出时是否显示 tooltip。               |
| flexible              | `boolean`                                | `false`                                                | 是否允许列宽自由调整。                           |
| defaultColMinWidth    | `number`                                 | `80`                                                   | 所有列的最小宽度。                               |
| column                | `any`                                    | -                                                      | 兼容性参数，不推荐使用。                         |

## V2 支持 Props (`elTableV2`)

| 参数                   | 类型                           | 默认值  | 说明                                   |
| ---------------------- | ------------------------------ | ------- | -------------------------------------- |
| cache                  | `number`                       | `50`    | 渲染缓存行数，提高滚动性能。           |
| estimatedRowHeight     | `number`                       | `50`    | 预估行高，用于虚拟滚动计算。           |
| headerClass            | `string \| Function`           | -       | 表头容器的 class 或动态生成函数。      |
| headerProps            | `object \| Function`           | -       | 表头容器的属性对象或动态生成函数。     |
| headerCellProps        | `object \| Function`           | -       | 表头单元格的属性对象或动态生成函数。   |
| headerHeight           | `number \| number[]`           | `50`    | 表头高度，可传入数组设置多行表头高度。 |
| footerHeight           | `number`                       | `0`     | 底部区域的高度。                       |
| rowClass               | `string \| Function`           | -       | 行容器的 class 或动态生成函数。        |
| rowProps               | `object \| Function`           | -       | 行容器的属性对象或动态生成函数。       |
| rowHeight              | `number`                       | `50`    | 行高，用于虚拟滚动计算。               |
| cellProps              | `object \| Function`           | -       | 单元格的属性对象或动态生成函数。       |
| columns                | `Column[]`                     | -       | 表格列定义数组。                       |
| dataGetter             | `Function`                     | -       | 获取行数据的函数，用于虚拟滚动场景。   |
| fixedData              | `RowDataType[]`                | -       | 固定行数据，常用于固定顶部或底部行。   |
| expandedRowKeys        | `Array<string \| number>`      | -       | 当前展开的行 keys 数组。               |
| defaultExpandedRowKeys | `Array<string \| number>`      | -       | 初始展开的行 keys 数组。               |
| class                  | `string \| string[] \| object` | -       | 组件根元素的 class。                   |
| fixed                  | `boolean \| string`            | `false` | 是否固定列。                           |
| hScrollbarSize         | `number`                       | -       | 水平滚动条的大小。                     |
| vScrollbarSize         | `number`                       | -       | 垂直滚动条的大小。                     |
| sortBy                 | `object`                       | -       | 排序字段及方向。                       |
| sortState              | `object`                       | -       | 当前排序状态对象。                     |

## Table Config

| 属性              | 说明                       | 类型                                        | 默认值 |
| ----------------- | -------------------------- | ------------------------------------------- | ------ |
| component         | 自定义单元格渲染组件       | `string \| ComponentType`                   | -      |
| hidden            | 是否隐藏该列               | `boolean \| Function \| Ref \| ComputedRef` | -      |
| isDisabled        | 是否禁用该列               | `Function`                                  | -      |
| labelField        | 标签字段名                 | [string]                                    | -      |
| rules             | 表单校验规则               | `Arrayable<FormItemRule> \| Function`       | -      |
| helpText          | 帮助提示文本               | [string]                                    | -      |
| align             | 单元格对齐方式             | `'left' \| 'center' \| 'right'`             | -      |
| formatter         | 自定义单元格内容格式化函数 | `Function`                                  | -      |
| columnChildren    | 子列配置，用于嵌套表头     | `CommonTableConfig[]`                       | -      |
| cellRenderer      | 自定义单元格渲染函数       | `Function`                                  | -      |
| renderHeaderScope | 自定义表头标题渲染函数     | `Function`                                  | -      |

## Element Plus Config 原生支持属性（el-table-column）

| 属性                | 说明                                | 类型                                               | 默认值 |
| ------------------- | ----------------------------------- | -------------------------------------------------- | ------ |
| type                | 列类型（selection/index/expand 等） | [string]                                           | -      |
| index               | 自定义索引列的起始值                | [number]                                           | -      |
| columnKey           | 列唯一标识符                        | [string]                                           | -      |
| width               | 列宽度                              | [number]                                           | -      |
| minWidth            | 最小列宽                            | `string \| number`                                 | -      |
| fixed               | 列是否固定                          | `boolean \| string`                                | -      |
| renderHeader        | 自定义表头渲染函数                  | `Function`                                         | -      |
| sortable            | 是否可排序                          | `boolean`                                          | -      |
| sortMethod          | 自定义排序方法                      | `Function`                                         | -      |
| sortBy              | 排序字段                            | `string \| string[] \| Function`                   | -      |
| sortOrders          | 排序顺序数组                        | `string[]`                                         | -      |
| resizable           | 是否可调整列宽                      | `boolean`                                          | `true` |
| showOverflowTooltip | 超出显示 tooltip                    | `boolean`                                          | -      |
| headerAlign         | 表头对齐方式                        | `'left' \| 'center' \| 'right'`                    | -      |
| reserveSelection    | 多选时保留已选项                    | `boolean`                                          | -      |
| filters             | 数据过滤条件                        | `Array<{ text: string; value: string \| number }>` | -      |
| filterPlacement     | 过滤弹窗位置                        | [string]                                           | -      |
| filterMultiple      | 是否多选过滤                        | `boolean`                                          | `true` |
| filterMethod        | 自定义过滤方法                      | `Function`                                         | -      |
| filteredValue       | 当前列的过滤值                      | `string[]`                                         | -      |

## tableV2 Config

| 属性       | 说明                                         | 类型                                        |
| ---------- | -------------------------------------------- | ------------------------------------------- |
| component  | 指定一个 Vue 组件用于渲染该列单元格内容      | `string \| ComponentType`                   |
| hidden     | 控制当前列是否隐藏，支持布尔值或函数动态控制 | `boolean \| Function \| Ref \| ComputedRef` |
| isDisabled | 判断当前列是否禁用（常用于权限控制）         | `Function`                                  |
| labelField | 设置表单字段的 label 显示字段名              | [string]                                    |
| rules      | 表单校验规则，支持数组或函数返回规则         | `Arrayable<FormItemRule> \| Function`       |
| helpText   | 显示在表单项旁边的帮助提示文字               | [string]                                    |
| align      | 设置单元格内容对齐方式                       | `'left' \| 'center' \| 'right'`             |
| formatter  | 自定义格式化函数，用于修改单元格显示内容     | `Function`                                  |
