import { escapeMarkdown } from "#lib/escape-markdown";
import { describe, expect, it } from "bun:test";

describe("getUserlink", () => {
  it("correctly handles a simple case", () => {
    expect(escapeMarkdown(123.456)).toBe("123\\.456");
  });
});
