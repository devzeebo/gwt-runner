import type { GivenScenarioTest } from './scenario/Scenario';
import type { GherkinTest } from './gherkin/Gherkin';

export type GwtDefinition<TContext> =
  GherkinTest<TContext>
  | GivenScenarioTest<TContext>;

export type TestFunction = (
  name: string,
  callback: () => void | Promise<void>
) => unknown;
