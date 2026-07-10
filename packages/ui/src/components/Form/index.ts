import { withInstall } from '~/_utils';
import commonForm from './src/Form.vue';

export const CommonForm = withInstall(commonForm);
export default CommonForm;
export * from './src/Form.types';
export * from './src/formCommand';
