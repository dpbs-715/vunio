# CommonSearch

Component based on CommonForm

## Globally Registered Properties

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

<demo vue="ui/CommonSearch/registerProps.vue" />

## Action Column Width

Use `actionCol` to set the grid span of the column containing the search and reset buttons. An instance prop takes precedence over the globally registered `CommonSearch.actionCol`. When the prop is omitted or set to `undefined`, the global default is used; the built-in default is `4`.

```vue
<CommonSearch v-model="queryParams" :config="config" :action-col="12" />
```

This example sets the action column span to `12` for this instance. Updating `actionCol` dynamically also updates the column width.

## Events Passed via Props

<demo vue="ui/CommonSearch/bindProps.vue" />

## Events Passed via Provide

<demo vue="ui/CommonSearch/provide.vue" />

## Props

| Attribute          | Description                                                                               | Type                                                 | Default                            |
| ------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| config             | Form configuration items, used to define the structure and behavior of search form items  | `CommonFormConfig[]`                                 | -                                  |
| col                | Defines the number of columns for different screen sizes, used for responsive layout      | `{ sm: number; md: number; lg: number; xl: number }` | `{ sm: 24, md: 12, lg: 8, xl: 6 }` |
| actionCol          | Grid span of the search and reset button column; takes precedence over the global default | `number`                                             | `4`                                |
| resetAll           | Whether to reset all form fields, including default values                                | `boolean`                                            | `false`                            |
| resetWithoutSearch | Whether not to trigger search operation when resetting                                    | `boolean`                                            | `false`                            |
