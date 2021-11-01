import {
  keys,
  find,
} from 'lodash/fp';
import scenarioTest, {
  GivenScenarioDefinition,
  isScenarioTest,
} from './scenarioTest';
import gherkinTest, {
  GherkinDefinition,
  isGherkinTest,
} from './gherkinTest';

export type GwtDefinition<TContext> =
  GherkinDefinition<TContext>
  | GivenScenarioDefinition<TContext>;

export type TestFunction = (
  name: string,
  callback: () => void | Promise<void>
) => unknown;

type TestType = {
  test: (def: any) => boolean,
  runner: (
    testFunc: TestFunction,
    name: string,
    gwtDefinition: GwtDefinition<any>
  ) => void,
};

const testTypes: Array<TestType> = [
  {
    test: isGherkinTest,
    runner: gherkinTest,
  },
  {
    test: isScenarioTest,
    runner: scenarioTest,
  },
];

export default (
  testFunc: TestFunction,
) => <TContext>(
  name: string,
  gwtDefinition: GwtDefinition<TContext>,
) => {
  const testType = find(({ test }) => test(gwtDefinition), testTypes);

  if (!testType) {
    throw new Error(`Invalid GWT definition. Valid keys are [given,when,then] or [given,scenario].
Supplied keys were [${keys(gwtDefinition)}]`);
  }

  return testType.runner(
    testFunc,
    name,
    gwtDefinition,
  );
};
