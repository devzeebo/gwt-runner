import { flow, isEqual, keys, without } from "lodash/fp";
import type { GivenScenarioTest, GwtDefinition, TestFunction } from "../../types";
import { executeStep } from "../executeStep";
import { TestContext } from "../contextProvider";
import { executeWhenThen } from "./_whenThen";
import { executeSimple } from "./_simple";
import { isWhenThenScenarioTest } from "./_isWhenThenScenarioTest";
import type { ConfigureTestFunction } from "../../types/Gwt";

export const isScenarioTest = <TContext>(
  test: GwtDefinition<TContext>,
): test is GivenScenarioTest<TContext> =>
  flow(keys, without(["given", "scenario", "expect_error"]), isEqual([]))(test);

export const scenarioTest = <TContext>(
  testFunc: TestFunction,
  configureTestFunction: ConfigureTestFunction<TContext> | undefined,
  name: string,
  gwt: GivenScenarioTest<TContext>,
) =>
  testFunc(name, async (...args: any[]) => {
    TestContext.createContext();

    const context = TestContext.context as TContext;

    if (configureTestFunction) {
      configureTestFunction(context, ...args);
    }

    await executeStep(context, gwt.given);

    if (isWhenThenScenarioTest(gwt)) {
      await executeWhenThen(context, gwt);
    } else {
      await executeSimple(context, gwt);
    }

    TestContext.releaseContext();
  });
