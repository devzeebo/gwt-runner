import type { StepObject, ThenStep } from '../Step';

export type GivenScenarioDefinition<TContext> = {
  given?: StepObject<TContext>,
  scenario: StepObject<TContext>,
  expect_error?: (this: TContext, error: Error) => void | Promise<void>,
};

export type GivenScenarioWhenThenDefinition<TContext> = {
  given?: StepObject<TContext>,
  scenario: ScenarioStep<TContext>
};

export type GivenScenarioTest<TContext> =
GivenScenarioDefinition<TContext>
| GivenScenarioWhenThenDefinition<TContext>;

export type ScenarioWhenStep<TContext> = {
  name?: string,
  when: StepObject<TContext>,
  then: ThenStep<TContext>,
};

export type ScenarioThenWhenStep<TContext> = {
  name?: string,
  then_when: StepObject<TContext>,
  then: ThenStep<TContext>,
};

export type ScenarioStep<TContext> = [
  ScenarioWhenStep<TContext>,
  ...ScenarioThenWhenStep<TContext>[],
];
