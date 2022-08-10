import {
  test as jestTest,
  describe,
  expect,
} from '@jest/globals';
import { mocked } from 'jest-mock';
import type { GivenScenarioTest, TestFunction } from '../../types';
import gwtRunner from '../gwt';
import scenarioTest from './scenarioTest';

import executeWhenThen from './_whenThen';

jest.mock('./_whenThen');

const test = gwtRunner(jestTest);

const mocked_executeWhenThen = mocked(executeWhenThen);

describe('scenario test', () => {
  test('when/then', {
    given: {
      mock_test_function,
      when_then_test,
    },
    when: {
      executing_test,
    },
    then: {
      test_executed_as_WHEN_THEN,
    },
  });
});

type Context = {
  test_fn: TestFunction,
  test: GivenScenarioTest<Symbol>,
};

function when_then_test(this: Context) {
  this.test = {
    scenario: [{
      when: {},
      then: {},
    }, {
      then_when: {},
      then: {},
    }],
  };
}

function mock_test_function(this: Context) {
  this.test_fn = async (_: string, func: () => any) => func();
}

async function executing_test(this: Context) {
  await scenarioTest(
    this.test_fn,
    'test case',
    this.test,
  );
}

function test_executed_as_WHEN_THEN(this: Context) {
  expect(mocked_executeWhenThen).toHaveBeenCalledWith(
    expect.anything(),
    this.test,
  );
}
