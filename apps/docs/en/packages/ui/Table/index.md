# CommonTable

Supports elTableV1 and elTableV2.

## Size

<demo vue="ui/CommonTable/size.vue" />

## Basic Usage

The following example uses config obtained via useConfigs, internally wrapped with reactive. Of course, you can also pass in an array directly.
It is recommended to use useConfigs as it allows for continuous data operation expansion.

<demo vue="ui/CommonTable/basic.vue" />

## Using Virtualization

Note that the external container needs to have a definite height and width when using virtualized tables.

<demo vue="ui/CommonTable/tableV2.vue" />

## Supports All Native Table Component Usages

Native slots will be rendered first, followed by config configuration appending. Operation columns can use fixed positioning to the right.

<demo vue="ui/CommonTable/elTable.vue" />

## Enable Index

<demo vue="ui/CommonTable/useIndex.vue" />

## Enable Selection

<demo vue="ui/CommonTable/useSelection.vue" />

## Multi-level Headers

<demo vue="ui/CommonTable/heads.vue" />

## Using Slots

```html
<template #field1="{cellData,column,rowData,rowIndex,tableData}">
  cellData: current cell data, column: current configuration item, rowData: current row data,
  rowIndex: current row index, tableData: table data
</template>
```

Special handling can be done using slots. Use field as the slot name.

<demo vue="ui/CommonTable/slots.vue" />

## Using Sorting

You can configure sortable in config for sorting. If you need to support sorting for all columns, you can use global registration to inject.

```text
registerComponentDefaultPropsMap({
    CommonTable:{
        sortable: true,
    }
})
```

<demo vue="ui/CommonTable/sort.vue" />

## Add Tips to Headers

<ClientOnly>
  <demo vue="ui/CommonTable/helpText.vue" />
</ClientOnly>

## Custom Header Rendering

```js
function renderHeaderScope({ $index, column, store, _self }, { configItem, index }) {
  //{ $index, column, store, _self } original parameters
  //$index index
  //column column configuration
  //store
  //_self
  //{ configItem, index } extended parameters
  //configItem column configuration item
  //index column index
}
```

<demo vue="ui/CommonTable/renderHeaderScope.vue" />

## Cell formatter

```js
function formatter(rowData) {
  //rowData row data
}
```

<demo vue="ui/CommonTable/formatter.vue" />

## Custom Cell Rendering

```js
function cellRenderer({ cellData, column, rowData, rowIndex, tableData }) {
  //cellData cell data
  //column column configuration
  //rowData row data
  //rowIndex row index
  //tableData table data
}
```

<demo vue="ui/CommonTable/cellRenderer.vue" />

## Hide Columns

```js
// Can be Boolean | function type | reactive
// Function type usage
function hidden({ configItem, tableData }) {
  //configItem column configuration
  //tableData table data
}
```

<demo vue="ui/CommonTable/hidden.vue" />

## Component Switching

```js
function component({ cellData, column, rowData, rowIndex, tableData }) {
  //cellData cell data
  //column column configuration
  //rowData row data
  //rowIndex row index
  //tableData table data
}
```

<demo vue="ui/CommonTable/changeComponent.vue" />

## Editable Fields

<demo vue="ui/CommonTable/edit.vue" />

## Disable Cells

```js
function isDisabled({ cellData, column, rowData, rowIndex, tableData }) {
  //cellData cell data
  //column column configuration
  //rowData row data
  //rowIndex row index
  //tableData table data

  return true | false;
}
```

<demo vue="ui/CommonTable/disabled.vue" />

## Field Validation

<demo vue="ui/CommonTable/rules.vue" />

## Row Drag and Drop Sorting

<demo vue="ui/CommonTable/drag.vue" />

## Table Props

| Parameter       | Type                  | Default | Description                                                                               |
| --------------- | --------------------- | ------- | ----------------------------------------------------------------------------------------- |
| config          | `CommonTableConfig[]` | -       | Table column configuration array, used to define properties and behaviors of each column. |
| v2              | `boolean`             | `false` | Whether to enable v2 version style and functionality (compatible with old version).       |
| data            | `DataType`            | -       | Table data source, usually an array of objects.                                           |
| loading         | `boolean`             | `false` | Whether to show loading state.                                                            |
| emptyValue      | `string`              | -       | Text displayed when data is empty.                                                        |
| useIndex        | `boolean`             | `false` | Whether to show index column.                                                             |
| useSelection    | `boolean`             | `false` | Whether to show selection column.                                                         |
| singleSelection | `boolean`             | `false` | Enable selection single selection.                                                        |
| useDrag         | `boolean`             | `false` | Enable row dragging. Can be used with dragEnd event.                                      |

## Element Plus Native Supported Props (`elTable`)

| Parameter             | Type                                     | Default                                                | Description                                                    |
| --------------------- | ---------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| rowKey                | `string \| Function \| symbol \| number` | -                                                      | Row data unique identifier field name or function.             |
| height                | `number \| string`                       | -                                                      | Table height, if string must include unit (e.g. '300px').      |
| width                 | `number \| string`                       | -                                                      | Table width, if string must include unit.                      |
| maxHeight             | `number \| string`                       | -                                                      | Table maximum height, if string must include unit.             |
| stripe                | `boolean`                                | `false`                                                | Whether to use zebra stripe table.                             |
| border                | `boolean`                                | `true`                                                 | Whether to show vertical borders.                              |
| size                  | `'large' \| 'default' \| 'small'`        | `'default'`                                            | Sets the size of table elements.                               |
| fit                   | `boolean`                                | `true`                                                 | Whether column widths are adaptive.                            |
| showHeader            | `boolean`                                | `true`                                                 | Whether to show table header.                                  |
| highlightCurrentRow   | `boolean`                                | `false`                                                | Whether to highlight current row.                              |
| currentRowKey         | `string \| number`                       | -                                                      | Current row key, used to highlight specified row.              |
| rowClassName          | `string \| Function`                     | -                                                      | Row class name or function returning class.                    |
| rowStyle              | `object \| Function`                     | -                                                      | Row inline style object or function returning style.           |
| cellClassName         | `string \| Function`                     | -                                                      | Cell class name or function returning class.                   |
| cellStyle             | `object \| Function`                     | -                                                      | Cell inline style object or function returning style.          |
| headerRowClassName    | `string \| Function`                     | -                                                      | Header row class name or function returning class.             |
| headerRowStyle        | `object \| Function`                     | -                                                      | Header row inline style object or function returning style.    |
| headerCellClassName   | `string \| Function`                     | -                                                      | Header cell class name or function returning class.            |
| headerCellStyle       | `object \| Function`                     | -                                                      | Header cell inline style object or function returning style.   |
| defaultExpandAll      | `boolean`                                | `false`                                                | Whether to expand all rows by default (valid for tree tables). |
| expandRowKeys         | `Array<string \| number>`                | -                                                      | Array of keys for initially expanded rows.                     |
| tooltipEffect         | `'dark' \| 'light'`                      | `'dark'`                                               | Tooltip theme style.                                           |
| tooltipOption         | `object`                                 | -                                                      | Custom tooltip configuration items.                            |
| showSummary           | `boolean`                                | `false`                                                | Whether to show summary row at bottom.                         |
| sumText               | `string`                                 | `'Total'`                                              | Text for first column of summary row.                          |
| summaryMethod         | `Function`                               | -                                                      | Custom summary calculation method.                             |
| spanMethod            | `Function`                               | -                                                      | Method for merging rows or columns.                            |
| selectOnIndeterminate | `boolean`                                | `false`                                                | Controls whether to select on indeterminate state.             |
| indent                | `number`                                 | `16`                                                   | Pixel indentation for each level in tree structure.            |
| lazy                  | `boolean`                                | `false`                                                | Whether to lazy load child node data.                          |
| load                  | `Function`                               | -                                                      | Lazy loading callback function for loading child node data.    |
| treeProps             | `object`                                 | `{ hasChildren: 'hasChildren', children: 'children' }` | Defines properties for tree structure.                         |
| tableLayout           | `string`                                 | `'auto'`                                               | Sets table layout method, such as 'fixed' or 'auto'.           |
| scrollbarAlwaysOn     | `boolean`                                | `false`                                                | Whether to always show scrollbar.                              |
| showOverflowTooltip   | `boolean`                                | `false`                                                | Whether to show tooltip when cell content overflows.           |
| flexible              | `boolean`                                | `false`                                                | Whether to allow free column width adjustment.                 |
| defaultColMinWidth    | `number`                                 | `80`                                                   | Minimum width for all columns.                                 |
| column                | `any`                                    | -                                                      | Compatibility parameter, not recommended.                      |

## V2 Supported Props (`elTableV2`)

| Parameter              | Type                           | Default | Description                                                        |
| ---------------------- | ------------------------------ | ------- | ------------------------------------------------------------------ |
| cache                  | `number`                       | `50`    | Render cache row count, improves scrolling performance.            |
| estimatedRowHeight     | `number`                       | `50`    | Estimated row height, used for virtual scrolling calculation.      |
| headerClass            | `string \| Function`           | -       | Header container class or dynamic generation function.             |
| headerProps            | `object \| Function`           | -       | Header container properties object or dynamic generation function. |
| headerCellProps        | `object \| Function`           | -       | Header cell properties object or dynamic generation function.      |
| headerHeight           | `number \| number[]`           | `50`    | Header height, can pass array to set multi-row header height.      |
| footerHeight           | `number`                       | `0`     | Height of footer area.                                             |
| rowClass               | `string \| Function`           | -       | Row container class or dynamic generation function.                |
| rowProps               | `object \| Function`           | -       | Row container properties object or dynamic generation function.    |
| rowHeight              | `number`                       | `50`    | Row height, used for virtual scrolling calculation.                |
| cellProps              | `object \| Function`           | -       | Cell properties object or dynamic generation function.             |
| columns                | `Column[]`                     | -       | Table column definition array.                                     |
| dataGetter             | `Function`                     | -       | Function to get row data, used in virtual scrolling scenarios.     |
| fixedData              | `RowDataType[]`                | -       | Fixed row data, often used for fixed top or bottom rows.           |
| expandedRowKeys        | `Array<string \| number>`      | -       | Array of currently expanded row keys.                              |
| defaultExpandedRowKeys | `Array<string \| number>`      | -       | Array of initially expanded row keys.                              |
| class                  | `string \| string[] \| object` | -       | Component root element class.                                      |
| fixed                  | `boolean`                      | `false` | Whether to fix columns.                                            |
| hScrollbarSize         | `number`                       | -       | Size of horizontal scrollbar.                                      |
| vScrollbarSize         | `number`                       | -       | Size of vertical scrollbar.                                        |
| sortBy                 | `object`                       | -       | Sort field and direction.                                          |
| sortState              | `object`                       | -       | Current sort state object.                                         |

## Table Config

| Attribute         | Description                                   | Type                                        | Default |
| ----------------- | --------------------------------------------- | ------------------------------------------- | ------- |
| component         | Custom cell rendering component               | `string \| ComponentType`                   | -       |
| hidden            | Whether to hide this column                   | `boolean \| Function \| Ref \| ComputedRef` | -       |
| isDisabled        | Whether to disable this column                | `Function`                                  | -       |
| labelField        | Label field name                              | [string]                                    | -       |
| rules             | Form validation rules                         | `Arrayable<FormItemRule> \| Function`       | -       |
| helpText          | Help tooltip text                             | [string]                                    | -       |
| align             | Cell alignment                                | `'left' \| 'center' \| 'right'`             | -       |
| formatter         | Custom cell content formatting function       | `Function`                                  | -       |
| columnChildren    | Child column configuration for nested headers | `CommonTableConfig[]`                       | -       |
| cellRenderer      | Custom cell rendering function                | `Function`                                  | -       |
| renderHeaderScope | Custom header title rendering function        | `Function`                                  | -       |

## Element Plus Config Native Supported Attributes (el-table-column)

| Attribute           | Description                                  | Type                                               | Default |
| ------------------- | -------------------------------------------- | -------------------------------------------------- | ------- |
| type                | Column type (selection/index/expand)         | [string]                                           | -       |
| index               | Custom index column starting value           | [number]                                           | -       |
| columnKey           | Column unique identifier                     | [string]                                           | -       |
| width               | Column width                                 | [number]                                           | -       |
| minWidth            | Minimum column width                         | `string \| number`                                 | -       |
| fixed               | Whether column is fixed                      | `boolean`                                          | -       |
| renderHeader        | Custom header rendering function             | `Function`                                         | -       |
| sortable            | Whether sortable                             | `boolean`                                          | -       |
| sortMethod          | Custom sort method                           | `Function`                                         | -       |
| sortBy              | Sort field                                   | `string \| string[] \| Function`                   | -       |
| sortOrders          | Sort order array                             | `string[]`                                         | -       |
| resizable           | Whether column width is adjustable           | `boolean`                                          | `true`  |
| showOverflowTooltip | Show tooltip on overflow                     | `boolean`                                          | -       |
| headerAlign         | Header alignment                             | `'left' \| 'center' \| 'right'`                    | -       |
| reserveSelection    | Reserve selected items in multiple selection | `boolean`                                          | -       |
| filters             | Data filtering conditions                    | `Array<{ text: string; value: string \| number }>` | -       |
| filterPlacement     | Filter popup position                        | [string]                                           | -       |
| filterMultiple      | Whether multiple filter selection            | `boolean`                                          | `true`  |
| filterMethod        | Custom filter method                         | `Function`                                         | -       |
| filteredValue       | Current column filter value                  | `string[]`                                         | -       |

## tableV2 Config

| Attribute  | Description                                                                             | Type                                        |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------- |
| component  | Specifies a Vue component for rendering cell content in this column                     | `string \| ComponentType`                   |
| hidden     | Controls whether current column is hidden, supports boolean or function dynamic control | `boolean \| Function \| Ref \| ComputedRef` |
| isDisabled | Determines whether current column is disabled (often used for permission control)       | `Function`                                  |
| labelField | Sets the label display field name for form fields                                       | [string]                                    |
| rules      | Form validation rules, supports array or function returning rules                       | `Arrayable<FormItemRule> \| Function`       |
| helpText   | Help tooltip text displayed next to form items                                          | [string]                                    |
| align      | Sets cell content alignment                                                             | `'left' \| 'center' \| 'right'`             |
| formatter  | Custom formatting function for modifying cell display content                           | `Function`                                  |
