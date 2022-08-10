import {
  flow,
  isEqual,
  keys,
  without,
} from 'lodash/fp';
import type {
  GivenScenarioTest,
  GwtDefinition,
  TestFunction,
} from '../../types';
import executeStep from '../executeStep';
import ContextProvider from '../contextProvider';
import executeWhenThen from './_whenThen';
import executeSimple from './_simple';
import isWhenThenScenarioTest from './_isWhenThenScenarioTest';

export const isScenarioTest = <TContext>(
  test: GwtDefinition<TContext>,
): test is GivenScenarioTest<TContext> => flow(
    keys,
    without(['given', 'scenario', 'expect_error']),
    isEqual([]),
  )(test);

export default <TContext>(
  testFunc: TestFunction,
  name: string,
  gwt: GivenScenarioTest<TContext>,
) => (
  testFunc(name, async () => {
    ContextProvider.createContext();

    const context = ContextProvider.context as TContext;

    await executeStep(context, gwt.given);

    if (isWhenThenScenarioTest(gwt)) {
      await executeWhenThen(
        context,
        gwt,
      );
    } else {
      await executeSimple(
        context,
        gwt,
      );
    }

    ContextProvider.releaseContext();
  })
);
