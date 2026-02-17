import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table — custom email/password auth.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique identifier — we use email as the primary lookup */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** bcrypt-hashed password */
  password: varchar("password", { length: 256 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  favoriteTeam: varchar("favoriteTeam", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Events (Watch Parties) table.
 * Stores all cricket watch party events with match details.
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  team1: varchar("team1", { length: 128 }).notNull(),
  team2: varchar("team2", { length: 128 }).notNull(),
  format: mysqlEnum("format", ["T20", "ODI", "Test"]).notNull(),
  league: varchar("league", { length: 64 }).notNull(),
  venue: varchar("venue", { length: 256 }).notNull(),
  /** Stored as UTC timestamp */
  startTime: timestamp("startTime").notNull(),
  maxCapacity: int("maxCapacity").notNull().default(10000),
  status: mysqlEnum("status", ["upcoming", "live", "completed", "cancelled"]).default("upcoming").notNull(),
  /** JSON array of host objects: [{name, bio}] */
  hosts: json("hosts").$type<{ name: string; bio: string }[]>(),
  /** JSON array of agenda items: [{time, title}] */
  agenda: json("agenda").$type<{ time: string; title: string }[]>(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Registrations table.
 */
export const registrations = mysqlTable("registrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  status: mysqlEnum("status", ["registered", "cancelled"]).default("registered").notNull(),
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

/**
 * Waitlist table.
 */
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  status: mysqlEnum("status", ["waiting", "notified", "expired"]).default("waiting").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = typeof waitlist.$inferInsert;

/**
 * Contact messages table.
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
