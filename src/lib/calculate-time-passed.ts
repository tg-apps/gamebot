export function calculateTimePassed(
  lastCollect: number,
  maxTime: number = 86400,
): number {
  return Math.min(Date.now() / 1000 - lastCollect, maxTime);
}
