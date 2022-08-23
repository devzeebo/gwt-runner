import {
  test as jestTest,
  expect,
  describe,
} from '@jest/globals';
import gwtRunner from '../gwt';
import { isGherkinTest } from './gherkinTest';

const test = gwtRunner(jestTest);

describe('validate definition', () => {
  test('accepts only given', {
    given: {
      definition_with_only_GIVEN,
    },
    when: {
      validating_definition,
    },
    then: {
      definition_is_valid,
    },
  });

  test('accepts only when', {
    given: {
      definition_with_only_WHEN,
    },
    when: {
      validating_definition,
    },
    then: {
      definition_is_valid,
    },
  });

  test('accepts only then', {
    given: {
      definition_with_only_THEN,
    },
    when: {
      validating_definition,
    },
    then: {
      definition_is_valid,
    },
  });

  test('accepts all three', {
    given: {
      complete_definition,
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

function definition_with_only_GIVEN(this: any) {
  this.definition = {
    given: {},
  };
}
function definition_with_only_WHEN(this: any) {
  this.definition = {
    when: {},
  };
}
function definition_with_only_THEN(this: any) {
  this.definition = {
    then: {},
  };
}
function complete_definition(this: any) {
  this.definition = {
    given: {},
    when: {},
    then: {},
  };
}
function definition_with_EXTRA_KEYS(this: any) {
  this.definition = {
    given: {},
    when: {},
    then: {},
    extra: {},
  };
}

function validating_definition(this: any) {
  this.result = isGherkinTest(this.definition);
}

function definition_is_valid(this: any) {
  expect(this.result).toBe(true);
}
function definition_is_INVALID(this: any) {
  expect(this.result).toBe(false);
}
