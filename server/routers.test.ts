import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock db module ──────────────────────────────────────────────────────────
vi.mock("./db", () => {
  const mockEvents = [
    {
      id: 1,
      slug: "team-a-vs-team-b-2026",
      title: "Team Alpha vs Team Beta — T20 Showdown",
      team1: "Team Alpha",
      team2: "Team Beta",
      format: "T20" as const,
      league: "World Cup 2026",
      venue: "National Stadium, Metro City",
      startTime: new Date("2026-03-15T14:00:00Z"),
      maxCapacity: 10000,
      status: "upcoming" as const,
      hosts: JSON.stringify([{ name: "Host One", bio: "Cricket analyst" }]),
      agenda: JSON.stringify([{ time: "1:30 PM", title: "Pre-match discussion" }]),
      visibility: "public" as const,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      slug: "team-c-vs-team-d-2026",
      title: "Team Gamma vs Team Delta — ODI Series",
      team1: "Team Gamma",
      team2: "Team Delta",
      format: "ODI" as const,
      league: "Champions Trophy 2026",
      venue: "Central Cricket Ground, Capital City",
      startTime: new Date("2026-04-01T10:00:00Z"),
      maxCapacity: 5000,
      status: "upcoming" as const,
      hosts: null,
      agenda: null,
      visibility: "private" as const,
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
    getUserByEmail: vi.fn(() => Promise.resolve(null)),
    createUser: vi.fn(() => Promise.resolve(null)),
    updateUserLastSignedIn: vi.fn(() => Promise.resolve()),
    updateUserProfile: vi.fn(() => Promise.resolve()),
    // Expose for test assertions
    _registrations: registrations,
    _waitlistEntries: waitlistEntries,
    _contactMessages: contactMessages,
  };
});

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn((pw: string) => Promise.resolve(`hashed_${pw}`)),
    compare: vi.fn((pw: string, hash: string) => Promise.resolve(hash === `hashed_${pw}`)),
  },
}));

// Mock sdk
vi.mock("./_core/sdk", () => ({
  sdk: {
    createSessionToken: vi.fn(() => Promise.resolve("mock-session-token")),
  },
}));

// ─── Helper: create mock context ─────────────────────────────────────────────
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@example.com",
    name: "Test User",
    password: "hashed_password123",
    loginMethod: "custom",
    role: "user",
    favoriteTeam: "Team Alpha",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
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
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user without password for authenticated users", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.auth.me();

    expect(result).toHaveProperty("name", "Test User");
    expect(result).toHaveProperty("email", "test@example.com");
    // Password should be stripped
    expect(result).not.toHaveProperty("password");
  });
});

describe("auth.signup", () => {
  it("rejects signup with invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.auth.signup({
        name: "Test",
        email: "not-an-email",
        password: "password123",
      })
    ).rejects.toThrow();
  });

  it("rejects signup with short password", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.auth.signup({
        name: "Test",
        email: "test@example.com",
        password: "123",
      })
    ).rejects.toThrow();
  });

  it("rejects signup with short name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.auth.signup({
        name: "T",
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow();
  });
});

describe("auth.login", () => {
  it("rejects login with invalid email format", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.auth.login({
        email: "not-an-email",
        password: "password123",
      })
    ).rejects.toThrow();
  });

  it("rejects login with empty password", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.auth.login({
        email: "test@example.com",
        password: "",
      })
    ).rejects.toThrow();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════════
describe("events.list", () => {
  it("returns only public events with seat counts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const events = await caller.events.list();

    // Only 1 event is public, the other is private
    expect(events).toHaveLength(1);
    expect(events[0]).toHaveProperty("slug", "team-a-vs-team-b-2026");
    expect(events[0]).toHaveProperty("seatsTaken");
    expect(typeof events[0].seatsTaken).toBe("number");
  });
});

describe("events.bySlug", () => {
  it("returns a single event with seat and waitlist counts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const event = await caller.events.bySlug({ slug: "team-a-vs-team-b-2026" });

    expect(event.slug).toBe("team-a-vs-team-b-2026");
    expect(event.team1).toBe("Team Alpha");
    expect(event.team2).toBe("Team Beta");
    expect(event).toHaveProperty("seatsTaken");
    expect(event).toHaveProperty("waitlistCount");
  });

  it("throws NOT_FOUND for unknown slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.events.bySlug({ slug: "nonexistent" })).rejects.toThrow("Event not found");
  });
});

describe("events.create (any authenticated user)", () => {
  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.events.create({
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

  it("allows any authenticated user to create a public event", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.events.create({
      title: "New Event",
      team1: "Team A",
      team2: "Team B",
      format: "ODI",
      league: "Test League",
      venue: "Test Venue",
      startTime: new Date("2026-06-01T10:00:00Z"),
      visibility: "public",
    });

    expect(result).toHaveProperty("id", 3);
    expect(result).toHaveProperty("slug");
    expect(result.slug).toContain("team-a-vs-team-b");
  });

  it("allows creating a private event", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.events.create({
      title: "Private Party",
      team1: "Team X",
      team2: "Team Y",
      format: "T20",
      league: "Friendly",
      venue: "Home",
      startTime: new Date("2026-07-01T10:00:00Z"),
      visibility: "private",
    });

    expect(result).toHaveProperty("id", 3);
    expect(result).toHaveProperty("slug");
  });
});

describe("events.update", () => {
  it("allows the creator to update their event", async () => {
    const caller = appRouter.createCaller(createAuthContext({ id: 1 }));
    const result = await caller.events.update({
      id: 1,
      title: "Updated Title",
    });

    expect(result).toEqual({ success: true });
  });

  it("allows admin to update any event", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.events.update({
      id: 1,
      title: "Admin Updated",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects non-creator non-admin from updating", async () => {
    const caller = appRouter.createCaller(createAuthContext({ id: 999 }));
    await expect(
      caller.events.update({ id: 1, title: "Hacked" })
    ).rejects.toThrow("You can only edit events you created.");
  });
});

describe("events.delete", () => {
  it("allows the creator to delete their event", async () => {
    const caller = appRouter.createCaller(createAuthContext({ id: 1 }));
    const result = await caller.events.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("rejects non-creator non-admin from deleting", async () => {
    const caller = appRouter.createCaller(createAuthContext({ id: 999 }));
    await expect(caller.events.delete({ id: 1 })).rejects.toThrow(
      "You can only delete events you created."
    );
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
    expect(myEvents[0]).toHaveProperty("slug", "team-a-vs-team-b-2026");
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
// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
describe("auth.updateProfile", () => {
  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.auth.updateProfile({ name: "New Name" })
    ).rejects.toThrow();
  });

  it("allows authenticated user to update name", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.auth.updateProfile({ name: "Updated Name" });
    expect(result).toEqual({ success: true });
  });

  it("allows authenticated user to update favorite team", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.auth.updateProfile({ favoriteTeam: "Team Beta" });
    expect(result).toEqual({ success: true });
  });

  it("rejects password change without current password", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.auth.updateProfile({ newPassword: "newpass123" })
    ).rejects.toThrow("Current password is required to change password.");
  });

  it("rejects short new password", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.auth.updateProfile({ currentPassword: "password123", newPassword: "12" })
    ).rejects.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// INVITE CODE (private events)
// ═══════════════════════════════════════════════════════════════════════════════
describe("events.create with invite code", () => {
  it("generates inviteCode for private events", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.events.create({
      title: "Private Match",
      team1: "Team E",
      team2: "Team F",
      format: "T20",
      league: "Continental Cup",
      venue: "Sports Arena",
      startTime: new Date("2026-08-01T10:00:00Z"),
      visibility: "private",
    });

    expect(result).toHaveProperty("inviteCode");
    expect(result.inviteCode).toBeTruthy();
    expect(typeof result.inviteCode).toBe("string");
  });

  it("does not generate inviteCode for public events", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.events.create({
      title: "Public Match",
      team1: "Team G",
      team2: "Team H",
      format: "ODI",
      league: "Bilateral Series",
      venue: "Cricket Oval",
      startTime: new Date("2026-09-01T10:00:00Z"),
      visibility: "public",
    });

    expect(result.inviteCode).toBeNull();
  });
});

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
