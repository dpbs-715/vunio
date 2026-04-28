# CommonSelect

Public selector supporting select, selectV2, and treeSelect.

## Basic Usage

<demo vue="ui/CommonSelect/basic.vue" />

## Component Types

<demo vue="ui/CommonSelect/componentType.vue" />

## Multiple Selection

<demo vue="ui/CommonSelect/multiple.vue" />

## Multiple Selection with Delimiter

<demo vue="ui/CommonSelect/joinSplit.vue" />

## Get Request Data

> Below we simulate a request
> Internally, the default API wrapper is used. If you want to customize it, you can override it by wrapping with hooks asyncCache

<demo vue="ui/CommonSelect/api.vue" />

## Request Result Field Mapping

> If the request result is not in value-label format, use labelField and valueField to get

<demo vue="ui/CommonSelect/apiResultKey.vue" />

## Result Format Conversion

> For example, if the interface gives string data but we store numbers in the business, they may not match. Use valueType

<demo vue="ui/CommonSelect/valueType.vue" />

## If the request format is inconsistent or value/label needs to be concatenated

> Use parseData. You can register this globally. If it doesn't meet requirements during development, override it in config

<demo vue="ui/CommonSelect/parseData.vue" />

## Dictionary

> First, you need to globally register the dictionary data acquisition method for this project in main.ts and inject the getDictOptions parameter. The function returns a Promise. Let's simulate it below

<demo vue="ui/CommonSelect/dict.vue" />

## Request Parameters/Filter Options

> In the API case, parameters are added to the passed function, and changes in query return data will trigger a new request with new parameters

<demo vue="ui/CommonSelect/apiQuery.vue" />

<demo vue="ui/CommonSelect/optionsQuery.vue" />

<demo vue="ui/CommonSelect/dictQuery.vue" />

## Wait for All Query Parameters to Have Values Before Getting Data

<demo vue="ui/CommonSelect/needAllQueryParams.vue" />

## Auto Selection

> Supports multiple auto-selection strategies. Only valid for API and dict
>
> - `false`: No auto-selection
> - `true` or `'one'`: Auto-select when there's only one option (default behavior)
> - `'first'`: Always auto-select the first option
> - `'last'`: Always auto-select the last option
>
> **Note**: If model already has a value, auto-selection won't execute (prevents overwriting user data)

<demo vue="ui/CommonSelect/autoSelect.vue" />

## Append Options

> Append options. Internal deduplication will be performed

<demo vue="ui/CommonSelect/appendOptions.vue" />

## Sorting

<demo vue="ui/CommonSelect/sort.vue" />

## CommonSelect Attributes (Props)

| Attribute            | Description                                                                                                                   | Type                                                 | Default      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------ |
| `api`                | Request API interface method                                                                                                  | `Function`                                           | -            |
| `dict`               | Dictionary name, used to get options from dictionary                                                                          | `string \| string[]`                                 | -            |
| `query`              | Request parameter configuration method                                                                                        | `Function`                                           | -            |
| `valueField`         | Value field mapping field name                                                                                                | `string`                                             | -            |
| `labelField`         | Text field mapping field name                                                                                                 | `string`                                             | -            |
| `parseData`          | Method to transform request results                                                                                           | `Function`                                           | -            |
| `autoSelect`         | Auto-selection strategy: `false` no selection / `true\|'one'` select when one / `'first'` always first / `'last'` always last | `boolean \| 'one' \| 'first' \| 'last'`              | `false`      |
| `multiple`           | Whether it is multiple selection                                                                                              | `boolean`                                            | `false`      |
| `needAllQueryParams` | Whether to pass all query parameters                                                                                          | `boolean`                                            | `false`      |
| `appendOptions`      | Appended option list or method                                                                                                | `Record<any, any>[] \| Function`                     | -            |
| `valueType`          | Value type, supports 'string', 'String', 'int', 'Int'                                                                         | `'string' \| 'String' \| 'int' \| 'Int'`             | -            |
| `options`            | Bound option list                                                                                                             | `Record<any, any>[]`                                 | -            |
| `ignoreByLabel`      | Ignored label list                                                                                                            | `string[]`                                           | -            |
| `disabledValues`     | Disable options by value. Supports value arrays, reactive maps, functions returning arrays/maps, or predicate functions       | `any[] \| Record<string \| number, any> \| Function` | `[]`         |
| `componentType`      | Component type, supports 'ElSelectV2', 'ElSelect', 'ElTreeSelect'                                                             | `'ElSelectV2' \| 'ElSelect' \| 'ElTreeSelect'`       | `'ElSelect'` |
| `joinSplit`          | Concatenation delimiter when merging results in multiple selection                                                            | `string`                                             | None         |
| `orderBy`            | Sort field name                                                                                                               | `string`                                             | -            |
| `orderType`          | Sort order, supports 'asc' or 'desc'                                                                                          | `'asc' \| 'desc'`                                    | -            |
| `getDictOptions`     | Method to get dictionary options                                                                                              | `Function`                                           | -            |
