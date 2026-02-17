import { describe, expect, it } from "bun:test";

import { getUserlink } from "#lib/get-userlink";

describe("getUserlink", () => {
  it("correctly handles a simple case", () => {
    expect(getUserlink(123, "Player")).toBe("[Player](tg://user?id=123)");
  });
});
