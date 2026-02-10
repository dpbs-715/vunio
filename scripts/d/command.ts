import { outro, select, isCancel } from '@clack/prompts';
import color from 'picocolors';
import { CliState } from './state';
import { categoryOptions } from './config';
import { CLI_ACTION, TEXT } from './contanst';

export async function runCommand() {
  while (CliState.__Running__) {
    const category = await select({
      message: 'Please select the execution category',
      options: categoryOptions,
    });

    if (isCancel(category) || category === CLI_ACTION.EXIT) {
      outro(color.cyan(TEXT.BYE));
      return process.exit(0);
    }

    switch (category) {
      case 'scripts': {
        break;
      }
    }
  }

  if (!CliState.__Running__) {
    outro(color.cyan(TEXT.BYE));
  }
}
