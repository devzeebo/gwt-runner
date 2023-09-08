import {
  test as jestTest,
  describe,
  expect,
} from '@jest/globals';
import executeStep from './executeStep';
import gwtRunner from './gwt';
import { Step } from '../types';

const test = gwtRunner(jestTest);

const timeout = (ms: number) => new Promise<void>((resolve) => {
  setTimeout(() => resolve(), ms);
});

describe('execute step', () => {
  test('works with non-async functions', {
    given: {
      context,
      NO_async_functions,
    },
    when: {
      executing_step,
    },
    then: {
      functions_execute_in_order,
    },
  });

  test('works with async functions', {
    given: {
      context,
      ALL_async_functions,
    },
    when: {
      executing_step,
    },
    then: {
      functions_execute_in_order,
    },
  });

  test('works with mixed async and sync functions', {
    given: {
      context,
      MIXED_functions,
    },
    when: {
      executing_step,
    },
    then: {
      functions_execute_in_order,
    },
  });

  test('uses same context for all contexts', {
    given: {
      context,
      NO_async_functions,
    },
    when: {
      executing_step,
    },
    then: {
      context_is_bound_to_functions,
    },
  });

  test('accepts arrays', {
    given: {
      context,
      array_functions,
    },
    when: {
      executing_step,
    },
    then: {
      functions_execute_in_order,
    }
  })
});

type Execution = {
  order: number,
  context: any
};
// #region constants
const makeFunc = (order: number, executions: Execution[]) => function (this: any) {
  executions.push({
    order,
    context: this,
  });
};

const makeAsyncFunc = (
  order: number,
  ms: number,
  executions: Execution[],
) => async function (this: any) {
  await timeout(ms);
  executions.push({
    order,
    context: this,
  });
};
// #endregion

type Context = {
  context: any,
  funcs: Step<any>,
  executions: Execution[],
}

// #region given
function context(this: Context) {
  this.context = {};
}
function NO_async_functions(this: Context) {
  const executions = [] as Execution[];

  this.funcs = {
    first_fn: makeFunc(1, executions),
    second_fn: makeFunc(2, executions),
    third_fn: makeFunc(3, executions),
  };
  this.executions = executions;
}
function ALL_async_functions(this: Context) {
  const executions = [] as Execution[];

  this.funcs = {
    first_fn: makeAsyncFunc(1, 30, executions),
    second_fn: makeAsyncFunc(2, 10, executions),
    third_fn: makeAsyncFunc(3, 20, executions),
  };
  this.executions = executions;
}
function MIXED_functions(this: Context) {
  const executions = [] as Execution[];

  this.funcs = {
    first_fn: makeFunc(1, executions),
    second_fn: makeAsyncFunc(2, 10, executions),
    third_fn: makeFunc(3, executions),
  };
  this.executions = executions;
}

function array_functions(this: Context) {
  const executions = [] as Execution[];

  // NOTE: Array Syntax
  this.funcs = [
    makeFunc(1, executions),
    makeFunc(2, executions),
    makeFunc(3, executions),
  ];
  this.executions = executions;
}
// #endregion

// #region whens
async function executing_step(this: Context) {
  await executeStep(this.context, this.funcs);
}
// #endregion

// #region thens
function functions_execute_in_order(this: Context) {
  expect(this.executions.length).toBe(3);
  expect(this.executions[0].order).toBeLessThan(this.executions[1].order);
  expect(this.executions[1].order).toBeLessThan(this.executions[2].order);
}
function context_is_bound_to_functions(this: Context) {
  expect(this.executions.length).toBe(3);
  expect(this.executions[0].context).toBe(this.context);
  expect(this.executions[1].context).toBe(this.context);
  expect(this.executions[2].context).toBe(this.context);
}
// #endregion
