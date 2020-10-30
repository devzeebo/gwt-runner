import {
  describe,
  expect,
  test as jestTest,
} from '@jest/globals';
import gwtRunner from '../gwt';

import Context from './Context';

const test = gwtRunner(jestTest);

describe('Context', () => {
  test('parent is optional', {
    when: {
      creating_context_WITHOUT_parent,
    },
    then: {
      parent_is_FALSY,
    },
  });

  test('context falls back on parent context', {
    given: {
      context_WITH_parent,
      parent_context_has_value,
    },
    when: {
      accessing_context_value,
    },
    then: {
      context_value_is_PARENT_VALUE,
    },
  });

  test('context hides values in parent context', {
    given: {
      context_WITH_parent,
      parent_context_has_value,
    },
    when: {
      setting_context_value,
      accessing_context_value,
    },
    then: {
      context_value_is_CHILD_VALUE,
      parent_context_UNCHANGED,
    },
  });

  test('get child sets parent', {
    given: {
      context,
    },
    when: {
      getting_child_context,
    },
    then: {
      child_context_has_parent,
    },
  });
});

function creating_context_WITHOUT_parent() {
  this.context = new Context();
}

function context() {
  this.context = new Context();
}

function parent_is_FALSY() {
  expect(this.context.parent).toBeFalsy();
}

function context_WITH_parent() {
  this.parent_context = new Context();
  this.context = new Context(this.parent_context);
}

function parent_context_has_value() {
  this.parent_context.context.value = 'parent';
}

function setting_context_value() {
  this.context.context.value = 'child';
}

function accessing_context_value() {
  this.result = this.context.context.value;
}

function getting_child_context() {
  this.parent_context = this.context;
  this.context = this.parent_context.getChild();
}

function context_value_is_PARENT_VALUE() {
  expect(this.result).toBe('parent');
}

function context_value_is_CHILD_VALUE() {
  expect(this.result).toBe('child');
}

function parent_context_UNCHANGED() {
  expect(this.parent_context.context.value).toBe('parent');
}

function child_context_has_parent() {
  expect(this.context.parent).toBe(this.parent_context);
}
