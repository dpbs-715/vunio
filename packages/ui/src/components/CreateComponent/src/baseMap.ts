import { registerMap } from './cc.types';
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElTreeSelect,
} from 'element-plus';
import CommonButton from '../../Button';
import CommonSelect from '../../Select';
import CommonSelectOrDialog from '../../SelectOrDialog';
import CommonColorPicker from '../../ColorPicker';
const BaseMap: registerMap = {
  radio: ElRadio,
  radioGroup: ElRadioGroup,
  input: ElInput,
  select: ElSelect,
  datePicker: ElDatePicker,
  checkboxGroup: ElCheckboxGroup,
  checkbox: ElCheckbox,
  inputNumber: ElInputNumber,
  treeSelect: ElTreeSelect,
  button: CommonButton,
  commonSelect: CommonSelect,
  commonSelectOrDialog: CommonSelectOrDialog,
  color: CommonColorPicker,
};

const HtmlTags = [
  // 文档结构
  'html',
  'head',
  'body',

  // 元数据
  'title',
  'base',
  'link',
  'meta',
  'style',

  // 内容分区
  'article',
  'section',
  'nav',
  'aside',
  'header',
  'footer',
  'main',

  // 文本内容
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'hr',
  'pre',
  'blockquote',
  'ol',
  'ul',
  'li',
  'dl',
  'dt',
  'dd',
  'figure',
  'figcaption',
  'div',

  // 内联语义
  'a',
  'em',
  'strong',
  'small',
  's',
  'cite',
  'q',
  'dfn',
  'abbr',
  'data',
  'time',
  'code',
  'var',
  'samp',
  'kbd',
  'sub',
  'sup',
  'i',
  'b',
  'u',
  'mark',
  'ruby',
  'rt',
  'rp',
  'bdi',
  'bdo',
  'span',
  'br',
  'wbr',

  // 编辑
  'ins',
  'del',

  // 嵌入内容
  'img',
  'iframe',
  'embed',
  'object',
  'param',
  'video',
  'audio',
  'source',
  'track',
  'canvas',
  'map',
  'area',
  'svg',
  'math',

  // 表格
  'table',
  'caption',
  'colgroup',
  'col',
  'tbody',
  'thead',
  'tfoot',
  'tr',
  'td',
  'th',

  // 表单
  'form',
  'fieldset',
  'legend',
  'label',
  'input',
  'button',
  'select',
  'datalist',
  'optgroup',
  'option',
  'textarea',
  'output',
  'progress',
  'meter',

  // 交互元素
  'details',
  'summary',
  'dialog',
  'menu',
  'menuitem',
];

export { BaseMap, HtmlTags };
