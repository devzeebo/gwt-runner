import axios from "axios";
import { beforeEach, describe, expect, vi } from "vitest";
import { test } from "./_testBootstrap";
import { validateEmailAddress } from "./axios";

vi.mock("axios");
const mocked_axios = vi.mocked(axios, true);

describe("the validate email address api", () => {
  test("returns true for valid email addresses", {
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

  test("extracts error for invalid email address", {
    given: {
      INVALID_email_address,
    },
    when: {
      validating_email_address,
    },
    then: {
      expect_error: email_address_is_INVALID,
    },
  });

  test("extracts error from network exception", {
    given: {
      network_failure,
    },
    when: {
      validating_email_address,
    },
    then: {
      expect_error: network_failed,
    },
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });
});

type Context = {
  mock_email: string;
  result: boolean;
};

function valid_email_address(this: Context) {
  this.mock_email = "valid@email.com";

  mocked_axios.post.mockResolvedValue({
    data: { success: true },
  });
}

function INVALID_email_address(this: Context) {
  this.mock_email = "invalid";

  mocked_axios.post.mockResolvedValue({
    data: {
      success: false,
      error: "error message from server",
    },
  });
}

function network_failure() {
  mocked_axios.post.mockRejectedValue({
    message: "network failed",
    response: {
      status: 500,
    },
  });
}

async function validating_email_address(this: Context) {
  this.result = await validateEmailAddress(this.mock_email);
}

function email_address_is_valid(this: Context) {
  expect(this.result).toBe(true);
}

function email_address_is_INVALID(this: Context, error: Error) {
  expect(error).toBe("error message from server");
}

function network_failed(this: Context, error: Error) {
  expect(error).toBe("network failed");
}
