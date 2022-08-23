import {
  test as jestTest,
  describe,
  expect,
} from '@jest/globals';
import {
  toLower,
} from 'lodash/fp';
import gwtRunner from './gwt';

const test = gwtRunner(jestTest);

describe('test context', () => {
  test('invalid definition throws error', {
    given: {
      mock_jest_test_function,
      INVALID_test_case,
    },
    when: {
      executing_test_case,
    },
    then: {
      expect_error: error_containing('Invalid GWT definition'),
    },
  });
});

// #region givens
function mock_jest_test_function(this: any) {
  this.mock_jest_func = async (_: string, func: () => any) => func();
}
function INVALID_test_case(this: any) {
  this.gwt_definition = {
    given: {},
    when: {},
    then: {},
    oops: {},
  };
}
// #endregion

// #region whens
async function executing_test_case(this: any) {
  await gwtRunner(this.mock_jest_func)('test case', this.gwt_definition);
}
// #endregion

// #region thens
function error_containing(this: any, message: string) {
  return function (this: any, e: Error) {
    expect(toLower(e.message)).toEqual(expect.stringMatching(toLower(message)));
  };
}
// #endregion
