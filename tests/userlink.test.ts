import { getUserlink } from "#lib/get-userlink";
import { describe, expect, it } from "bun:test";

describe("getUserlink", () => {
  it("correctly handles a simple case", () => {
    expect(getUserlink(123, "Player")).toBe(`[Player](tg://user?id=123)`);
  });
});
