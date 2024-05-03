import {
  flow,
  isEqual,
  keys,
  without,
} from 'lodash/fp';
import type { GherkinDefinition, GwtDefinition } from '../../types';
import executeStep from '../executeStep';
import ContextProvider from '../contextProvider';
import whenStep from '../whenStep';
import thenStep from '../thenStep';
import type { ConfigureTestFunction } from '../../types/Gwt';

export const isGherkinTest = <TContext>(
  test: GwtDefinition<TContext>,
): test is GherkinDefinition<TContext> => flow(
    keys,
    without(['given', 'when', 'then']),
    isEqual([]),
  )(test);

export default <TContext>(
  testFunc: (name: string, callback: (...args: any[]) => void | Promise<void>) => unknown,
  configureTestFunc: ConfigureTestFunction<TContext> | undefined,
  name: string,
  gwt: GherkinDefinition<TContext>,
) => (
  testFunc(name, async (...args) => {
    ContextProvider.createContext();

    const context = ContextProvider.context as TContext;

    if (configureTestFunc) {
      configureTestFunc(context, ...args);
    }

    await executeStep(context, gwt.given);

    const error = await whenStep(context, gwt.when);

    await thenStep(context, gwt.then, error);

    ContextProvider.releaseContext();
  })
);
