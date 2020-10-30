import {
  describe,
  expect,
  test as jestTest,
} from '@jest/globals';
import {
  get,
} from 'lodash/fp';
import gwtRunner from '../gwt';

import ContextProvider from './ContextProvider';

const test = gwtRunner(jestTest);

describe('Context Provider', () => {
  test('spawn context creates new context if empty', {
    given: {
      context_provider,
      active_context_IS_FALSY,
    },
    when: {
      spawning_context,
    },
    then: {
      active_context_EXISTS,
      active_context_has_NO_parent,
    },
  });

  test('creates child context if context exists', {
    given: {
      context_provider_WITH_active_context,
    },
    when: {
      spawning_context,
    },
    then: {
      active_context_EXISTS,
      active_context_has_PARENT,
    },
  });

  test('revert context without active context is noop', {
    given: {
      context_provider,
      active_context_IS_FALSY,
    },
    when: {
      reverting_context,
    },
    then: {
      active_context_IS_FALSY,
    },
  });

  test('revert context selects parent as active context', {
    given: {
      context_provider_WITH_active_context,
    },
    when: {
      spawning_context,
      reverting_context,
    },
    then: {
      active_context_IS_PARENT,
    },
  });
});

function context_provider() {
  this.context_provider = new ContextProvider();
}

function context_provider_WITH_active_context() {
  this.context_provider = new ContextProvider();
  this.context_provider.spawnContext();
}

function spawning_context() {
  this.previous_context = get('context_provider.activeContext', this);
  this.context_provider.spawnContext();
}

function reverting_context() {
  this.previous_context = get('context_provider.activeContext', this);
  this.context_provider.revertContext();
}

function active_context_EXISTS() {
  expect(this.context_provider.activeContext).toBeTruthy();
}

function active_context_has_NO_parent() {
  expect(this.context_provider.activeContext.parent).toBeFalsy();
}

function active_context_has_PARENT() {
  expect(get('context_provider.activeContext.parent', this)).toBeTruthy();
  expect(get('context_provider.activeContext.parent', this)).toBe(this.previous_context);
}

function active_context_IS_FALSY() {
  expect(this.context_provider.activeContext).toBeFalsy();
}

function active_context_IS_PARENT() {
  expect(get('context_provider.activeContext', this)).toBeTruthy();
  expect(get('context_provider.activeContext', this)).toBe(this.previous_context.parent);
}
