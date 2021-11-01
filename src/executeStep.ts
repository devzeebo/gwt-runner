import reduce from 'lodash/reduce';

const executeStep = <T>(context: T) => (funcs: Array<(this: T) => void>) => reduce(
  funcs,
  // @ts-ignore
  (previous, func) => previous.then(() => func.bind(context)()),
  Promise.resolve(),
);
export default executeStep;
