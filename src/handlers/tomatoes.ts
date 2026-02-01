import type { Context } from "grammy";
import type { User } from "grammy/types";

import { getUserlink } from "#lib/get-userlink";

import {
  getUserBalance,
  getUserInfo,
  updateUserBalance,
} from "./database-manager";

export async function handleTomatoes(ctx: Context & { from: User }) {
  const userId = ctx.from.id;
  const userInfo = await getUserInfo(userId);
  if (!userInfo) return;
  const userBalance = await getUserBalance(userId);
  if (!userBalance) return;

  const userlink = getUserlink(userId, userInfo.nickname);

  return await ctx.reply(
    `${userlink}, у вас ${userBalance.tomatoes}кг помидоров 🍅`,
  );
}

async function sellTomatoes(
  userId: number,
): Promise<{ earnings: number; tomatoes: number }> {
  const userBalance = await getUserBalance(userId);

  if (!userBalance || userBalance.tomatoes <= 0) {
    return { tomatoes: 0, earnings: 0 };
  }

  const TOMATO_PRICE = 400;
  const earnings = userBalance.tomatoes * TOMATO_PRICE;

  await updateUserBalance(userId, {
    tomatoes: 0,
    balance: userBalance.balance + earnings,
  });

  return { tomatoes: userBalance.tomatoes, earnings };
}

export async function handleSellTomatoes(ctx: Context & { from: User }) {
  const userId = ctx.from.id;
  const userInfo = await getUserInfo(userId);
  if (!userInfo) return;

  const userlink = getUserlink(userId, userInfo.nickname);

  const { tomatoes, earnings } = await sellTomatoes(userId);

  return await ctx.reply(
    `${userlink}, вы успешно продали ${tomatoes}кг помидоров 🍅 на сумму ${earnings}₽`,
  );
}
