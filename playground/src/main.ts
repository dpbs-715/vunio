import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入@vunio/ui
import vunioUI from '~/@vunio/ui';
// import '@vunio/ui/style.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
const app = createApp(App);
app.use(ElementPlus, { locale: zhCn });
app.use(vunioUI); // 全局引入@vunio/ui组件
app.use(router);
app.mount('#app');
