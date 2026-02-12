import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  title: 'Library Doc',
  description: 'A Vue3-based Component Library and Utility Collection',
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Others', link: '/markdown-examples' },
      {
        text: 'More',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/dpbs-715/d-ui/blob/master/CHANGELOG.md',
          },
          // {
          //   text: 'Contribute',
          //   link: '',
          // },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Quick Start',
        items: [{ text: 'Introduction', link: '/en/guide/' }],
      },
      {
        text: 'usingExamples',
        items: [{ text: 'sample', link: '/en/useDemo/' }],
      },
      {
        text: '基础部分',
        items: [{ text: 'Color', link: '/en/basic/' }],
      },
      {
        text: 'Components (dlib-ui)',
        items: [
          { text: 'Button', link: '/en/packages/ui/button/' },
          { text: 'Dialog', link: '/en/packages/ui/dialog/' },
          { text: 'CreateComponent', link: '/en/packages/ui/CreateComponent/' },
          { text: 'Form', link: '/en/packages/ui/Form/' },
          { text: 'Search', link: '/en/packages/ui/Search/' },
          { text: 'Table', link: '/en/packages/ui/Table/' },
          {
            text: 'TableFieldsConfig',
            link: '/en/packages/ui/TableFieldsConfig/',
          },
          { text: 'Pagination', link: '/en/packages/ui/Pagination/' },
          { text: 'TableLayout', link: '/en/packages/ui/TableLayout/' },
          { text: 'Select', link: '/en/packages/ui/Select/' },
          { text: 'SelectOrDialog', link: '/en/packages/ui/SelectOrDialog/' },
          { text: 'Descriptions', link: '/en/packages/ui/Descriptions/' },
          { text: 'foma', link: '/en/packages/ui/Foma/' },
        ],
      },
      {
        text: 'Hooks (dlib-hooks)',
        items: [
          { text: 'useCounter', link: '/en/packages/hooks/useCounter/' },
          { text: 'useRefCollect', link: '/en/packages/hooks/useRefCollect/' },
          { text: 'useConfigs', link: '/en/packages/hooks/useConfigs/' },
          { text: 'useMixConfig', link: '/en/packages/hooks/useMixConfig/' },
          { text: 'useRepeatConfig', link: '/en/packages/hooks/useRepeatConfig/' },
          { text: 'useEventListener', link: '/en/packages/hooks/useEventListener/' },
          { text: 'createContext', link: '/en/packages/hooks/createContext/' },
        ],
      },
      {
        text: 'Directives (dlib-directives)',
        items: [
          { text: 'vFocus', link: '/en/packages/directives/vFocus/' },
          { text: 'vTrunced', link: '/en/packages/directives/vTrunced/' },
        ],
      },
      {
        text: 'Utilities (dlib-utils)',
        items: [
          { text: 'String Utilities', link: '/en/packages/utils/string/' },
          { text: 'Array Utilities', link: '/en/packages/utils/array/' },
          { text: 'Type Checking', link: '/en/packages/utils/is/' },
          { text: 'Function Utilities', link: '/en/packages/utils/function/' },
          { text: 'Async Wrapper', link: '/en/packages/utils/async/' },
          { text: 'Cache', link: '/en/packages/utils/cache/' },
          { text: 'Clone', link: '/en/packages/utils/clone/' },
          { text: 'Parse Utilities', link: '/en/packages/utils/parse/' },
          { text: 'ElementPlus Utilities', link: '/en/packages/utils/ep/' },
        ],
      },
    ],
  },
});
