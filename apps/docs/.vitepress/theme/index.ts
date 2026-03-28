import DefaultTheme from 'vitepress/theme';
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';

import { useGlobalComp } from '../utils/useGlobalComp';
// 自定义样式重载
import './styles/global.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
// 引入UI库的样式
import '@vunio/ui/style.css';

const ELEMENT_PLUS_SSR_ID_INJECTION = {
  prefix: 1024,
  current: 0,
};

const ELEMENT_PLUS_SSR_Z_INDEX = {
  current: 0,
};

export default {
  extends: DefaultTheme,
  enhanceApp({ app }:any) {
    app.provide(ID_INJECTION_KEY, ELEMENT_PLUS_SSR_ID_INJECTION);
    app.provide(ZINDEX_INJECTION_KEY, ELEMENT_PLUS_SSR_Z_INDEX);
    useGlobalComp(app);
  },
};
