import {
  flow,
  isEqual,
  keys,
  values,
  without,
} from 'lodash/fp';
import { Step } from './types';
import executeStep from './executeStep';
import ContextProvider from './contextProvider';

export type GivenScenarioDefinition<TContext> = {
  given?: Step<TContext>,
  scenario?: Step<TContext>,
  expect_error?: (this: TContext, error: Error) => void | Promise<void>,
};

export const isScenarioTest = flow(
  keys,
  without(['given', 'scenario', 'expect_error']),
  isEqual([]),
);

export default <TContext>(
  testFunc: (name: string, callback: () => void | Promise<void>) => unknown,
  name: string,
  gwt: GivenScenarioDefinition<TContext>,
) => (
  testFunc(name, async () => {
    ContextProvider.createContext();

    const executeGwtStep = flow(
      values,
      executeStep(ContextProvider.context),
    );

    await executeGwtStep(gwt.given);

    let error;
    try {
      await executeGwtStep(gwt.scenario);
    } catch (e) {
      error = e;
    }

    if (gwt.expect_error) {
      if (!error) {
        throw new Error('Expected error to be thrown, but no error was thrown');
      }
      // @ts-ignore
      await gwt.expect_error.bind(ContextProvider.context)(error);
    } else if (error) {
      throw error;
    }

    ContextProvider.releaseContext();
  })
);
