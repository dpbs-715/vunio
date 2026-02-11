import { autocomplete, isCancel, select } from '@clack/prompts';
import { CLI_ACTION, CMD_RUN_TYPE, TEXT } from './contanst';
import type { Option, MenuResult } from './types';
import { filter } from './utils';
import { State } from './state';
import { backOption, exitOption } from './config';

function getBackOption() {
  if (State.stack.length == 1) {
    return exitOption;
  } else {
    return backOption;
  }
}

function commonSelect(options: Option[]) {
  let action;
  if (options.length > 10) {
    action = autocomplete;
  } else {
    action = select;
  }
  return action({
    message: TEXT.DEFAULT_SELECT_MESSAGE,
    options: [...options, getBackOption()],
    filter,
  });
}

export async function showMenu(options: Option[]): Promise<MenuResult> {
  const value = await commonSelect(options);

  if (isCancel(value) || value === CLI_ACTION.EXIT) {
    if (State.stack.length == 1) {
      return { type: 'exit' };
    } else {
      return { type: 'back' };
    }
  }

  if (value === CLI_ACTION.BACK) {
    return { type: 'back' };
  }

  const selected = options.find((o) => o.value === value);

  if (selected?.children) {
    return {
      type: 'children',
      options: selected.children,
    };
  }

  if (selected?.runType === CMD_RUN_TYPE.RUN_HINT && selected.hint) {
    return {
      type: CMD_RUN_TYPE.RUN_HINT,
      cmd: selected.hint,
    };
  }

  return {
    type: 'command',
    value,
  };
}
