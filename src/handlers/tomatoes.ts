import type { Context } from "grammy";
import type { User } from "grammy/types";

import { escapeMarkdown } from "#lib/escape-markdown";
import { formatNumber } from "#lib/format-number";
import { getUserlink } from "#lib/get-userlink";

import {
  getUserBalance,
  getUserInfo,
  updateUserBalance,
} from "./database-manager";

export async function handleTomatoes(ctx: Context & { from: User }) {
  const userId = ctx.from.id;
  const userInfo = getUserInfo(userId);
  if (!userInfo) return;
  const userBalance = getUserBalance(userId);
  if (!userBalance) return;

  const userlink = getUserlink(userId, userInfo.nickname);

  const tomatoes = escapeMarkdown(formatNumber(userBalance.tomatoes));

  return await ctx.reply(`${userlink}, у вас ${tomatoes}кг помидоров 🍅`, {
    parse_mode: "MarkdownV2",
  });
}

function sellTomatoes(userId: number): { earnings: number; tomatoes: number } {
  const userBalance = getUserBalance(userId);

  if (!userBalance || userBalance.tomatoes <= 0) {
    return { tomatoes: 0, earnings: 0 };
  }

  const TOMATO_PRICE = 400;
  const earnings = userBalance.tomatoes * TOMATO_PRICE;

  updateUserBalance(userId, {
    tomatoes: 0,
    balance: userBalance.balance + earnings,
  });

  return { tomatoes: userBalance.tomatoes, earnings };
}

export async function handleSellTomatoes(ctx: Context & { from: User }) {
  const userId = ctx.from.id;
  const userInfo = getUserInfo(userId);
  if (!userInfo) return;

  const userlink = getUserlink(userId, userInfo.nickname);

  const { tomatoes, earnings } = sellTomatoes(userId);

  return await ctx.reply(
    `${userlink}, вы успешно продали ${escapeMarkdown(formatNumber(tomatoes))}кг помидоров 🍅 на сумму ${escapeMarkdown(formatNumber(earnings))}₽`,
    { parse_mode: "MarkdownV2" },
  );
}
