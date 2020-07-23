import { test as jestTest, expect } from '@jest/globals';
import gwtRunner from './gwt';

import validateDefinition from './validateDefinition';

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

function definition_with_only_GIVEN() {
  this.definition = {
    given: {},
  };
}
function definition_with_only_WHEN() {
  this.definition = {
    when: {},
  };
}
function definition_with_only_THEN() {
  this.definition = {
    then: {},
  };
}
function complete_definition() {
  this.definition = {
    given: {},
    when: {},
    then: {},
  };
}

function definition_with_EXTRA_KEYS() {
  this.definition = {
    given: {},
    when: {},
    then: {},
    extra: {},
  };
}

function validating_definition() {
  this.result = validateDefinition(this.definition);
}

function definition_is_valid() {
  expect(this.result).toBe(true);
}
function definition_is_INVALID() {
  expect(this.result).toBe(false);
}
