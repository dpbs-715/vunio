import { log, spinner } from '@clack/prompts';

type Index = () => Promise<void> | void;

const registry = new Map<string, Index>();

export function registerCommand(name: string, handler: Index) {
  registry.set(name, handler);
}

export async function runHandler(name: string) {
  const handler = registry.get(name);

  if (!handler) {
    log.error(`Unknown command: ${name}`);
    return;
  }

  await handler();
}

export async function runCommand(cmd: string) {
  const s = spinner();
  s.start('Loading...');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  s.stop('Done!');
}
