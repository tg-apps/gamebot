import type { User } from "grammy/types";

import { db, schema } from "#db";
import { eq } from "drizzle-orm";

export function getUserBalance(userId: number) {
  const data = db
    .select()
    .from(schema.balance)
    .where(eq(schema.balance.userId, userId))
    .get();
  return data;
}

export function updateUserBalance(
  userId: number,
  userBalance: { balance?: number; tomatoes?: number },
) {
  const data = db
    .update(schema.balance)
    .set(userBalance)
    .where(eq(schema.balance.userId, userId))
    .returning()
    .get();
  return data;
}

export function getBusinessInfo(userId: number) {
  const data = db
    .select()
    .from(schema.businesses)
    .where(eq(schema.businesses.userId, userId))
    .get();
  return data;
}

export function updateBusinessInfo(
  userId: number,
  businessInfo: { lastCollect?: number; level?: number },
) {
  const data = db
    .update(schema.businesses)
    .set(businessInfo)
    .where(eq(schema.businesses.userId, userId))
    .returning()
    .get();
  return data;
}

export function getTomatoFarmInfo(userId: number) {
  const data = db
    .select()
    .from(schema.tomatoFarm)
    .where(eq(schema.tomatoFarm.userId, userId))
    .get();
  return data;
}

export function updateTomatoFarmInfo(
  userId: number,
  farmInfo: { lastCollect?: number; level?: number },
) {
  const data = db
    .update(schema.tomatoFarm)
    .set(farmInfo)
    .where(eq(schema.tomatoFarm.userId, userId))
    .returning()
    .get();
  return data;
}

export function getUserInfo(userId: number) {
  const data = db
    .select()
    .from(schema.users)
    .where(eq(schema.users.userId, userId))
    .get();
  return data;
}

export function updateUserInfo(
  userId: number,
  userInfo: {
    firstName?: string;
    lastName?: string;
    username?: string;
    nickname?: string;
  },
) {
  const data = db
    .update(schema.users)
    .set(userInfo)
    .where(eq(schema.users.userId, userId))
    .returning()
    .get();
  return data;
}

export async function createNewUser(user: User) {
  const existingUser = getUserInfo(user.id);

  if (existingUser) {
    return existingUser;
  }

  await db
    .insert(schema.users)
    .values({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
    })
    .onConflictDoNothing();

  await db
    .insert(schema.balance)
    .values({ userId: user.id })
    .onConflictDoNothing();
  await db
    .insert(schema.businesses)
    .values({ userId: user.id })
    .onConflictDoNothing();
  await db
    .insert(schema.tomatoFarm)
    .values({ userId: user.id })
    .onConflictDoNothing();
}
