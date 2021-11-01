import {
  test as jestTest,
  expect,
  describe,
} from '@jest/globals';
import gwtRunner from './gwt';
import { isScenarioTest } from './scenarioTest';

const test = gwtRunner(jestTest);

describe('validate definition', () => {
  test('accepts given scenario', {
    given: {
      definition_with_SCENARIO,
    },
    when: {
      validating_definition,
    },
    then: {
      definition_is_valid,
    },
  });

  test('accepts given scenario and expect error', {
    given: {
      definition_with_SCENARIO_and_EXPECT_ERROR,
    },
    when: {
      validating_definition,
    },
    then: {
      definition_is_valid,
    },
  });

  test('rejects extra keys', {
    given: {
      definition_with_EXTRA_KEYS,
    },
    when: {
      validating_definition,
    },
    then: {
      definition_is_INVALID,
    },
  });
});

function definition_with_SCENARIO(this: any) {
  this.definition = {
    given: {},
    scenario: {},
  };
}
function definition_with_SCENARIO_and_EXPECT_ERROR(this: any) {
  this.definition = {
    given: {},
    scenario: {},
    expect_error: () => {},
  };
}

function definition_with_EXTRA_KEYS(this: any) {
  this.definition = {
    given: {},
    scenario: {},
    extra: {},
  };
}

function validating_definition(this: any) {
  this.result = isScenarioTest(this.definition);
}

function definition_is_valid(this: any) {
  expect(this.result).toBe(true);
}
function definition_is_INVALID(this: any) {
  expect(this.result).toBe(false);
}
