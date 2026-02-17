import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
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
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
      // Enrich each event with its registration count
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

    /** Create a new event (admin only) */
    create: adminProcedure
      .input(z.object({
        slug: z.string().min(1),
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
        const id = await createEvent({
          ...input,
          hosts: input.hosts ?? [],
          agenda: input.agenda ?? [],
          createdBy: ctx.user.id,
        });
        return { id };
      }),

    /** Update an event (admin only) */
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
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
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateEvent(id, data);
        return { success: true };
      }),

    /** Delete an event (admin only) */
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
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
        // Check if already registered
        const existing = await getUserRegistration(ctx.user.id, input.eventId);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "You are already registered for this event." });
        }

        // Check capacity
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
