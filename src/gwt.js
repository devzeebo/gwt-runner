import {
  flow,
  values,
  merge,
  pick,
  omit,
  curry,
  keys,
} from 'lodash/fp';
import executeStep from './executeStep';
import validateDefinition from './validateDefinition';

import ContextProvider from './contextProvider';

export default curry((testFunc, name, gwtDefinition) => {
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
      await gwt.then.expect_error.bind(ContextProvider.context)(error);
    } else if (error) {
      throw error;
    }

    await flow(
      omit(['expect_error']),
      executeGwtStep,
    )(gwt.then);

    ContextProvider.releaseContext();
  });
});
