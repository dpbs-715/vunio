import { CLI_ACTION } from './contanst';
import { CategoryOption } from './types';
import color from 'picocolors';

const backOption: CategoryOption = { value: CLI_ACTION.BACK, label: color.yellow('← Back') };

export const categoryOptions: CategoryOption[] = [
  { value: 'scripts', label: 'Scripts' },
  { value: CLI_ACTION.EXIT, label: color.yellow('Exit') },
];
