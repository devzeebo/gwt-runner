import reduce from 'lodash/reduce';
import values from 'lodash/values';
import type { Step } from '../types';

const executeStep = <T>(context: T, step: Step<T> | undefined) => reduce(
  values(step),
  // @ts-ignore
  (previous, func) => previous.then(() => func.bind(context)()),
  Promise.resolve(),
);
export default executeStep;
