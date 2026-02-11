import { registerCommand } from './index';
import { log } from '@clack/prompts';
import color from 'picocolors';

registerCommand('test', async () => {
  log.message(`${color.bgCyan(color.black('test'))}`);
});
