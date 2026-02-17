import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock db module ──────────────────────────────────────────────────────────
vi.mock("./db", () => {
  const mockEvents = [
    {
      id: 1,
      slug: "ind-vs-aus-2026",
      title: "India vs Australia — T20 Showdown",
      team1: "India",
      team2: "Australia",
      format: "T20" as const,
      league: "ICC T20 World Cup 2026",
      venue: "Wankhede Stadium, Mumbai",
      startTime: new Date("2026-03-15T14:00:00Z"),
      maxCapacity: 10000,
      status: "upcoming" as const,
      hosts: JSON.stringify([{ name: "Rahul", bio: "Cricket analyst" }]),
      agenda: JSON.stringify([{ time: "1:30 PM", title: "Pre-match discussion" }]),
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      slug: "eng-vs-pak-2026",
      title: "England vs Pakistan — ODI Series",
      team1: "England",
      team2: "Pakistan",
      format: "ODI" as const,
      league: "ICC Champions Trophy 2026",
      venue: "Lord's Cricket Ground, London",
      startTime: new Date("2026-04-01T10:00:00Z"),
      maxCapacity: 5000,
      status: "upcoming" as const,
      hosts: null,
      agenda: null,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const registrations: { userId: number; eventId: number; registeredAt: Date }[] = [];
  const waitlistEntries: { userId: number; eventId: number; joinedAt: Date }[] = [];
  const contactMessages: { name: string; email: string; message: string }[] = [];

  return {
    getAllEvents: vi.fn(() => Promise.resolve(mockEvents)),
    getEventBySlug: vi.fn((slug: string) =>
      Promise.resolve(mockEvents.find((e) => e.slug === slug) ?? null)
    ),
    getEventById: vi.fn((id: number) =>
      Promise.resolve(mockEvents.find((e) => e.id === id) ?? null)
    ),
    createEvent: vi.fn(() => Promise.resolve(3)),
    updateEvent: vi.fn(() => Promise.resolve()),
    deleteEvent: vi.fn(() => Promise.resolve()),
    getRegistrationCount: vi.fn((eventId: number) =>
      Promise.resolve(registrations.filter((r) => r.eventId === eventId).length)
    ),
    getUserRegistration: vi.fn((userId: number, eventId: number) =>
      Promise.resolve(registrations.find((r) => r.userId === userId && r.eventId === eventId) ?? null)
    ),
    registerForEvent: vi.fn((userId: number, eventId: number) => {
      registrations.push({ userId, eventId, registeredAt: new Date() });
      return Promise.resolve();
    }),
    cancelRegistration: vi.fn((userId: number, eventId: number) => {
      const idx = registrations.findIndex((r) => r.userId === userId && r.eventId === eventId);
      if (idx >= 0) registrations.splice(idx, 1);
      return Promise.resolve();
    }),
    getUserRegistrations: vi.fn((userId: number) =>
      Promise.resolve(
        registrations
          .filter((r) => r.userId === userId)
          .map((r) => ({
            registration: r,
            event: mockEvents.find((e) => e.id === r.eventId)!,
          }))
      )
    ),
    getWaitlistCount: vi.fn((eventId: number) =>
      Promise.resolve(waitlistEntries.filter((w) => w.eventId === eventId).length)
    ),
    getUserWaitlistEntry: vi.fn((userId: number, eventId: number) =>
      Promise.resolve(waitlistEntries.find((w) => w.userId === userId && w.eventId === eventId) ?? null)
    ),
    joinWaitlist: vi.fn((userId: number, eventId: number) => {
      waitlistEntries.push({ userId, eventId, joinedAt: new Date() });
      return Promise.resolve();
    }),
    createContactMessage: vi.fn((data: { name: string; email: string; message: string }) => {
      contactMessages.push(data);
      return Promise.resolve();
    }),
    // Expose for test assertions
    _registrations: registrations,
    _waitlistEntries: waitlistEntries,
    _contactMessages: contactMessages,
  };
});

// ─── Helper: create mock context ─────────────────────────────────────────────
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createAuthContext({ role: "admin", id: 99, openId: "admin-001" });
}

// ─── Reset mocks before each test ────────────────────────────────────────────
beforeEach(async () => {
  const db = await import("./db");
  (db as any)._registrations.length = 0;
  (db as any)._waitlistEntries.length = 0;
  (db as any)._contactMessages.length = 0;
  vi.clearAllMocks();
});

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════════
describe("events.list", () => {
  it("returns all events with seat counts (public)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const events = await caller.events.list();

    expect(events).toHaveLength(2);
    expect(events[0]).toHaveProperty("slug", "ind-vs-aus-2026");
    expect(events[0]).toHaveProperty("seatsTaken");
    expect(typeof events[0].seatsTaken).toBe("number");
  });
});

describe("events.bySlug", () => {
  it("returns a single event with seat and waitlist counts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const event = await caller.events.bySlug({ slug: "ind-vs-aus-2026" });

    expect(event.slug).toBe("ind-vs-aus-2026");
    expect(event.team1).toBe("India");
    expect(event.team2).toBe("Australia");
    expect(event).toHaveProperty("seatsTaken");
    expect(event).toHaveProperty("waitlistCount");
  });

  it("throws NOT_FOUND for unknown slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.events.bySlug({ slug: "nonexistent" })).rejects.toThrow("Event not found");
  });
});

describe("events.create (admin only)", () => {
  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.events.create({
        slug: "test-event",
        title: "Test",
        team1: "A",
        team2: "B",
        format: "T20",
        league: "Test League",
        venue: "Test Venue",
        startTime: new Date(),
      })
    ).rejects.toThrow();
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.events.create({
        slug: "test-event",
        title: "Test",
        team1: "A",
        team2: "B",
        format: "T20",
        league: "Test League",
        venue: "Test Venue",
        startTime: new Date(),
      })
    ).rejects.toThrow();
  });

  it("allows admin to create an event", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.events.create({
      slug: "new-event",
      title: "New Event",
      team1: "Team A",
      team2: "Team B",
      format: "ODI",
      league: "Test League",
      venue: "Test Venue",
      startTime: new Date("2026-06-01T10:00:00Z"),
    });

    expect(result).toHaveProperty("id", 3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════
describe("registration.register", () => {
  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.registration.register({ eventId: 1 })).rejects.toThrow();
  });

  it("allows authenticated user to register for an event", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.registration.register({ eventId: 1 });

    expect(result).toEqual({ success: true, message: "You are registered!" });
  });

  it("prevents duplicate registration", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.registration.register({ eventId: 1 });
    await expect(caller.registration.register({ eventId: 1 })).rejects.toThrow(
      "You are already registered for this event."
    );
  });
});

describe("registration.cancel", () => {
  it("allows user to cancel their registration", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.registration.register({ eventId: 1 });
    const result = await caller.registration.cancel({ eventId: 1 });

    expect(result).toEqual({ success: true });
  });
});

describe("registration.myEvents", () => {
  it("returns the user's registered events", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.registration.register({ eventId: 1 });
    const myEvents = await caller.registration.myEvents();

    expect(myEvents).toHaveLength(1);
    expect(myEvents[0]).toHaveProperty("slug", "ind-vs-aus-2026");
    expect(myEvents[0]).toHaveProperty("registeredAt");
  });

  it("returns empty array when user has no registrations", async () => {
    const caller = appRouter.createCaller(createAuthContext({ id: 999 }));
    const myEvents = await caller.registration.myEvents();

    expect(myEvents).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// WAITLIST
// ═══════════════════════════════════════════════════════════════════════════════
describe("waitlist.join", () => {
  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.join({ eventId: 1 })).rejects.toThrow();
  });

  it("allows authenticated user to join the waitlist", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.waitlist.join({ eventId: 1 });

    expect(result).toEqual({ success: true, message: "You've joined the waitlist!" });
  });

  it("prevents duplicate waitlist entry", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.waitlist.join({ eventId: 1 });
    await expect(caller.waitlist.join({ eventId: 1 })).rejects.toThrow(
      "You are already on the waitlist."
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════════════════════
describe("contact.send", () => {
  it("accepts a valid contact message (public)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.send({
      name: "John Doe",
      email: "john@example.com",
      message: "Great platform!",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.send({
        name: "John",
        email: "not-an-email",
        message: "Hello",
      })
    ).rejects.toThrow();
  });

  it("rejects empty fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.send({
        name: "",
        email: "john@example.com",
        message: "Hello",
      })
    ).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.auth.me();

    expect(result).toHaveProperty("openId", "test-user-001");
    expect(result).toHaveProperty("name", "Test User");
  });
});
