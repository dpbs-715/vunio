<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue';
import { ElColorPicker, ElInput } from 'element-plus';
import type { CommonColorPickerEmits, CommonColorPickerProps } from './ColorPicker.types';
import { normalizeColor } from './color';

defineOptions({
  name: 'CommonColorPicker',
  inheritAttrs: false,
});

const {
  modelValue = '',
  size = 'default',
  disabled = false,
  readonly = false,
  clearable = false,
  showAlpha = false,
  predefine = undefined,
  placeholder = '',
  colorFormat = 'auto',
} = defineProps<CommonColorPickerProps>();

const emit = defineEmits<CommonColorPickerEmits>();

interface FocusableComponent {
  focus: () => void;
  blur: () => void;
}

interface ColorPickerComponent extends FocusableComponent {
  show: () => void;
  hide: () => void;
}

const rootRef = useTemplateRef<HTMLElement>('root');
const inputRef = useTemplateRef<FocusableComponent>('input');
const colorPickerRef = useTemplateRef<ColorPickerComponent>('colorPicker');
const draftValue = ref(modelValue);
const isInvalid = ref(false);
const hasCompositeFocus = ref(false);
const panelClass = `common-color-picker-panel-${useId().replace(/[^a-z\d_-]/gi, '')}`;
const elementPlusFormat = computed(() => (colorFormat === 'auto' ? undefined : colorFormat));
const pickerValue = computed(() => (modelValue ? modelValue : null));

watch(
  () => modelValue,
  (value) => {
    draftValue.value = value;
    isInvalid.value = false;
  },
);

function emitModelValue(value: string): boolean {
  if (modelValue === value) return false;
  emit('update:modelValue', value);
  return true;
}

function acceptValue(value: string, emitChange = false) {
  draftValue.value = value;
  isInvalid.value = false;
  const hasValueChanged = emitModelValue(value);
  if (emitChange && hasValueChanged) emit('change', value);
}

function commitDraft() {
  if (disabled || readonly) return false;

  const candidate = draftValue.value?.trim() || null;
  if (!candidate) {
    if (clearable || !modelValue) {
      acceptValue('', true);
      return true;
    }
    isInvalid.value = true;
    emit('invalid', draftValue.value);
    return false;
  }

  const normalizedValue = normalizeColor(candidate, colorFormat);
  if (!normalizedValue) {
    isInvalid.value = true;
    emit('invalid', draftValue.value);
    return false;
  }

  acceptValue(normalizedValue, true);
  return true;
}

function restoreModelValue() {
  draftValue.value = modelValue;
  isInvalid.value = false;
}

function clearValue() {
  if (disabled || readonly || !clearable) return;
  acceptValue('', true);
  emit('clear');
}

function normalizePickerValue(value: string | null): string {
  if (!value) return '';
  return normalizeColor(value, colorFormat) ?? value;
}

function updateFromPicker(value: string | null) {
  if (disabled || readonly) return;
  acceptValue(normalizePickerValue(value));
}

function changeFromPicker(value: string | null) {
  if (disabled || readonly) return;
  const normalizedValue = normalizePickerValue(value);
  acceptValue(normalizedValue);
  emit('change', normalizedValue);
}

function clearFromPicker() {
  if (disabled || readonly) return;
  emit('clear');
}

function isInsideCompositeFocus(target: Element | null): boolean {
  if (!target) return false;
  if (rootRef.value?.contains(target)) return true;
  return document.querySelector(`.${panelClass}`)?.contains(target) ?? false;
}

function enterComposite(event: FocusEvent) {
  if (hasCompositeFocus.value || disabled) return;
  hasCompositeFocus.value = true;
  emit('focus', event);
}

function observeDocumentFocusIn(event: FocusEvent) {
  if (isInsideCompositeFocus(event.target as Element | null)) {
    enterComposite(event);
  }
}

function leaveComposite(event: FocusEvent) {
  window.setTimeout(() => {
    if (isInsideCompositeFocus(document.activeElement)) return;
    if (!hasCompositeFocus.value) return;

    hasCompositeFocus.value = false;
    commitDraft();
    emit('blur', event);
  });
}

onMounted(() => {
  document.addEventListener('focusin', observeDocumentFocusIn);
  document.addEventListener('focusout', leaveComposite);
});

onBeforeUnmount(() => {
  document.removeEventListener('focusin', observeDocumentFocusIn);
  document.removeEventListener('focusout', leaveComposite);
});

function focus() {
  inputRef.value?.focus();
}

function blur() {
  inputRef.value?.blur();
  colorPickerRef.value?.blur();
}

function show() {
  if (!disabled && !readonly) colorPickerRef.value?.show();
}

function hide() {
  colorPickerRef.value?.hide();
}

defineExpose({
  focus,
  blur,
  show,
  hide,
});
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="CommonColorPicker"
    :class="{
      'is-disabled': disabled,
      'is-readonly': readonly,
      'is-invalid': isInvalid,
      'is-focused': hasCompositeFocus,
    }"
    role="group"
    @focusin="enterComposite"
    @focusout="leaveComposite"
  >
    <el-color-picker
      ref="colorPicker"
      class="CommonColorPicker__swatch"
      :model-value="pickerValue"
      :size="size"
      :disabled="disabled || readonly"
      :clearable="clearable"
      :show-alpha="showAlpha"
      :predefine="predefine"
      :color-format="elementPlusFormat"
      :popper-class="['CommonColorPicker__panel', panelClass]"
      aria-label="Choose color"
      @active-change="updateFromPicker"
      @update:model-value="updateFromPicker"
      @change="changeFromPicker"
      @clear="clearFromPicker"
    />
    <el-input
      ref="input"
      v-model="draftValue"
      class="CommonColorPicker__input"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable && !readonly"
      :placeholder="placeholder"
      :aria-invalid="isInvalid ? 'true' : 'false'"
      :validate-event="false"
      autocomplete="off"
      spellcheck="false"
      @keydown.enter="commitDraft"
      @keydown.esc.stop.prevent="restoreModelValue"
      @clear="clearValue"
    />
  </div>
</template>

<style lang="scss" scoped>
@use './ColorPicker.scss' as *;
</style>
