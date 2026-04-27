# Dialog

Basic dialog component.

## Basic Usage

<demo vue="ui/dialog/basic.vue" />

## API

## Props

| Attribute  | Description                      | Type    | Default |
| ---------- | -------------------------------- | ------- | ------- |
| modelValue | Controls dialog visibility       | boolean | false   |
| modalBlur  | Enables modal background blur    | boolean | true    |
| footerHide | Hides the default footer buttons | boolean | false   |

CommonDialog also passes through Element Plus Dialog props.

## renderDialog

| Parameter   | Description                                         | Type                           |
| ----------- | --------------------------------------------------- | ------------------------------ |
| component   | Dialog content component, VNode, or render function | Component \| VNode \| Function |
| props       | Props passed to the dialog content component        | object                         |
| dialogProps | Props and events passed to CommonDialog             | DialogPropsWithEvents          |
| options     | Imperative dialog options, including appContext     | RenderDialogOptions            |

### Inherit App Context

When the dialog content needs app-level `provide`, plugins, `globalProperties`, i18n, Pinia, or router context, pass the current component instance's `appContext` to `renderDialog`.

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
      title: 'Test',
    },
    {
      appContext: instance?.appContext,
    },
  );
}
```

## Events

| Event Name | Description                  | Callback Parameters |
| ---------- | ---------------------------- | ------------------- |
| close      | Triggered when dialog closes | -                   |
