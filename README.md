# gwt-runner
A small library to provide given-when-then style testing without a bunch of overhead

## Installation
Generally, you won't be using this library directly. It is intentionally
unbound to any specific test runner so that if your test runner isn't
supported, you can support it!

You probably want one of the bound libraries:

* [jest-gwt](https://github.com/devzeebo/jest-gwt)
* [cypress-gwt](https://github.com/devzeebo/cypress-gwt)
* [mocha-gwt-runner](https://github.com/devzeebo/mocha-gwt-runner)

Unfortunately, `mocha-gwt` was already taken, and is NOT associated with this
project. It is completely different. Don't get confused.

## Usage

1. Install your test library of choice (in this readme we'll use [Jest](https://www.npmjs.com/package/jest)
    ```bash
    npm i -S jest-gwt
    ```
2. In your test files, import your test runner's test function from here
    ```js
    import test from 'jest-gwt';
    ```
3. Write a test!
    ```js
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
    });
    ```

## Detailed Usage
The test function is invoked with two parameters:
* `name`: the name of the test passed to your test runner
* `definition`: The GWT definition

Name is pretty self-explanatory, so we'll focus on `definition`.

The test definition is an object with three keys: `given`, `when`, and
`then`. If you pass any other keys, your test will fail with an error.

All `given` clauses are executed first, then all `when` clauses, then all
`then` clauses.

The syntax of `definition` takes advantage of ES6's shorthand object literal
syntax. In reality, the object looks like this:
```js
{
  given: {
    mock_jest_test_function: mock_jest_test_function,
    GOOD_test_case: GOOD_test_case,
  },
  when: {
    executing_test_case: executing_test_case,
  },
  then: {
    all_GIVENS_called: all_GIVENS_called,
    all_WHENS_called: all_WHENS_called,
    all_THENS_called: all_THENS_called,
  },
}
```

The key names _within_ the `given`, `when`, and `then` definition do not
matter. For instance, maybe you have a function that takes an expected value:
```js
then: {
  the_value_is_correct: the_value_is(15)
}
```

Generally, you want to use the shorthand syntax as it reads nicer.

The only acceptable clauses in the `given`, `when`, and `then` definitions are
UNBOUND functions. Do NOT use arrow functions, or the context won't work at
all!

## Functions in the Definition

#### DO NOT USE ARROW FUNCTIONS IN GWT DEFINITIONS

Typical function declarations for usage in the `given`, `when`, and `then`
definitions looks like:

```js
function valid_email() {
  this.email = 'test@mail.com';
}

async function validating_email() {
  this.validation_result = await validateEmailAsync(this.email);
}

function email_is_valid() {
  expect(this.validation_result).toBe(true);
}
```

Clauses can be either regular or asynchronous functions if your test runner
supports it! Every test execution declares a new `context` and binds the
clauses in `given`, `when`, and `then` to the test `context` so that
accessing `this` within the clauses is independent of other test executions.
Passing data between clauses during a test execution should only be done
through the test `context` accessed through `this`. No arguments are passed
to the clauses.

### Expecting Errors
If your test is expecting an error, pass a function to `then` named
`expect_error`. `gwt-runner` will pick this up, and execute it, passing the
error to your function. Validate the error is what you expect it to be, and
your test will pass.

If however your code throws an error and you do NOT have an `expect_error` in
your then clauses, it will fail your test with the error that was thrown.

```js
test('should throw error', {
  given: {
    an_error_message,
  },
  when: {
    throwing_error,
  },
  then: {
    expect_error,
  },
});

function an_error_message() {
  this.error_message = 'an error';
}
function throwing_error() {
  throw new Error(this.error_message);
}
function expect_error(error) {
  expect(error.message).toBe(this.error_message);
}
```

## Example

The following example tests an contrived `validateEmailAddress` AJAX call.

```js
// validateEmailAddress.js
import axios from 'axios';

export default email => axios.post('/api/validateEmail', {
  email,
}).then(res => {
  if (res.data.success) {
    return Promise.resolve(true);
  }

  return Promise.reject(res.data.error);
});
```

```js
import test from 'jest-gwt';
import axios from 'axios';

import validateEmailAddress from './validateEmailAddress';

jest.mock('axios');

describe('the validate email address api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('returns true for valid email addresses', {
    given: {
      valid_email_address,
    },
    when: {
      validating_email_address,
    },
    then: {
      email_address_is_valid,
    },
  });

  test('extracts error for invalid email address', {
    given: {
      INVALID_email_address,
    },
    when: {
      validating_email_address,
    },
    then: {
      expect_error: email_address_is_INVALID,
    }
  });
});

function valid_email_address() {
  this.mock_email = 'valid@email.com';

  axios.post.mockResolvedValue({
    data: { success: true }
  });
}

function INVALID_email_address() {
  this.mock_email = 'invalid';

  axios.post.mockResolvedValue({
    data: {
      success: false,
      error: 'error message from server',
    },
  });
}

async function validating_email_address() {
  this.result = await validateEmailAddress(this.mock_email);
}

function email_address_is_valid() {
  expect(this.result).toBe(true);
}

function email_address_is_INVALID(error) {
  expect(error).toBe('error message from server');
}
```