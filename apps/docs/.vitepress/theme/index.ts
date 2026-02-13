import DefaultTheme from 'vitepress/theme';

import { useGlobalComp } from '../utils/useGlobalComp';
// 自定义样式重载
import './styles/global.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
// 引入UI库的样式
import '@vunio/ui/style.css';
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    useGlobalComp(app);
  },
};
