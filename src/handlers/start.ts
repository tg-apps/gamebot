import type { Context } from "grammy";

export async function handleStart(ctx: Context) {
  const message = `Приветствую игрок\\!
Вам выдан стартовый бонус в размере 10,000,000₽
Для помощи напиши \`помощь\``;

  return await ctx.reply(message, { parse_mode: "MarkdownV2" });
}
