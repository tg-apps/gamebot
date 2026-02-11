import type { Context } from "grammy";
import type { User } from "grammy/types";

import { getUserlink } from "#lib/get-userlink";

import {
  getBusinessInfo,
  getTomatoFarmInfo,
  getUserBalance,
  getUserInfo,
} from "./database-manager";

export async function handleProfile(ctx: Context & { from: User }) {
  const userInfo = getUserInfo(ctx.from.id);
  if (!userInfo) return;
  const balance = getUserBalance(ctx.from.id);
  if (!balance) return;
  const business = getBusinessInfo(ctx.from.id);
  if (!business) return;
  const farm = getTomatoFarmInfo(ctx.from.id);
  if (!farm) return;

  const userlink = getUserlink(ctx.from.id, userInfo.nickname);

  const message = `${userlink}, ваш профиль:
💰 Денег: ${balance.balance}₽
🥫 Помидоры: ${balance.tomatoes}кг
💼 Бизнес: ${business.level} рабочих
🏭 Ферма: ${farm.level} грядок"
`;

  return ctx.reply(message, { parse_mode: "MarkdownV2" });
}
