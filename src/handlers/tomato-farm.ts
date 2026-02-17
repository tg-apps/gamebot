import type { Context } from "grammy";
import type { User } from "grammy/types";

import { calculateTimePassed } from "#lib/calculate-time-passed";
import { getUserlink } from "#lib/get-userlink";

import {
  getTomatoFarmInfo,
  getUserBalance,
  getUserInfo,
  updateTomatoFarmInfo,
  updateUserBalance,
} from "./database-manager";

function calculateFarmIncome(farmLevel: number): number {
  if (farmLevel === 0) return 0;
  return 1.2 ** farmLevel * 10;
}

async function getFarmProfit(
  userId: number,
  farmInfo: { level: number; lastCollect: number },
): Promise<number> {
  if (farmInfo.level === 0) return 0;
  if (farmInfo.lastCollect === 0) {
    updateTomatoFarmInfo(userId, { lastCollect: Date.now() / 1000 });
    return 0;
  }
  const timePassed = calculateTimePassed(farmInfo.lastCollect);
  return timePassed * calculateFarmIncome(userId);
}

async function collectFarmProfit(
  userId: number,
  farmInfo: { level: number; lastCollect: number },
  tomatoes: number,
): Promise<number> {
  const profit = await getFarmProfit(userId, farmInfo);
  updateTomatoFarmInfo(userId, { lastCollect: Date.now() / 1000 });
  updateUserBalance(userId, { tomatoes: tomatoes + profit });
  return profit;
}

function calculateUpgradeFarmLevelCost(farmLevel: number): number {
  return 1.2 ** farmLevel * 20_000_000;
}

async function upgradeFarmLevel(
  userId: number,
  farmInfo: { level: number; lastCollect: number },
  userBalance: number,
) {
  const upgradeCost = calculateUpgradeFarmLevelCost(userId);
  if (userBalance < upgradeCost) {
    return {
      success: false,
      message: "у вас недостаточно денег для улучшения",
    };
  }

  const MAX_FARM_LEVEL = 500;

  if (farmInfo.level >= MAX_FARM_LEVEL) {
    return { success: false, message: "ваша ферма максимального уровня" };
  }

  updateUserBalance(userId, { balance: userBalance - upgradeCost });
  updateTomatoFarmInfo(userId, { level: farmInfo.level + 1 });

  return { success: true, message: "вы улучшили вашу ферму" };
}

export async function handleTomatoFarm(
  ctx: Context & { from: User },
  action?: "collect" | "upgrade",
) {
  const userId = ctx.from.id;
  const userInfo = getUserInfo(userId);
  if (!userInfo) return;

  const farmInfo = getTomatoFarmInfo(userId);
  if (!farmInfo) return;

  const userlink = getUserlink(userId, userInfo.nickname);

  if (!action) {
    if (farmInfo.level === 0) {
      return await ctx.reply("У вас нет фермы");
    }

    const farmProfit = await getFarmProfit(userId, farmInfo);

    const message = `
${userlink}, информация о вашей ферме:

🪴 Грядок: ${farmInfo.level}/500
💵 Доход: ${calculateFarmIncome(farmInfo.level)}кг/сек
💰 Прибыль: ${farmProfit}кг
`;

    return await ctx.reply(message, { parse_mode: "MarkdownV2" });
  }

  const userBalance = getUserBalance(userId);
  if (!userBalance) return;

  if (action === "collect") {
    const profit = collectFarmProfit(userId, farmInfo, userBalance.tomatoes);
    return await ctx.reply(
      `${userlink}, вы успешно собрали ${profit}кг помидоров с баланса вашей фермы`,
    );
  }

  if (action === "upgrade") {
    const { message } = await upgradeFarmLevel(
      userId,
      farmInfo,
      userBalance.balance,
    );
    return await ctx.reply(`${userlink}, ${message}`, {
      parse_mode: "MarkdownV2",
    });
  }
}
