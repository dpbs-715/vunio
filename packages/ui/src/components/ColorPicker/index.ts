import { withInstall } from '~/_utils';
import ColorPicker from './src/ColorPicker.vue';

export const CommonColorPicker = withInstall(ColorPicker);
export default CommonColorPicker;

export * from './src/ColorPicker.types';
export * from './src/color';
