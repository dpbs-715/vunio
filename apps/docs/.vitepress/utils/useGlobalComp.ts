import { App, type Component } from 'vue';
// 如果报：“找不到模块“@vunio/ui”或其相应的类型声明”的错误，记得先build打包一下
import ElementPlus from 'element-plus';
import MainColor from '../../examples/basic/main-color.vue';
import SecondaryColors from '../../examples/basic/secondary-colors.vue';
export async function useGlobalComp(app: App) {
  app.use(ElementPlus);

  // app.component('Demo', Demo);
  app.component('MainColor', MainColor);
  app.component('SecondaryColors', SecondaryColors);
}

function isVueComponent(component: any): component is Component {
  return (
    typeof component === 'object' && (component.install || component.render || component.setup)
  );
}
