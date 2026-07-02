import type { Step } from "../types";

const executeStep = <T>(context: T, step: Step<T> | undefined) =>
  Object.values(step ?? {}).reduce(
    // @ts-ignore
    (previous, func) => previous.then(() => func.bind(context)()),
    Promise.resolve(),
  );
export { executeStep };
