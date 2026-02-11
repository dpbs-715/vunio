import { cac } from 'cac';
import { intro } from '@clack/prompts';
import color from 'picocolors';
import { run } from './run';
import { __name__, __version__ } from './config';
import './commands/register';

const cli = cac(__name__);

cli.command('').action(async () => {
  intro(`${color.bgCyan(color.black(__name__))}`);
  await run();
});

cli.help();
cli.version(__version__);

cli.parse();
