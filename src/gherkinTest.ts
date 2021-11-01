import {
  flow,
  isEqual,
  keys,
  values,
  without,
} from 'lodash/fp';
import { Step, ThenStep } from './types';
import executeStep from './executeStep';
import ContextProvider from './contextProvider';

export type GherkinDefinition<TContext> = {
  given?: Step<TContext>,
  when?: Step<TContext>,
  then?: ThenStep<TContext>,
};

export const isGherkinTest = flow(
  keys,
  without(['given', 'when', 'then']),
  isEqual([]),
);

export default <TContext>(
  testFunc: (name: string, callback: () => void | Promise<void>) => unknown,
  name: string,
  gwt: GherkinDefinition<TContext>,
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
      await executeGwtStep(gwt.when);
    } catch (e) {
      error = e;
    }

    if (gwt.then?.expect_error) {
      if (!error) {
        throw new Error('Expected error to be thrown, but no error was thrown');
      }
      // @ts-ignore
      await gwt.then.expect_error.bind(ContextProvider.context)(error);
    } else if (error) {
      throw error;
    }

    if (gwt.then?.expect_error) {
      await executeGwtStep(gwt.then.and);
    } else {
      await executeGwtStep(gwt.then);
    }

    ContextProvider.releaseContext();
  })
);
