import { cac } from 'cac';
import { intro } from '@clack/prompts';
import color from 'picocolors';
import pkg from '../../package.json';
import { runCommand } from './command';

const cli = cac('d-cli');

cli.command('', 'run d-cli').action(async () => {
  intro(`${color.bgCyan(color.black(' d-cli '))}`);
  runCommand();
});

cli.help();
cli.version(pkg.version);

cli.parse();
