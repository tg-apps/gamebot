import type { User } from "grammy/types";

import { db, schema } from "#db";
import { eq } from "drizzle-orm";

export async function getUserBalance(userId: number) {
  const data = await db
    .select()
    .from(schema.balance)
    .where(eq(schema.balance.userId, userId));
  return data[0] ?? null;
}

export async function updateUserBalance(
  userId: number,
  userBalance: { balance?: number; tomatoes?: number },
) {
  const data = await db
    .update(schema.balance)
    .set(userBalance)
    .where(eq(schema.balance.userId, userId))
    .returning();
  return data[0] ?? null;
}

export async function getBusinessInfo(userId: number) {
  const data = await db
    .select()
    .from(schema.businesses)
    .where(eq(schema.businesses.userId, userId));
  return data[0] ?? null;
}

export async function updateBusinessInfo(
  userId: number,
  businessInfo: { lastCollect?: number; level?: number },
) {
  const data = await db
    .update(schema.businesses)
    .set(businessInfo)
    .where(eq(schema.businesses.userId, userId))
    .returning();
  return data[0] ?? null;
}

export async function getTomatoFarmInfo(userId: number) {
  const data = await db
    .select()
    .from(schema.tomatoFarm)
    .where(eq(schema.tomatoFarm.userId, userId));
  return data[0] ?? null;
}

export async function updateTomatoFarmInfo(
  userId: number,
  farmInfo: { lastCollect?: number; level?: number },
) {
  const data = await db
    .update(schema.tomatoFarm)
    .set(farmInfo)
    .where(eq(schema.tomatoFarm.userId, userId))
    .returning();
  return data[0] ?? null;
}

export async function getUserInfo(userId: number) {
  const data = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.userId, userId));
  return data[0] ?? null;
}

export async function updateUserInfo(
  userId: number,
  userInfo: {
    firstName?: string;
    lastName?: string;
    username?: string;
    nickname?: string;
  },
) {
  const data = await db
    .update(schema.users)
    .set(userInfo)
    .where(eq(schema.users.userId, userId))
    .returning();
  return data[0] ?? null;
}

export async function createNewUser(user: User) {
  const existingUser = await getUserInfo(user.id);

  if (existingUser) {
    return existingUser;
  }

  await db.insert(schema.users).values({
    userId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  });

  await db.insert(schema.balance).values({ userId: user.id });
  await db.insert(schema.businesses).values({ userId: user.id });
  await db.insert(schema.tomatoFarm).values({ userId: user.id });
}
