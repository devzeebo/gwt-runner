import {
  test as jestTest,
  describe,
  expect,
} from '@jest/globals';
import type { ScenarioStep } from '../../types';
import gwtRunner from '../gwt';

import whenThen from './_whenThen';

const test = gwtRunner(jestTest);

describe('scenarios > when then', () => {
  test('executes when/then and then_when/then', {
    given: {
      context,
      steps,
    },
    when: {
      executing_step,
    },
    then: {
      WHEN_block_executed,
      THEN_block_executed,
      WHEN_THEN_block_executed,
      WHEN_THEN_THEN_block_executed,
    },
  });

  test('error passed to thenStep', {
    given: {
      context,
      when_step_THROWS_ERROR,
    },
    when: {
      executing_step,
    },
    then: {
      error_passed_to_THEN_block,
      AND_block_executed,
    },
  });

  test('uncaught error includes step name', {
    given: {
      context,
      NAMED_when_step_throws_UNCAUGHT_error,
    },
    when: {
      executing_step,
    },
    then: {
      expect_error: error_with_STEP_NAME,
    },
  });

  test('uncaught error includes step index', {
    given: {
      context,
      NO_NAME_when_step_throws_UNCAUGHT_error,
    },
    when: {
      executing_step,
    },
    then: {
      expect_error: error_with_STEP_INDEX,
    },
  });

  test('falsy scenario returns', {
    given: {
      context,
      FALSY_scenario,
    },
    when: {
      executing_step,
    },
    then: {
      expect_error: scenario_definition,
    },
  });

  test('arrays', {
    given: {
      context,
      array_steps,
    },
    when: {
      executing_step,
    },
    then: {
      WHEN_block_executed,
      THEN_block_executed,
      WHEN_THEN_block_executed,
      WHEN_THEN_THEN_block_executed,
    },
  });
});

type TestContext = Symbol;

type Execution = [TestContext, string];

type Context = {
  context: TestContext,
  steps: ScenarioStep<TestContext>,

  executions: Execution[],
};

function steps(this: Context) {
  const executions: Execution[] = [];

  this.steps = [{
    when: {
      do_something(this: TestContext) {
        executions.push([this, 'do_something']);
      },
    },
    then: {
      assert_something(this: TestContext) {
        executions.push([this, 'assert_something']);
      },
      assert_something_else(this: TestContext) {
        executions.push([this, 'assert_something_else']);
      },
    },
  }, {
    then_when: {
      do_something_else(this: TestContext) {
        executions.push([this, 'do_something_else']);
      },
    },
    then: {
      assert_another_thing(this: TestContext) {
        executions.push([this, 'assert_another_thing']);
      },
      assert_yet_another_thing(this: TestContext) {
        executions.push([this, 'assert_yet_another_thing']);
      },
    },
  }];

  this.executions = executions;
}

function array_steps(this: Context) {
  const executions: Execution[] = [];

  this.steps = [{
    when: [
      function do_something(this: TestContext) {
        executions.push([this, 'do_something']);
      },
    ],
    then: [
      function assert_something(this: TestContext) {
        executions.push([this, 'assert_something']);
      },
      function assert_something_else(this: TestContext) {
        executions.push([this, 'assert_something_else']);
      },
    ],
  }, {
    then_when: [
      function do_something_else(this: TestContext) {
        executions.push([this, 'do_something_else']);
      },
    ],
    then: [
      function assert_another_thing(this: TestContext) {
        executions.push([this, 'assert_another_thing']);
      },
      function assert_yet_another_thing(this: TestContext) {
        executions.push([this, 'assert_yet_another_thing']);
      },
    ],
  }];

  this.executions = executions;
}

function context(this: Context) {
  this.context = Symbol.for('context');
}

function when_step_THROWS_ERROR(this: Context) {
  const executions: Execution[] = [];

  this.steps = [{
    when: {
      do_something(this: TestContext) {
        throw new Error('oops');
      },
    },
    then: {
      expect_error(this: TestContext, error: Error) {
        executions.push([this, `expect_error: ${error.message}`]);
      },
      and: {
        assert_something(this: TestContext) {
          executions.push([this, 'assert_something']);
        },
        assert_something_else(this: TestContext) {
          executions.push([this, 'assert_something_else']);
        },
      },
    },
  }];

  this.executions = executions;
}

function NAMED_when_step_throws_UNCAUGHT_error(this: Context) {
  const executions: Execution[] = [];

  this.steps = [{
    name: 'test step name',
    when: {
      do_something(this: TestContext) {
        throw new Error('oops');
      },
    },
    then: {
    },
  }];

  this.executions = executions;
}

function NO_NAME_when_step_throws_UNCAUGHT_error(this: Context) {
  const executions: Execution[] = [];

  this.steps = [{
    name: undefined,
    when: {
      do_something(this: TestContext) {
        throw new Error('oops');
      },
    },
    then: {
    },
  }];

  this.executions = executions;
}

function FALSY_scenario(this: Context) {
  this.steps = undefined!;
}

async function executing_step(this: Context) {
  await whenThen(
    this.context,
    {
      scenario: this.steps,
    },
  );
}

function WHEN_block_executed(this: Context) {
  expect(this.executions).toEqual(expect.arrayContaining([
    [Symbol.for('context'), 'do_something'],
  ]));
}

function THEN_block_executed(this: Context) {
  expect(this.executions).toEqual(expect.arrayContaining([
    [Symbol.for('context'), 'assert_something'],
    [Symbol.for('context'), 'assert_something_else'],
  ]));
}

function WHEN_THEN_block_executed(this: Context) {
  expect(this.executions).toEqual(expect.arrayContaining([
    [Symbol.for('context'), 'do_something_else'],
  ]));
}

function WHEN_THEN_THEN_block_executed(this: Context) {
  expect(this.executions).toEqual(expect.arrayContaining([
    [Symbol.for('context'), 'assert_another_thing'],
    [Symbol.for('context'), 'assert_yet_another_thing'],
  ]));
}

function error_passed_to_THEN_block(this: Context) {
  expect(this.executions).toEqual(expect.arrayContaining([
    [Symbol.for('context'), 'expect_error: oops'],
  ]));
}

function AND_block_executed(this: Context) {
  expect(this.executions).toEqual(expect.arrayContaining([
    [Symbol.for('context'), 'assert_something'],
    [Symbol.for('context'), 'assert_something_else'],
  ]));
}

function error_with_STEP_NAME(this: Context, error: Error) {
  expect(error.message).toContain('Error in step "test step name"');
  expect(error.message).toContain('oops');
}

function error_with_STEP_INDEX(this: Context, error: Error) {
  expect(error.message).toContain('Error in step "0"');
  expect(error.message).toContain('oops');
}

function scenario_definition(this: Context, error: Error) {
  expect(error.message).toBe('Expected scenario definition');
}
