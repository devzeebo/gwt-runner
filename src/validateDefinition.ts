import {
  flow,
  keys,
  without,
  isEqual,
} from 'lodash/fp';

export default flow(
  keys,
  without(['given', 'when', 'then']),
  isEqual([]),
);
