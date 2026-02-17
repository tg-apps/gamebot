import { Database } from "bun:sqlite";

import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const sqlite = new Database("database.db");

// Enable foreign key support (required for ON DELETE CASCADE to work)
sqlite.run("PRAGMA foreign_keys = ON;");

// Create tables if they don't exist
sqlite.run(`
  CREATE TABLE IF NOT EXISTS "users" (
    "user_id" INTEGER PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "nickname" TEXT
  ) WITHOUT ROWID
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS "balance" (
    "user_id" INTEGER PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE,
    "balance" REAL NOT NULL DEFAULT 0,
    "tomatoes" REAL NOT NULL DEFAULT 0
  ) WITHOUT ROWID
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS "businesses" (
    "user_id" INTEGER PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE,
    "level" INTEGER NOT NULL DEFAULT 0,
    "last_collect" INTEGER NOT NULL DEFAULT 0
  ) WITHOUT ROWID
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS "tomato_farm" (
    "user_id" INTEGER PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE,
    "level" INTEGER NOT NULL DEFAULT 0,
    "last_collect" INTEGER NOT NULL DEFAULT 0
  ) WITHOUT ROWID
`);

const db = drizzle(sqlite, { schema });

export { db, schema };
