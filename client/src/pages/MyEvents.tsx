/*
 * MY EVENTS (User Dashboard) PAGE
 * Design: Stadium Noir
 */
import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Loader2, Clock, MapPin, XCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";

import { trpc } from "@/lib/trpc";

export default function MyEvents() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: myEvents, isLoading } = trpc.registration.myEvents.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const utils = trpc.useUtils();

  const cancelMutation = trpc.registration.cancel.useMutation({
    onSuccess: () => {
      toast.success("Registration cancelled.");
      utils.registration.myEvents.invalidate();
    },
    onError: (err: { message: string }) => {
      toast.error(err.message);
    },
  });

  const upcomingEvents = useMemo(() => {
    if (!myEvents) return [];
    return myEvents.filter((e) => new Date(e.startTime) > new Date());
  }, [myEvents]);

  const pastEvents = useMemo(() => {
    if (!myEvents) return [];
    return myEvents.filter((e) => new Date(e.startTime) <= new Date());
  }, [myEvents]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">Please sign in to view your registered events.</p>
            <a
              href="/login?returnTo=/my-events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
            >
              Sign In
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">MY EVENTS</h1>
            <p className="text-muted-foreground mb-8">Welcome back! Here are your registered watch parties.</p>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <>
                {/* Upcoming Events */}
                <div className="mb-10">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    Upcoming ({upcomingEvents.length})
                  </h2>

                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-card border border-border/60 rounded-xl p-5 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                                  {event.format}
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border border-border text-muted-foreground">
                                  {event.league}
                                </span>
                              </div>
                              <Link href={`/events/${event.slug}`}>
                                <h3 className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                                  {event.team1} vs {event.team2}
                                </h3>
                              </Link>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{event.venue}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(event.startTime).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} at {new Date(event.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => cancelMutation.mutate({ eventId: event.id })}
                              disabled={cancelMutation.isPending}
                              className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Cancel registration"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-card/50 border border-border/40 rounded-xl">
                      <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm mb-4">No upcoming events. Time to explore!</p>
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
                      >
                        Explore Events <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl font-bold mb-4 text-muted-foreground">
                      Past Events ({pastEvents.length})
                    </h2>
                    <div className="space-y-3">
                      {pastEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-card/50 border border-border/40 rounded-xl p-4 opacity-70"
                        >
                          <h3 className="font-display text-base font-bold text-foreground">
                            {event.team1} vs {event.team2}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.startTime).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
