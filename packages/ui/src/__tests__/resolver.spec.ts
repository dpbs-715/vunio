import { describe, expect, it } from 'vitest';
import { vunioUIResolver } from '../resolver';

type ResolverObject = {
  resolve: (name: string) => unknown;
};

describe('vunioUIResolver', () => {
  it('resolves Common-prefixed components from @vunio/ui with style side effect by default', () => {
    const resolver = vunioUIResolver() as ResolverObject;

    const result = resolver.resolve('CommonButton');

    expect(result).toEqual({
      name: 'CommonButton',
      from: '@vunio/ui',
      sideEffects: '@vunio/ui/style.css',
    });
  });

  it('can disable style side effect imports', () => {
    const resolver = vunioUIResolver({ importStyle: false }) as ResolverObject;

    const result = resolver.resolve('CommonButton');

    expect(result).toEqual({
      name: 'CommonButton',
      from: '@vunio/ui',
      sideEffects: undefined,
    });
  });

  it('ignores non-Common component names', () => {
    const resolver = vunioUIResolver() as ResolverObject;

    expect(resolver.resolve('ElButton')).toBeUndefined();
  });
});
