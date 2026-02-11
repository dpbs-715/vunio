import { CLI_ACTION, CMD_RUN_TYPE } from './contanst';
import { Option } from './types';
import color from 'picocolors';
import pkg from '../../package.json';

export const __name__ = 'd-cli';
export const __version__ = '0.0.1';

export const backOption: Option = { value: CLI_ACTION.BACK, label: color.yellow('← Back') };
export const exitOption: Option = { value: CLI_ACTION.EXIT, label: color.yellow('Exit') };

const scriptOptions: Option[] = [
  ...Object.keys(pkg.scripts)
    .filter((key) => key !== 'd')
    .map((key) => ({
      value: key,
      label: key,
      runType: CMD_RUN_TYPE.RUN_HINT,
      hint: pkg.scripts[key as keyof typeof pkg.scripts],
    })),
];

export const menus: Option[] = [
  {
    value: 'packageScripts',
    label: 'packageScripts',
    hint: 'Run scripts',
    children: scriptOptions,
  },
];
