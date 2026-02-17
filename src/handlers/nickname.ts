import type { Context } from "grammy";
import type { Message, User } from "grammy/types";

import { getUserInfo, updateUserInfo } from "./database-manager";

export async function handleNickname(
  ctx: Context & { from: User },
  newNickname?: string,
): Promise<Message.TextMessage | undefined> {
  const userInfo = getUserInfo(ctx.from.id);
  if (!userInfo) return;

  if (!newNickname) {
    return await ctx.reply(`🗂️ Ваш никнейм — «${userInfo.nickname}»`);
  }

  if (newNickname.length > 20) {
    return await ctx.reply("Ник не может быть длиннее 20ти символов");
  }

  if (newNickname.length < 3) {
    return await ctx.reply("Ник не может быть короче 3х символов");
  }

  updateUserInfo(ctx.from.id, { nickname: newNickname });

  return await ctx.reply("Никнейм изменен");
}
