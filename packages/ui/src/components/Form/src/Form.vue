<script setup lang="ts">
import type { Config } from '~/components/CreateComponent/src/cc.types';
import { CreateComponent } from '~/components/CreateComponent';
import type { CommonFormConfig, CommonFormProps } from './Form.types';
import {
  getCurrentInstance,
  toValue,
  ref,
  nextTick,
  h,
  type PropType,
  defineComponent,
  reactive,
} from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus';
import { configIterator, getRules, isHidden, useComponentProps } from '~/_utils/componentUtils.ts';
import { DataHandlerClass } from '~/_utils/dataHandlerClass.ts';
import { provideFormContext } from './formContext.ts';
import { isEmpty } from '@vunio/utils';

defineOptions({
  name: 'CommonForm',
  inheritAttrs: false,
});
const vm = getCurrentInstance();
const props = defineProps<CommonFormProps>();
const formProps: any = useComponentProps(props, 'CommonForm', ['config']);

const formData: Record<string, any> = defineModel('modelValue', {
  type: Object,
  default: () => reactive({}),
});
const formRef = ref();

// 使用 createContext 收集子组件的 ready Promise
const childrenReadyPromises: Promise<void>[] = [];
provideFormContext({
  registerComponentReady: (promise: Promise<void>) => {
    childrenReadyPromises.push(promise);
  },
});

/**
 * 等待所有子组件（如 Select）准备就绪
 * 在填充表单数据前调用此方法，确保所有 Select 的 options 已加载完成
 *
 * @returns {Promise<void>} 当所有子组件准备就绪时 resolve
 */
async function waitForReady() {
  await Promise.all(childrenReadyPromises);
}

/**
 * 表单验证函数
 * 在表单提交前调用此函数，以验证表单是否符合规则
 *
 * @returns {Promise} 返回一个Promise对象，验证通过则resolve，否则reject
 */
function validateForm(fieldArr: string[]) {
  return new Promise((resolve, reject) => {
    // 调用表单组件的validateField方法，对所有表单字段进行验证
    if (formRef.value) {
      formRef.value
        .validateField(fieldArr || [])
        .then(() => {
          resolve(undefined);
        })
        .catch((error: any) => {
          moveToErr();
          reject(error);
        });
    } else {
      resolve(undefined);
    }
  });
}
function moveToErr() {
  nextTick(() => {
    let isError = document.getElementsByClassName('is-error');
    if (isError.length) {
      isError[0].scrollIntoView({
        block: 'center',
        behavior: 'smooth',
        inline: 'center',
      });
    }
  });
}

/**
 * 检查span
 * */
function checkSpan(item: CommonFormConfig, num: number) {
  //可以大不可以小
  return Number(item?.span) > num ? item.span : num;
}

function getConfig(item: CommonFormConfig): Config {
  const cfg = {
    component: 'input',
  };
  configIterator(cfg, {
    config: item,
    writeArgs: { formData: toValue(formData), configItem: item },
  });
  return cfg as Config;
}

function collectFormRef(instance: any) {
  if (vm) {
    formRef.value =
      vm.exposeProxy =
      vm.exposed =
        {
          ...(instance || {}),
          validateForm,
          getFormData: () => toValue(formData),
          waitForReady,
        };
  }
}

const translateComponent: string[] = [
  'select',
  'radioGroup',
  'checkboxGroup',
  'commonSelect',
  'commonSelectOrDialog',
];

const transformModel = defineComponent({
  name: 'TransformModel',
  props: {
    config: {
      type: Object as PropType<CommonFormConfig>,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:field'],
  setup: (props: any, { emit }: any) => {
    let dataHandler: DataHandlerClass;
    const readValue = ref<string>('');

    return () => {
      const modelMap: Record<string, any> = {};
      const model = props.config.model;
      for (const key in model) {
        modelMap[key] = props.formData[model[key]];
        modelMap[`onUpdate:${key}`] = (val: any) => {
          emit('update:field', { field: model[key], value: val });
        };
      }
      //只读展示处理
      if (formProps.value.readonly) {
        const { readField, field, component } = props.config;
        //如果设置了读取字段 直接返回
        if (readField) {
          return props.formData[readField];
        }
        let v;
        //需要处理的组件
        if (translateComponent.includes(component)) {
          if (!dataHandler) {
            dataHandler = new DataHandlerClass(props.config.props);
            dataHandler.afterInit = () => {
              readValue.value = dataHandler.getLabelByValue(props.formData[field]);
            };
          }
          dataHandler.initOptions();
          v = readValue.value;
        } else {
          v = props.formData[field];
        }

        if (isEmpty(v)) {
          return toValue(formProps).emptyValue;
        } else {
          return v;
        }
      }

      return h(CreateComponent, {
        modelValue: props.formData[props.config.field],
        [`onUpdate:modelValue`]: (val: any) => {
          emit('update:field', { field: props.config.field, value: val });
        },
        ...modelMap,
        config: getConfig(props.config),
      });
    };
  },
});
</script>

<template>
  <el-form v-bind="formProps" :ref="collectFormRef" class="commonForm" :model="formData">
    <el-row :gutter="20">
      <template v-for="item in props.config" :key="item.field">
        <el-col
          v-if="!isHidden(item, { formData: toValue(formData) })"
          :sm="checkSpan(item, formProps.col.sm)"
          :md="checkSpan(item, formProps.col.md)"
          :lg="checkSpan(item, formProps.col.lg)"
          :xl="item.span || formProps.col.xl"
        >
          <el-form-item
            style="width: 100%"
            :rules="getRules(item, { formData: toValue(formData) })"
            :prop="item.field"
            :label="`${item.label}:`"
            v-bind="item.formItemProps"
          >
            <el-skeleton v-if="formProps.loading" animated :rows="0" />
            <slot :name="item.field" :config="item">
              <transformModel
                :config="item"
                :form-data="formData"
                @update:field="({ field, value }: Record<string, any>) => (formData[field] = value)"
              />
            </slot>
          </el-form-item>
        </el-col>
      </template>
      <slot name="moreCol" />
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
@use './Form.scss' as *;
</style>
