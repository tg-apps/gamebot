import { formatNumber } from "#lib/format-number";
import { describe, expect, it } from "bun:test";

describe("getUserlink", () => {
  it("correctly handles a simple case", () => {
    expect(formatNumber(123.456789)).toBe(123.46);
  });
});
