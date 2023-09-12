export type StepFn<TContext> = (this: TContext) => void | Promise<void>;

export type StepArray<TContext> = Array<StepFn<TContext>>;

export type StepObject<TContext> = {
  [name: string]: StepFn<TContext>
};

export type Step<TContext> = StepObject<TContext> | StepArray<TContext>;

export type ThenStepWithExpectError<TContext> = {
  expect_error: (this: TContext, error: Error) => void | Promise<void>,
  and?: Step<TContext>,
};

export type ThenStep<TContext> = ThenStepWithExpectError<TContext>
| Omit<StepObject<TContext>, 'and' | 'expect_error'>
| StepArray<TContext>;
