export function getUserlink(userId: number, nickname: string): string {
  return `[${nickname}](tg://user?id=${userId})`;
}
