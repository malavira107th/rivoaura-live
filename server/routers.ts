import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sdk } from "./_core/sdk";
import {
  getAllEvents,
  getEventBySlug,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getRegistrationCount,
  getUserRegistration,
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  getWaitlistCount,
  getUserWaitlistEntry,
  joinWaitlist,
  createContactMessage,
  getUserByEmail,
  createUser,
  updateUserLastSignedIn,
} from "./db";
import { TRPCError } from "@trpc/server";

const SALT_ROUNDS = 10;

export const appRouter = router({
  system: systemRouter,

  auth: router({
    /** Get current user (strips password) */
    me: publicProcedure.query(opts => {
      if (!opts.ctx.user) return null;
      const { password, ...safeUser } = opts.ctx.user;
      return safeUser;
    }),

    /** Custom signup with email + password */
    signup: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        favoriteTeam: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if email already exists
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

        // Create user
        const user = await createUser({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          favoriteTeam: input.favoriteTeam,
        });

        if (!user) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create account." });
        }

        // Create session token
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        const { password, ...safeUser } = user;
        return { success: true, user: safeUser };
      }),

    /** Custom login with email + password */
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        }

        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        }

        // Update last signed in
        await updateUserLastSignedIn(user.id);

        // Create session token
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        const { password, ...safeUser } = user;
        return { success: true, user: safeUser };
      }),

    /** Logout — clear session cookie */
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── EVENTS ─────────────────────────────────────────────────────────
  events: router({
    /** List all events (public) */
    list: publicProcedure.query(async () => {
      const allEvents = await getAllEvents();
      const enriched = await Promise.all(
        allEvents.map(async (event) => {
          const seatsTaken = await getRegistrationCount(event.id);
          return { ...event, seatsTaken };
        })
      );
      return enriched;
    }),

    /** Get a single event by slug (public) */
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const event = await getEventBySlug(input.slug);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        const seatsTaken = await getRegistrationCount(event.id);
        const waitlistCount = await getWaitlistCount(event.id);
        return { ...event, seatsTaken, waitlistCount };
      }),

    /** Create a new event — any logged-in user can create */
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        team1: z.string().min(1),
        team2: z.string().min(1),
        format: z.enum(["T20", "ODI", "Test"]),
        league: z.string().min(1),
        venue: z.string().min(1),
        startTime: z.date(),
        maxCapacity: z.number().int().positive().default(10000),
        hosts: z.array(z.object({ name: z.string(), bio: z.string() })).optional(),
        agenda: z.array(z.object({ time: z.string(), title: z.string() })).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Auto-generate slug from team names and timestamp
        const slug = `${input.team1.toLowerCase().replace(/\s+/g, "-")}-vs-${input.team2.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
        const id = await createEvent({
          ...input,
          slug,
          hosts: input.hosts ?? [],
          agenda: input.agenda ?? [],
          createdBy: ctx.user.id,
        });
        return { id, slug };
      }),

    /** Update an event — only the creator or admin can update */
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        team1: z.string().min(1).optional(),
        team2: z.string().min(1).optional(),
        format: z.enum(["T20", "ODI", "Test"]).optional(),
        league: z.string().optional(),
        venue: z.string().optional(),
        startTime: z.date().optional(),
        maxCapacity: z.number().int().positive().optional(),
        status: z.enum(["upcoming", "live", "completed", "cancelled"]).optional(),
        hosts: z.array(z.object({ name: z.string(), bio: z.string() })).optional(),
        agenda: z.array(z.object({ time: z.string(), title: z.string() })).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const event = await getEventById(input.id);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        if (event.createdBy !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "You can only edit events you created." });
        }
        const { id, ...data } = input;
        await updateEvent(id, data);
        return { success: true };
      }),

    /** Delete an event — only the creator or admin */
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const event = await getEventById(input.id);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        if (event.createdBy !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "You can only delete events you created." });
        }
        await deleteEvent(input.id);
        return { success: true };
      }),
  }),

  // ─── REGISTRATIONS ──────────────────────────────────────────────────
  registration: router({
    /** Check if current user is registered for an event */
    status: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input, ctx }) => {
        const reg = await getUserRegistration(ctx.user.id, input.eventId);
        const waitEntry = await getUserWaitlistEntry(ctx.user.id, input.eventId);
        return {
          isRegistered: !!reg,
          isOnWaitlist: !!waitEntry,
        };
      }),

    /** Register for an event */
    register: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const existing = await getUserRegistration(ctx.user.id, input.eventId);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "You are already registered for this event." });
        }
        const event = await getEventById(input.eventId);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        const seatsTaken = await getRegistrationCount(input.eventId);
        if (seatsTaken >= event.maxCapacity) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Event is full. Please join the waitlist." });
        }
        await registerForEvent(ctx.user.id, input.eventId);
        return { success: true, message: "You are registered!" };
      }),

    /** Cancel registration */
    cancel: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await cancelRegistration(ctx.user.id, input.eventId);
        return { success: true };
      }),

    /** Get current user's registrations */
    myEvents: protectedProcedure.query(async ({ ctx }) => {
      const regs = await getUserRegistrations(ctx.user.id);
      return regs.map((r) => ({
        ...r.event,
        registeredAt: r.registration.registeredAt,
      }));
    }),
  }),

  // ─── WAITLIST ───────────────────────────────────────────────────────
  waitlist: router({
    join: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const existing = await getUserWaitlistEntry(ctx.user.id, input.eventId);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "You are already on the waitlist." });
        }
        await joinWaitlist(ctx.user.id, input.eventId);
        return { success: true, message: "You've joined the waitlist!" };
      }),
  }),

  // ─── CONTACT ────────────────────────────────────────────────────────
  contact: router({
    send: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await createContactMessage(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
