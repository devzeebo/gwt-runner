import {
  keys,
  find,
} from 'lodash/fp';
import scenarioTest, {
  isScenarioTest,
} from './scenarioTest';
import gherkinTest, {
  isGherkinTest,
} from './gherkinTest';
import type { GivenScenarioTest, GwtDefinition, TestFunction } from '../types';
import type { GherkinTest } from '../types/gherkin/Gherkin';

type TestType<T extends GwtDefinition<any> = GwtDefinition<any>> = {
  test: (def: any) => boolean,
  runner: (
    testFunc: TestFunction,
    name: string,
    gwtDefinition: T,
  ) => void,
};

const testTypes: Array<TestType<any>> = [
  {
    test: isGherkinTest,
    runner: gherkinTest,
  } as TestType<GherkinTest<any>>,
  {
    test: isScenarioTest,
    runner: scenarioTest,
  } as TestType<GivenScenarioTest<any>>,
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
