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
import type { ConfigureTestFunction } from '../../types/Gwt';

export const isScenarioTest = <TContext>(
  test: GwtDefinition<TContext>,
): test is GivenScenarioTest<TContext> => flow(
    keys,
    without(['given', 'scenario', 'expect_error']),
    isEqual([]),
  )(test);

export default <TContext>(
  testFunc: TestFunction,
  configureTestFunction: ConfigureTestFunction<TContext> | undefined,
  name: string,
  gwt: GivenScenarioTest<TContext>,
) => (
  testFunc(name, async (...args: any[]) => {
    ContextProvider.createContext();

    const context = ContextProvider.context as TContext;

    if (configureTestFunction) {
      configureTestFunction(context, ...args);
    }

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
