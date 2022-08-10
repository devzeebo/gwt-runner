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

export const isGherkinTest = <TContext>(
  test: GwtDefinition<TContext>,
): test is GherkinDefinition<TContext> => flow(
    keys,
    without(['given', 'when', 'then']),
    isEqual([]),
  )(test);

export default <TContext>(
  testFunc: (name: string, callback: () => void | Promise<void>) => unknown,
  name: string,
  gwt: GherkinDefinition<TContext>,
) => (
  testFunc(name, async () => {
    ContextProvider.createContext();

    const context = ContextProvider.context as TContext;

    await executeStep(context, gwt.given);

    const error = await whenStep(context, gwt.when);

    await thenStep(context, gwt.then, error);

    ContextProvider.releaseContext();
  })
);
