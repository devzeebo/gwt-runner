import {
  flow, values, merge, pick, omit, curry,
} from 'lodash/fp';
import executeStep from './executeStep';

export default curry((testFunc, name, gwtDefinition) => {
  const gwt = flow(
    pick(['given', 'when', 'then']),
    merge({
      given: {},
      when: {},
      then: {},
    }),
  )(gwtDefinition);

  return testFunc(name, async () => {
    const context = {};
    const executeGwtStep = flow(
      values,
      executeStep(context),
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
      await gwt.then.expect_error.bind(context)(error);
    } else if (error) {
      throw error;
    }

    await flow(
      omit(['expect_error']),
      executeGwtStep,
    )(gwt.then);
  });
});
