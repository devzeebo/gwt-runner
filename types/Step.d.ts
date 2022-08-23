export type StepFn<TContext> = (this: TContext) => void | Promise<void>;

export type Step<TContext> = {
  [name: string]: StepFn<TContext>
};

export type ThenStepWithExpectError<TContext> = {
  expect_error: (this: TContext, error: Error) => void | Promise<void>,
  and?: Step<TContext>
};

export type ThenStep<TContext> = ThenStepWithExpectError<TContext> | Omit<Step<TContext>, 'and' | 'expect_error'>;
