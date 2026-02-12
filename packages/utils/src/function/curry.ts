export const __ = Symbol('curry placeholder');
export type Placeholder = typeof __;

type AnyFn = (...args: any[]) => any;

type MergeArgs<Prev extends any[], Next extends any[]> = Prev extends [infer P, ...infer PR]
  ? Next extends [infer N, ...infer NR]
    ? P extends Placeholder
      ? [N, ...MergeArgs<PR, NR>]
      : [P, ...MergeArgs<PR, Next>]
    : Prev
  : Next;

type Remaining<Args extends any[], Collected extends any[]> = Args extends [infer A, ...infer AR]
  ? Collected extends [infer C, ...infer CR]
    ? C extends Placeholder
      ? [A, ...Remaining<AR, CR>]
      : Remaining<AR, CR>
    : Args
  : [];

type CurryReturn<F extends AnyFn, Collected extends any[]> =
  Remaining<Parameters<F>, Collected> extends [] ? ReturnType<F> : Curry<F, Collected>;

export type Curry<F extends AnyFn, Collected extends any[] = []> = <Args extends any[]>(
  ...args: Args
) => CurryReturn<F, MergeArgs<Collected, Args>>;

export function curry<F extends AnyFn>(fn: F, arity = fn.length): Curry<F> {
  function curried(this: any, ...args: any[]): any {
    const filled = args.filter((a) => a !== __).length;

    if (filled >= arity) {
      const finalArgs = args.slice(0, arity).map((a) => (a === __ ? undefined : a));
      return fn.apply(this, finalArgs);
    }

    return function (this: any, ...next: any[]) {
      let merged = args.slice();

      for (const n of next) {
        const i = merged.indexOf(__);
        if (i >= 0) merged[i] = n;
        else merged.push(n);
      }

      return curried.apply(this, merged);
    };
  }

  return curried as any;
}
