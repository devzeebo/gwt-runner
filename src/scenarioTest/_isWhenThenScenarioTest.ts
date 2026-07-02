import type { GivenScenarioTest, GivenScenarioWhenThenDefinition } from "../../types";

export const isWhenThenScenarioTest = <TContext>(
  gwt: GivenScenarioTest<TContext>,
): gwt is GivenScenarioWhenThenDefinition<TContext> => Array.isArray(gwt.scenario);
