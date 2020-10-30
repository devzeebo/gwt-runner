import { reduce } from 'lodash/fp';

const executeStep = (context) => (funcs) => reduce(
  (previous, func) => previous.then(() => func.bind(context)()),
  Promise.resolve(),
)(funcs);
export default executeStep;
