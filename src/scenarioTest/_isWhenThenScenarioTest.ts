import isArray from "lodash/isArray";
import type { GivenScenarioTest, GivenScenarioWhenThenDefinition } from "../../types";

export const isWhenThenScenarioTest = <TContext>(
  gwt: GivenScenarioTest<TContext>,
): gwt is GivenScenarioWhenThenDefinition<TContext> => isArray(gwt.scenario);
