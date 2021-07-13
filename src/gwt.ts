import {
  flow,
  values,
  merge,
  pick,
  omit,
  keys,
} from 'lodash/fp';
import executeStep from './executeStep';
import validateDefinition from './validateDefinition';

import ContextProvider from './contextProvider';

export type StepFn<TContext> = (this: TContext) => void | Promise<void>;
export type Step<TContext> = {
  [name: string]: StepFn<TContext>
};
export type ThenStep<TContext> = {
  expect_error?: (this: TContext, error: Error) => void | Promise<void>,
  and?: Step<TContext>
} | Step<TContext>;

export type GwtDefinition<TContext> = {
  given?: Step<TContext>,
  when?: Step<TContext>,
  then?: ThenStep<TContext>,
};

export default (testFunc: (name: string, callback: () => void | Promise<void>) => unknown) => <TContext>(
  name: string,
  gwtDefinition: GwtDefinition<TContext>,
) => {
  if (!validateDefinition(gwtDefinition)) {
    throw new Error(`Invalid GWT definition. Valid keys are [given,when,then].
Supplied keys were [${keys(gwtDefinition)}]`);
  }

  const gwt = flow(
    pick(['given', 'when', 'then']),
    merge({
      given: {},
      when: {},
      then: {},
    }),
  )(gwtDefinition);

  return testFunc(name, async () => {
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

    if (gwt.then.expect_error) {
      if (!error) {
        throw new Error('Expected error to be thrown, but no error was thrown');
      }
      // @ts-ignore
      await gwt.then.expect_error.bind(ContextProvider.context)(error);
    } else if (error) {
      throw error;
    }

    if (gwt.then.expect_error) {
      await executeGwtStep(gwt.then.and);
    } else {
      await executeGwtStep(gwt.then);
    }

    ContextProvider.releaseContext();
  });
};
