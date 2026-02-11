import { CLI_ACTION } from './contanst';
import { Option } from '@clack/prompts';

export const filter = (input: string, option: Option<string>) => {
  if (!input || option.value === CLI_ACTION.BACK || option.value === CLI_ACTION.EXIT) {
    return true;
  }

  const toLowerCase = option.label?.toLowerCase() || '';
  const toLowerCaseHint = option.hint?.toLowerCase() || '';
  const toLowerCaseInput = input.toLowerCase() || '';

  return !!toLowerCase?.includes(toLowerCaseInput) || !!toLowerCaseHint?.includes(toLowerCaseInput);
};
