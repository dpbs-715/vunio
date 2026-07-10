# CommonForm

Public form.

## Basic Usage

<demo vue="ui/CommonForm/basic.vue" />

## Form Default Parameters

Used in main.ts

```js
registerComponentDefaultPropsMap({
  CommonForm: {
    size: 'large', // Size configuration
    col: {
      // Default column configuration
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
    },
    //... other elForm parameters
  },
});
```

## Span Set Width

<demo vue="ui/CommonForm/span.vue" />

## Hide Fields

<demo vue="ui/CommonForm/hidden.vue" />

## Switch Components

<demo vue="ui/CommonForm/changeComponent.vue" />

## Disable Fields

<demo vue="ui/CommonForm/disabled.vue" />

## Functional Configuration Parameters

For example, elSelect's change event. CommonForm uniformly appends parameters to functional configurations

<demo vue="ui/CommonForm/functionArgs.vue" />

## Field Slots

<demo vue="ui/CommonForm/fieldSlot.vue" />

In addition to `config`, each field slot receives the current `modelValue` and an
`updateModelValue(value)` function. Writes made through this function pass through
`commandDispatcher`, so custom fields and generated fields can share one command history.

## Command-based Undo and Redo

`CommonForm` does not own a history stack. When `commandDispatcher` is provided, every field
write creates a `CommonFormCommand`; the consumer decides how commands are executed, merged,
undone, and redone. Without this prop, the form keeps its existing direct-write behavior.

<demo vue="ui/CommonForm/commandHistory.vue" />

The dispatcher must call `command.execute()` first. To coalesce continuous typing, call
`previousCommand.merge(command)` inside the merge window chosen by the application. Clear the
redo stack whenever a new command is executed after an undo.

If external code replaces the entire `modelValue`, clear that form's command history because
existing inverse operations belong to the previous model object.

## Validation Rules

<demo vue="ui/CommonForm/rules.vue" />

## API

| Method       | Description                  |
| ------------ | ---------------------------- |
| validateForm | Form validation              |
| ...          | Other elForm exposed methods |

## Props

| Attribute         | Description                                                        | Type                                   | Default |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------- | ------- |
| config            | Component generation configuration                                 | CommonFormConfig[]                     | None    |
| commandDispatcher | Dispatches field commands for consumer-owned execution and history | `(command: CommonFormCommand) => void` | None    |
| ...               | Other elForm parameters                                            | CommonFormProps                        | None    |

## CommonFormCommand

| Member         | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| kind           | Command kind; field writes use `common-form:set-field`                                |
| field          | Field path written by the command                                                     |
| createdAt      | Time when the command was created                                                     |
| updatedAt      | Time when the command was last merged                                                 |
| execute()      | Executes the field write                                                              |
| undo()         | Reverts the field write                                                               |
| redo()         | Executes the field write again                                                        |
| merge(command) | Merges executed commands for the same form model and field; returns `true` on success |

## CommonFormConfig Object Parameters

| Attribute     | Description                                                                                    | Type                                                                                    | Required |
| ------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------- |
| component     | Specifies the form component name to be used, such as 'input', 'select', etc. Default is input | `string`                                                                                | No       |
| span          | Number of columns occupied by the form item in the layout (based on 24 grid system)            | `number`                                                                                | No       |
| hidden        | Controls whether the form item is hidden, supports boolean or function                         | `boolean \| ({formData: any, configItem: any}) => boolean`                              | No       |
| isDisabled    | Controls whether the form item is disabled                                                     | `boolean \| (formData: any, configItem: any) => boolean`                                | No       |
| labelField    | Custom label display field name                                                                | `string`                                                                                | No       |
| formItemProps | Additional attributes passed to `el-form-item`                                                 | `{ labelWidth?: string; [key: string]: any }`                                           | No       |
| rules         | Form validation rules, can be an array or a function returning rules                           | `Array<FormItemRule> \| (formData: any, item: CommonFormConfig) => Array<FormItemRule>` | No       |
