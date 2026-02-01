import type { User } from "grammy/types";

import { getUserInfo, createNewUser, updateUserInfo } from "./database-manager";

export async function handleMessage(user: User): Promise<void> {
  const userInfo = await getUserInfo(user.id);

  if (!userInfo) {
    await createNewUser(user);
    return;
  }

  await updateUserInfo(user.id, {
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  });
}
