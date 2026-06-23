import type { ThenStep, ThenStepWithExpectError } from "../../types";

export const hasExpectError = <TContext>(
  step: ThenStep<TContext> | undefined,
): step is ThenStepWithExpectError<TContext> => !!step && "expect_error" in step;
