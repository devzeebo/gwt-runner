import type {
  GivenScenarioDefinition,
} from '../../types';
import whenStep from '../whenStep';

export default async <TContext>(
  context: TContext,
  gwt: GivenScenarioDefinition<TContext>,
) => {
  const error = await whenStep(context, gwt.scenario);

  if (gwt.expect_error) {
    if (!error) {
      throw new Error('Expected error to be thrown, but no error was thrown');
    }
    // @ts-ignore
    await gwt.expect_error.bind(context)(error);
  } else if (error) {
    throw error;
  }
};
