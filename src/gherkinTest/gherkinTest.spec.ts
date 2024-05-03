import {
  test as jestTest,
  describe,
  expect,
} from '@jest/globals';
import {
  noop,
  toLower,
} from 'lodash/fp';
import gwtRunner from '../gwt';
import gherkinTest from './gherkinTest';

const test = gwtRunner(jestTest);

describe('test context', () => {
  test('has no expected errors', {
    given: {
      mock_jest_test_function,
      GOOD_test_case,
    },
    when: {
      executing_test_case,
    },
    then: {
      all_GIVENS_called,
      all_WHENS_called,
      all_THENS_called,
    },
  });

  test('properly handles errors', {
    given: {
      mock_jest_test_function,
      ERROR_test_case_WITH_expect_error,
    },
    when: {
      executing_test_case,
    },
    then: {
      expect_error_CALLED,
    },
  });

  test('expected error but no error thrown', {
    given: {
      mock_jest_test_function,
      GOOD_test_case_WITH_expect_error,
    },
    when: {
      executing_test_case,
    },
    then: {
      expect_error: error_containing('expected error to be thrown, but no error was thrown'),
    },
  });

  test('unexpected error', {
    given: {
      mock_jest_test_function,
      ERROR_test_case_WITHOUT_expect_error,
    },
    when: {
      executing_test_case,
    },
    then: {
      expect_error: error_containing('oops!'),
    },
  });

  test('with configuration', {
    given: {
      mock_test_function_WITH_ARGUMENTS,
      configure_test_function,
      GOOD_test_case,
    },
    when: {
      executing_test_case,
    },
    then: {
      all_GIVENS_called,
      all_WHENS_called,
      all_THENS_called,
      configure_called_with_context_and_args,
    },
  });
});

// #region givens
function mock_jest_test_function(this: any) {
  this.mock_jest_func = async (_: string, func: () => any) => func();
}

function mock_test_function_WITH_ARGUMENTS(this: any) {
  this.mock_jest_func = async (
    _: string,
    func: (first: any, second: any) => any,
  ) => func('first', 'second');
}

function configure_test_function(this: any) {
  this.configure_test_fn = jest.fn();
}

function GOOD_test_case(this: any) {
  const executions = [] as string[];

  this.gwt_definition = {
    given: {
      something() {
        executions.push('something');
      },
      something_else() {
        executions.push('something_else');
      },
    },
    when: {
      something_happens() {
        executions.push('something_happens');
      },
      something_else_happens() {
        executions.push('something_else_happens');
      },
    },
    then: {
      assert_something() {
        executions.push('assert_something');
      },
      assert_something_else() {
        executions.push('assert_something_else');
      },
    },
  };

  this.executions = executions;
}

function ERROR_test_case_WITH_expect_error(this: any) {
  const executions = [] as string[];

  this.gwt_definition = {
    when: {
      oops() {
        throw new Error('Oops!');
      },
    },
    then: {
      expect_error() {
        executions.push('expect_error');
      },
    },
  };

  this.executions = executions;
}
function ERROR_test_case_WITHOUT_expect_error(this: any) {
  this.gwt_definition = {
    when: {
      oops() {
        throw new Error('Oops!');
      },
    },
    then: {
    },
  };
}
function GOOD_test_case_WITH_expect_error(this: any) {
  this.gwt_definition = {
    then: {
      expect_error: noop,
    },
  };
}
// #endregion

// #region whens
async function executing_test_case(this: any) {
  await gherkinTest(
    this.mock_jest_func,
    this.configure_test_fn,
    'test case',
    this.gwt_definition,
  );
}
// #endregion

// #region thens
function all_GIVENS_called(this: any) {
  expect(this.executions).toEqual(expect.arrayContaining(['something', 'something_else']));
}
function all_WHENS_called(this: any) {
  expect(this.executions).toEqual(expect.arrayContaining([
    'something_happens',
    'something_else_happens',
  ]));
}
function all_THENS_called(this: any) {
  expect(this.executions).toEqual(expect.arrayContaining([
    'assert_something',
    'assert_something_else',
  ]));
}
function expect_error_CALLED(this: any) {
  expect(this.executions).toEqual(expect.arrayContaining(['expect_error']));
}
function error_containing(this: any, message: string) {
  return function (this: any, e: Error) {
    expect(toLower(e.message)).toEqual(expect.stringMatching(toLower(message)));
  };
}

function configure_called_with_context_and_args(this: any) {
  expect(this.configure_test_fn).toHaveBeenCalledWith(
    expect.anything(),
    'first',
    'second',
  );
}
// #endregion
