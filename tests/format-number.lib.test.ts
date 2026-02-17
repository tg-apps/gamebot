import { describe, expect, it } from "bun:test";

import { formatNumber } from "#lib/format-number";

describe("getUserlink", () => {
  it("correctly handles a simple case", () => {
    expect(formatNumber(123.456789)).toBe(123.46);
  });
});
