import type { Step } from '../../types';
import executeStep from '../executeStep';

export default async <T>(context: T, step: Step<T> | undefined): Promise<Error | undefined> => {
  try {
    await executeStep(context, step);

    return undefined;
  } catch (e) {
    return e as Error;
  }
};
