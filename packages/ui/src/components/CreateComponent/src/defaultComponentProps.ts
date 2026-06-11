export default {
  input: {
    placeholder: '请输入{label}',
  },
  inputNumber: {
    placeholder: '请输入{label}',
  },
  select: {
    placeholder: '请选择{label}',
  },
  commonSelect: {
    placeholder: '请选择{label}',
  },
  datePicker: {
    placeholder: '请选择{label}',
  },
  treeSelect: {
    placeholder: '请选择{label}',
  },
  CommonDescriptions: {
    border: true,
  },
  //表单配置
  CommonForm: {
    emptyValue: '/',
    labelWidth: 'auto',
    col: {
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
    },
  },
  //查询配置
  CommonSearch: {
    col: {
      sm: 24,
      md: 12,
      lg: 6,
      xl: 6,
    },
    actionCol: 4,
  },
  //表格配置
  CommonTable: {
    emptyText: '暂无数据',
    emptyValue: '/',
    ignoreHeight: 332,
    sortOrders: ['ascending', 'descending'],
    sortable: false,
    showOverflowTooltip: true,
    border: true,
    stripe: true,
    defaultColMinWidth: 150,
    column: {
      align: 'center',
      headerAlign: 'center',
    },
  },
  CommonDialog: {
    showClose: true,
    // 继承 ElDialogProps 后，这些 Element Plus 默认为 true 的布尔属性会被 Vue 声明为本地
    // Boolean prop，未传入时会被实例化为 false。在此显式声明默认值，配合 useComponentProps
    // 的守卫逻辑，保证未显式传入时维持 Element Plus 的 true 默认值。
    modal: true,
    closeOnClickModal: false,
    closeOnPressEscape: true,
    lockScroll: true,
    modalBlur: true,
    draggable: true,
    top: '15vh',
    appendToBody: true,
  },
};
