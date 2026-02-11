import { CMD_RUN_TYPE } from './contanst';

export type Option = {
  value: string;
  label: string;
  hint?: string;
  runType?: string;
  children?: Option[];
};
export type MenuResult =
  | { type: 'exit' }
  | { type: 'back' }
  | { type: 'children'; options: Option[] }
  | { type: 'command'; value: string }
  | {
      type: CMD_RUN_TYPE.RUN_HINT;
      cmd: string;
    };
