import { CLI_ACTION } from './contanst';
import { Option } from '@clack/prompts';

export const filter = (input: string, option: Option<string>) => {
  if (!input || option.value === CLI_ACTION.BACK) {
    return true;
  }
  return !!option.label?.toLowerCase().includes(input.toLowerCase());
};
