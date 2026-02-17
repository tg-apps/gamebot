import type { Context } from "grammy";
import type { User } from "grammy/types";

import { calculateTimePassed } from "#lib/calculate-time-passed";
import { escapeMarkdown } from "#lib/escape-markdown";
import { formatNumber } from "#lib/format-number";
import { getUserlink } from "#lib/get-userlink";

import {
  getBusinessInfo,
  getUserBalance,
  getUserInfo,
  updateBusinessInfo,
  updateUserBalance,
} from "./database-manager";

function calculateBusinessIncome(businessLevel: number): number {
  if (businessLevel === 0) return 0;
  return 1.1 ** businessLevel * 10_000;
}

function getBusinessProfit(
  userId: number,
  businessInfo: { level: number; lastCollect: number },
): number {
  if (businessInfo.level === 0) return 0;
  if (businessInfo.lastCollect === 0) {
    updateBusinessInfo(userId, { lastCollect: Date.now() / 1000 });
    return 0;
  }
  const timePassed = calculateTimePassed(businessInfo.lastCollect);
  return timePassed * calculateBusinessIncome(businessInfo.level);
}

function collectBusinessProfit(
  userId: number,
  businessInfo: { level: number; lastCollect: number },
  userBalance: number,
): number {
  const profit = getBusinessProfit(userId, businessInfo);
  updateBusinessInfo(userId, { lastCollect: Date.now() / 1000 });
  updateUserBalance(userId, { balance: userBalance + profit });
  return profit;
}

function calculateUpgradeBusinessLevelCost(businessLevel: number): number {
  return 1.1 ** businessLevel * 5_000_000;
}

async function upgradeBusinessLevel(
  userId: number,
  businessInfo: { level: number; lastCollect: number },
  userBalance: number,
) {
  const upgradeCost = calculateUpgradeBusinessLevelCost(businessInfo.level);
  if (userBalance < upgradeCost) {
    return {
      success: false,
      message: "у вас недостаточно денег для улучшения",
    };
  }

  const MAX_BUSINESS_LEVEL = 200;

  if (businessInfo.level >= MAX_BUSINESS_LEVEL) {
    return { success: false, message: "ваш бизнес максимального уровня" };
  }

  updateUserBalance(userId, { balance: userBalance - upgradeCost });
  updateBusinessInfo(userId, { level: businessInfo.level + 1 });

  return { success: true, message: "вы улучшили ваш бизнес" };
}

export async function handleBusiness(
  ctx: Context & { from: User },
  action?: "collect" | "upgrade",
) {
  const userId = ctx.from.id;
  const userInfo = getUserInfo(userId);
  if (!userInfo) return;

  const businessInfo = getBusinessInfo(userId);
  if (!businessInfo) return;

  const userlink = getUserlink(userId, userInfo.nickname);

  if (!action) {
    if (businessInfo.level === 0) {
      return await ctx.reply("У вас нет бизнеса");
    }

    const businessIncome = escapeMarkdown(
      calculateBusinessIncome(businessInfo.level),
    );

    const businessProfit = escapeMarkdown(
      formatNumber(getBusinessProfit(userId, businessInfo)),
    );

    const message = `
${userlink}, информация о вашем бизнесе:

👨 ‍Рабочих: ${businessInfo.level}/200
💶 Доход: ${businessIncome}₽/сек
💰 Прибыль: ${businessProfit}₽
`;

    return await ctx.reply(message, { parse_mode: "MarkdownV2" });
  }

  const userBalance = getUserBalance(userId);
  if (!userBalance) return;

  if (action === "collect") {
    const profit = escapeMarkdown(
      formatNumber(
        collectBusinessProfit(userId, businessInfo, userBalance.balance),
      ),
    );
    return await ctx.reply(
      `${userlink}, вы успешно собрали ${profit}₽ с баланса вашего бизнеса`,
      { parse_mode: "MarkdownV2" },
    );
  }

  if (action === "upgrade") {
    const { message } = await upgradeBusinessLevel(
      userId,
      businessInfo,
      userBalance.balance,
    );
    return await ctx.reply(`${userlink}, ${message}`, {
      parse_mode: "MarkdownV2",
    });
  }
}
