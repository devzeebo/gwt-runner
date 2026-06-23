import { describe, expect } from "vitest";
import { test } from "./_testBootstrap";

describe("expect error", () => {
  test("should throw error", {
    given: {
      an_error_message,
    },
    when: {
      throwing_error,
    },
    then: {
      expect_error,
      and: {
        tautology,
      },
    },
  });
});

type Context = {
  error_message: string;
};

function an_error_message(this: Context) {
  this.error_message = "an error";
}
function throwing_error(this: Context) {
  throw new Error(this.error_message);
}
function expect_error(this: Context, error: Error) {
  expect(error.message).toBe(this.error_message);
}
function tautology(this: Context) {
  expect(this.error_message).toBe("an error");
}
