import type { Context } from "grammy";
import type { User } from "grammy/types";

import { escapeMarkdown } from "#lib/escape-markdown";
import { formatNumber } from "#lib/format-number";

import { getUserBalance, getUserInfo } from "./database-manager";

export async function handleBalance(ctx: Context & { from: User }) {
  const data = getUserInfo(ctx.from.id);
  if (!data) return;
  const balance = getUserBalance(ctx.from.id);
  if (!balance) return;

  const money = escapeMarkdown(formatNumber(balance.balance));
  const tomatoes = escapeMarkdown(formatNumber(balance.tomatoes));

  const message = `
👫 Ник: [${data.nickname}]
💰 Деньги: ${money}₽
🥫 Помидоров: ${tomatoes}кг
`;

  return await ctx.reply(message, { parse_mode: "MarkdownV2" });
}
