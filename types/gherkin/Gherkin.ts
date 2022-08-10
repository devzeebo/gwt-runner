import type { Step, ThenStep } from '../Step';

export type GherkinTest<TContext> = {
  given?: Step<TContext>,
  when?: Step<TContext>,
  then?: ThenStep<TContext>,
};
