import type { Context } from "grammy";
import type { User } from "grammy/types";

import { getUserBalance, getUserInfo } from "./database-manager";

export async function handleBalance(ctx: Context & { from: User }) {
  const data = await getUserInfo(ctx.from.id);
  if (!data) return;
  const balance = await getUserBalance(ctx.from.id);
  if (!balance) return;

  const message = `
👫 Ник: [${data.nickname}]
💰 Деньги: ${balance.balance}₽
🥫 Помидоров: ${balance.tomatoes}кг
`;

  return await ctx.reply(message, { parse_mode: "MarkdownV2" });
}
