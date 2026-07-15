# CommonColorPicker

`CommonColorPicker` combines an independent swatch, the complete Element Plus color panel, and an editable color text field. Incomplete drafts are allowed while typing and are committed only on Enter or when focus leaves the whole composite control.

## Basic usage

Click the swatch to open the color panel, or type, copy, and paste a color value directly.

<demo ssg="true" vue="ui/CommonColorPicker/basic.vue" />

## Alpha colors

Enable `show-alpha` to display alpha controls in the panel. `clearable` allows clearing from either the input or panel. Transparent and translucent colors are shown over a checkerboard.

<demo ssg="true" vue="ui/CommonColorPicker/alpha.vue" />

## Predefined colors

Pass product-specific choices through `predefine`. The component does not persist recent colors or access `localStorage`.

<demo ssg="true" vue="ui/CommonColorPicker/predefine.vue" />

## Disabled and readonly

`disabled` disables the complete control. `readonly` prevents edits and panel opening while keeping the text focusable, selectable, and copyable.

<demo ssg="true" vue="ui/CommonColorPicker/states.vue" />

## Invalid input

The first version supports `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, `rgb()`, `rgba()`, and `transparent`. Invalid text never overwrites `modelValue`; the draft remains visible with an error border, `aria-invalid="true"`, and an `invalid` event. Press Escape to discard the draft and restore the external value.

<demo ssg="true" vue="ui/CommonColorPicker/invalid.vue" />

## Using with CommonForm

`color` is registered in the `CreateComponent` `BaseMap`, so consumers do not need to register `ElColorPicker` manually.

```ts
{
  label: 'Background color',
  field: 'backgroundColor',
  component: 'color'
}
```

<demo ssg="true" vue="ui/CommonColorPicker/form.vue" />

## Props

| Prop          | Description                                        | Type                              | Default     |
| ------------- | -------------------------------------------------- | --------------------------------- | ----------- |
| `modelValue`  | Current committed color                            | `string`                          | `''`        |
| `size`        | Control size                                       | `'large' \| 'default' \| 'small'` | `'default'` |
| `disabled`    | Disables the complete control                      | `boolean`                         | `false`     |
| `readonly`    | Makes the control readonly                         | `boolean`                         | `false`     |
| `clearable`   | Allows clearing the value                          | `boolean`                         | `false`     |
| `showAlpha`   | Shows alpha controls in the color panel            | `boolean`                         | `false`     |
| `predefine`   | Predefined color choices                           | `string[]`                        | -           |
| `placeholder` | Input placeholder                                  | `string`                          | `''`        |
| `colorFormat` | Commit format; `auto` preserves the Hex/RGB family | `'auto' \| 'hex' \| 'rgb'`        | `'auto'`    |

## Events

| Event               | Description                                                      | Parameters            |
| ------------------- | ---------------------------------------------------------------- | --------------------- |
| `update:modelValue` | Emitted by valid text commits, live panel selection, or clearing | `(value: string)`     |
| `change`            | Emitted by text commits, panel confirmation, or clearing         | `(value: string)`     |
| `focus`             | Emitted when focus first enters the composite control            | `(event: FocusEvent)` |
| `blur`              | Emitted after focus leaves the input, swatch, and color panel    | `(event: FocusEvent)` |
| `clear`             | Emitted when the color is cleared                                | `()`                  |
| `invalid`           | Emitted for invalid text while `modelValue` remains unchanged    | `(value: string)`     |
