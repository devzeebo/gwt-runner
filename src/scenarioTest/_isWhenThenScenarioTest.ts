import isArray from 'lodash/isArray';
import type {
  GivenScenarioTest,
  GivenScenarioWhenThenDefinition,
} from '../../types';

export default <TContext>(
  gwt: GivenScenarioTest<TContext>,
): gwt is GivenScenarioWhenThenDefinition<TContext> => (
  isArray(gwt.scenario)
);
