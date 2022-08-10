import type { ThenStep } from '../../types';
import executeStep from '../executeStep';
import hasExpectError from './_hasExpectError';

export default async <TContext>(
  context: TContext,
  step: ThenStep<TContext> | undefined,
  error: Error | undefined,
) => {
  if (hasExpectError(step)) {
    if (!error) {
      throw new Error('Expected error to be thrown, but no error was thrown');
    }

    // @ts-ignore
    await step.expect_error.bind(context)(error);
  } else if (error) {
    throw error;
  }

  await (hasExpectError(step)
    ? executeStep(context, step.and)
    : executeStep(context, step));
};
