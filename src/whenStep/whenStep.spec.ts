import {
  test as jestTest,
  describe,
  expect,
} from '@jest/globals';
import type { Step } from '../../types';
import gwtRunner from '../gwt';
import whenStep from './whenStep';

const test = gwtRunner(jestTest);

describe('when step', () => {
  test('executes step with context', {
    given: {
      context,
      step,
    },
    when: {
      executing_step,
    },
    then: {
      step_executed_with_context,
      NO_error_returned,
    },
  });

  test('if error, return error', {
    given: {
      context,
      step_THROWS_ERROR,
    },
    when: {
      executing_step,
    },
    then: {
      ERROR_returned,
    },
  });
});

type TestContext = Symbol;

type Context = {
  context: Symbol,
  step: Step<TestContext>,

  executions: [TestContext, string][],

  result: Error | undefined
};

function context(this: Context) {
  this.context = Symbol.for('context');
}

function step(this: Context) {
  const executions: [TestContext, string][] = [];

  this.step = {
    do_something(this: TestContext) {
      executions.push([this, 'when do something']);
    },
  };

  this.executions = executions;
}

function step_THROWS_ERROR(this: Context) {
  this.step = {
    do_something() {
      throw new Error('oops');
    },
  };
}

async function executing_step(this: Context) {
  this.result = await whenStep(
    this.context,
    this.step,
  );
}

function step_executed_with_context(this: Context) {
  expect(this.executions).toEqual([
    [Symbol.for('context'), 'when do something'],
  ]);
}

function NO_error_returned(this: Context) {
  expect(this.result).toBeUndefined();
}

function ERROR_returned(this: Context) {
  expect(this.result).toEqual(new Error('oops'));
}
