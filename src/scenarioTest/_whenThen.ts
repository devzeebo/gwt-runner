import type {
  GivenScenarioWhenThenDefinition,
  ScenarioStep,
  ScenarioThenWhenStep,
  ScenarioWhenStep,
} from '../../types';
import whenStep from '../whenStep';
import thenStep from '../thenStep';

const recursiveSteps = async <TContext>(
  context: TContext,
  steps: ScenarioStep<TContext>,
  index: number = 0,
) => {
  const step = steps[index];

  try {
    const when = index === 0
      ? (step as ScenarioWhenStep<TContext>).when
      : (step as ScenarioThenWhenStep<TContext>).then_when;

    const error = await whenStep(context, when);

    await thenStep(context, step.then, error);
  } catch (cause: any) {
    throw new Error(`Error in step "${step.name ?? index}": ${cause.message}`, { cause });
  }

  if (index + 1 < steps.length) {
    await recursiveSteps(
      context,
      steps,
      index + 1,
    );
  }
};

export default async <TContext>(
  context: TContext,
  gwt: GivenScenarioWhenThenDefinition<TContext>,
) => {
  if (!gwt.scenario) {
    throw new Error('Expected scenario definition');
  }

  await recursiveSteps(
    context,
    gwt.scenario,
  );
};
