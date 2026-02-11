import color from 'picocolors';
import { outro } from '@clack/prompts';
import { showMenu } from './menu';
import { runCommand, runHandler } from './commands';
import { CMD_RUN_TYPE, TEXT } from './contanst';
import { State } from './state';

export async function run() {
  const stack = State.stack;
  while (stack.length) {
    const current = stack[stack.length - 1];

    const result = await showMenu(current);

    switch (result.type) {
      case 'exit':
        stack.length = 0;
        break;

      case 'back':
        stack.pop();
        break;

      case 'children':
        stack.push(result.options);
        break;

      case 'command':
        await runHandler(result.value);
        break;
      case CMD_RUN_TYPE.RUN_HINT:
        await runCommand(result.cmd);
        break;
    }
  }

  outro(color.cyan(TEXT.BYE));
}
