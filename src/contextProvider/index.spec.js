import {
  describe,
  expect,
  test as jestTest,
} from '@jest/globals';
import gwtRunner from '../gwt';

const test = gwtRunner(jestTest);

describe('global context provider', () => {
  test('returns same instance every time', {
    when: {
      importing_global_context_provider,
      importing_global_context_provider_AGAIN,
    },
    then: {
      context_provider_IS_SAME,
    },
  });
});

async function importing_global_context_provider() {
  import('./index').then((dep) => {
    this.global_context_provider = dep;
  });
}

async function importing_global_context_provider_AGAIN() {
  import('./index').then((dep) => {
    this.second_global_context_provider = dep;
  });
}

function context_provider_IS_SAME() {
  expect(this.second_global_context_provider).toBe(this.global_context_provider);
}
