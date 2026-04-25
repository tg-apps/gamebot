import type { User } from "grammy/types";

import { createNewOrUpdateUser } from "./database-manager";

export async function handleMessage(user: User): Promise<void> {
  await createNewOrUpdateUser(user);
}
