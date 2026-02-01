import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: integer("user_id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  username: text("username"),
  nickname: text("nickname").notNull().default("Игрок"),
});

export const balance = sqliteTable("balance", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.userId, { onDelete: "cascade" }),
  balance: real("balance").notNull().default(10_000_000),
  tomatoes: real("tomatoes").notNull().default(0),
});

export const businesses = sqliteTable("businesses", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.userId, { onDelete: "cascade" }),
  level: integer("level").notNull().default(0),
  lastCollect: integer("last_collect").notNull().default(0),
});

export const tomatoFarm = sqliteTable("tomato_farm", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.userId, { onDelete: "cascade" }),
  level: integer("level").notNull().default(0),
  lastCollect: integer("last_collect").notNull().default(0),
});
