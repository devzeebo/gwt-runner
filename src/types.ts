// istanbul ignore file
export type StepFn<TContext> = (this: TContext) => void | Promise<void>;
export type Step<TContext> = {
  [name: string]: StepFn<TContext>
};
export type ThenStep<TContext> = {
  expect_error?: (this: TContext, error: Error) => void | Promise<void>,
  and?: Step<TContext>
} | Step<TContext>;
