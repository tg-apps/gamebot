import { describe, expect, it, setSystemTime } from "bun:test";

import { calculateTimePassed } from "#lib/calculate-time-passed";

describe("calculateTimePassed", () => {
  it("returns seconds passed when under maxTime", () => {
    setSystemTime(new Date("2025-01-31T14:30:00.000Z"));
    const lastCollect = Math.floor(
      new Date("2025-01-31T14:00:00.000Z").getTime() / 1000,
    ); // 1800 seconds earlier
    const result = calculateTimePassed(lastCollect);
    expect(result).toBe(1800);
  });

  it("caps result at maxTime (default 86400)", () => {
    setSystemTime(new Date("2026-01-31"));
    // Pretend last collection was a long time ago
    const lastCollect = Math.floor(new Date("2026-01-01").getTime() / 1000);
    const result = calculateTimePassed(lastCollect);
    expect(result).toBe(86400); // exactly the default max
  });

  it("handles very recent collection (0 or almost 0)", () => {
    const now = Date.now();
    setSystemTime(now);
    const lastCollect = Math.floor(now / 1000) - 3; // 3 seconds ago
    const result = calculateTimePassed(lastCollect);
    expect(result).toBe(3);
  });
});
