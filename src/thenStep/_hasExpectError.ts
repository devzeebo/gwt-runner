import type { ThenStep, ThenStepWithExpectError } from '../../types';

export default <TContext>(
  step: ThenStep<TContext> | undefined,
): step is ThenStepWithExpectError<TContext> => (
  !!step && 'expect_error' in step
);
