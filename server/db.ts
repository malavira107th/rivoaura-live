import { eq, and, sql, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  events, InsertEvent,
  registrations, InsertRegistration,
  waitlist, InsertWaitlistEntry,
  contactMessages, InsertContactMessage,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER HELPERS ───────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── EVENT HELPERS ──────────────────────────────────────────────────────

export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).orderBy(asc(events.startTime));
}

export async function getEventBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(events).values(data);
  return result[0].insertId;
}

export async function updateEvent(id: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(events).where(eq(events.id, id));
}

// ─── REGISTRATION HELPERS ───────────────────────────────────────────────

export async function getRegistrationCount(eventId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(registrations)
    .where(and(eq(registrations.eventId, eventId), eq(registrations.status, "registered")));
  return result[0]?.count ?? 0;
}

export async function getUserRegistration(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(registrations)
    .where(and(
      eq(registrations.userId, userId),
      eq(registrations.eventId, eventId),
      eq(registrations.status, "registered")
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function registerForEvent(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(registrations).values({ userId, eventId, status: "registered" });
}

export async function cancelRegistration(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(registrations)
    .set({ status: "cancelled" })
    .where(and(eq(registrations.userId, userId), eq(registrations.eventId, eventId)));
}

export async function getUserRegistrations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      registration: registrations,
      event: events,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(and(eq(registrations.userId, userId), eq(registrations.status, "registered")))
    .orderBy(asc(events.startTime));
}

// ─── WAITLIST HELPERS ───────────────────────────────────────────────────

export async function getWaitlistCount(eventId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(waitlist)
    .where(and(eq(waitlist.eventId, eventId), eq(waitlist.status, "waiting")));
  return result[0]?.count ?? 0;
}

export async function getUserWaitlistEntry(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(waitlist)
    .where(and(
      eq(waitlist.userId, userId),
      eq(waitlist.eventId, eventId),
      eq(waitlist.status, "waiting")
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function joinWaitlist(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(waitlist).values({ userId, eventId, status: "waiting" });
}

// ─── CONTACT HELPERS ────────────────────────────────────────────────────

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactMessages).values(data);
}
