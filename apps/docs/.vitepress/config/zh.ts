import { defineConfig } from 'vitepress';

export const zh = defineConfig({
  lang: 'zh-Hans',
  title: '组件库文档',
  description: '一个基于 Vue3 的组件库和工具集',
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      // { text: '其他', link: '/markdown-examples' },
      {
        text: '更多',
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/dpbs-715/d-ui/blob/master/CHANGELOG.md',
          },
          // {
          //   text: '参与贡献',
          //   link: '',
          // },
        ],
      },
    ],
    sidebar: [
      {
        text: '快速开始',
        items: [{ text: '介绍', link: '/guide/' }],
      },
      {
        text: '使用样例',
        items: [{ text: '样例', link: '/useDemo/' }],
      },
      {
        text: '基础部分',
        items: [{ text: 'Color色彩', link: '/basic/' }],
      },
      {
        text: '组件（dlib-ui）',
        items: [
          { text: 'Button 按钮', link: '/packages/ui/button/' },
          { text: 'Dialog 弹窗', link: '/packages/ui/dialog/' },
          { text: 'CreateComponent 创建器', link: '/packages/ui/CreateComponent/' },
          { text: 'Form 公共表单', link: '/packages/ui/Form/' },
          { text: 'Search 公共查询', link: '/packages/ui/Search/' },
          { text: 'Table 公共表格', link: '/packages/ui/Table/' },
          {
            text: 'TableFieldsConfig 字段排序展示',
            link: '/packages/ui/TableFieldsConfig/',
          },
          { text: 'Pagination 公共分页器', link: '/packages/ui/Pagination/' },
          { text: 'TableLayout 表格页布局', link: '/packages/ui/TableLayout/' },
          { text: 'Select 公共选择器', link: '/packages/ui/Select/' },
          { text: 'SelectOrDialog 弹窗选择器', link: '/packages/ui/SelectOrDialog/' },
          { text: 'Descriptions 描述列表', link: '/packages/ui/Descriptions/' },
          { text: 'foma 公式编辑器', link: '/packages/ui/Foma/' },
        ],
      },
      {
        text: 'Hooks（dlib-hooks）',
        items: [
          { text: 'useCounter 计数器', link: '/packages/hooks/useCounter/' },
          { text: 'useRefCollect 收集器', link: '/packages/hooks/useRefCollect/' },
          { text: 'useConfigs 配置器', link: '/packages/hooks/useConfigs/' },
          { text: 'useMixConfig 收集器', link: '/packages/hooks/useMixConfig/' },
          { text: 'useRepeatConfig 重复配置器', link: '/packages/hooks/useRepeatConfig/' },
          { text: 'useEventListener 事件监听', link: '/packages/hooks/useEventListener/' },
          { text: 'createContext 上下文', link: '/packages/hooks/createContext/' },
        ],
      },
      {
        text: '指令（dlib-directives）',
        items: [
          { text: 'vFocus 聚焦', link: '/packages/directives/vFocus/' },
          { text: 'vTrunced 是否截断', link: '/packages/directives/vTrunced/' },
        ],
      },
      {
        text: '工具函数（dlib-utils）',
        items: [
          { text: '字符串工具', link: '/packages/utils/string/' },
          { text: '数组工具', link: '/packages/utils/array/' },
          { text: '类型判断工具', link: '/packages/utils/is/' },
          { text: '函数式工具', link: '/packages/utils/function/' },
          { text: '异步任务包装器', link: '/packages/utils/async/' },
          { text: '缓存工具', link: '/packages/utils/cache/' },
          { text: '克隆工具', link: '/packages/utils/clone/' },
          { text: '数据转化工具', link: '/packages/utils/parse/' },
          { text: 'ElementPlus 工具', link: '/packages/utils/ep/' },
        ],
      },
    ],
  },
});
