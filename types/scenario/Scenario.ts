import type { Step, ThenStep } from '../Step';

export type GivenScenarioDefinition<TContext> = {
  given?: Step<TContext>,
  scenario: Step<TContext>,
  expect_error?: (this: TContext, error: Error) => void | Promise<void>,
};

export type GivenScenarioWhenThenDefinition<TContext> = {
  given?: Step<TContext>,
  scenario: ScenarioStep<TContext>
};

export type GivenScenarioTest<TContext> =
GivenScenarioDefinition<TContext>
| GivenScenarioWhenThenDefinition<TContext>;

export type ScenarioWhenStep<TContext> = {
  name?: string,
  when: Step<TContext>,
  then: ThenStep<TContext>,
};

export type ScenarioThenWhenStep<TContext> = {
  name?: string,
  then_when: Step<TContext>,
  then: ThenStep<TContext>,
};

export type ScenarioStep<TContext> = [
  ScenarioWhenStep<TContext>,
  ...ScenarioThenWhenStep<TContext>[],
];
