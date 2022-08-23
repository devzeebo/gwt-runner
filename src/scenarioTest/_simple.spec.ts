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
import scenarioTest from './scenarioTest';

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
      all_SCENARIO_called,
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
      all_SCENARIO_called,
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
      all_SCENARIO_called,
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
      all_SCENARIO_called,
      expect_error: error_containing('oops!'),
    },
  });
});

// #region givens
function mock_jest_test_function(this: any) {
  this.mock_jest_func = async (_: string, func: () => any) => func();
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
    scenario: {
      when_doing_something() {
        executions.push('when_doing_something');
      },
      then_assert_something() {
        executions.push('then_assert_something');
      },
      when_doing_something_else() {
        executions.push('when_doing_something_else');
      },
      then_assert_something_else() {
        executions.push('then_assert_something_else');
      },
    },
  };

  this.executions = executions;
}
function ERROR_test_case_WITH_expect_error(this: any) {
  const executions = [] as string[];

  this.gwt_definition = {
    scenario: {
      when_doing_something() {
        executions.push('when_doing_something');
      },
      then_assert_something() {
        executions.push('then_assert_something');
      },
      when_doing_something_else() {
        executions.push('when_doing_something_else');
      },
      then_assert_something_else() {
        executions.push('then_assert_something_else');
      },
      oops() {
        throw new Error('oops!');
      },
    },
    expect_error() {
      executions.push('expect_error');
    },
  };

  this.executions = executions;
}
function ERROR_test_case_WITHOUT_expect_error(this: any) {
  this.gwt_definition = {
    scenario: {
      oops() {
        throw new Error('Oops!');
      },
    },
  };
}
function GOOD_test_case_WITH_expect_error(this: any) {
  this.gwt_definition = {
    expect_error: noop,
  };
}
// #endregion

// #region whens
async function executing_test_case(this: any) {
  await scenarioTest(this.mock_jest_func, 'test case', this.gwt_definition);
}
// #endregion

// #region thens
function all_GIVENS_called(this: any) {
  expect(this.executions).toEqual(expect.arrayContaining(['something', 'something_else']));
}
function all_SCENARIO_called(this: any) {
  expect(this.executions).toEqual(expect.arrayContaining([
    'when_doing_something',
    'then_assert_something',
    'when_doing_something_else',
    'then_assert_something_else',
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
// #endregion
