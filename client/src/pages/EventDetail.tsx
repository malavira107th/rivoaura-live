/*
 * EVENT DETAILS PAGE
 * Design: Stadium Noir — dark cinematic, saffron accents
 */
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, MapPin, CalendarPlus, Headphones, Mic2, Shield, AlertTriangle, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCountdown } from "@/hooks/useCountdown";
import { CRICKET_ACTION_IMAGE } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";


export default function EventDetail() {
  const params = useParams<{ slug: string }>();
  const { data: event, isLoading, error } = trpc.events.bySlug.useQuery({ slug: params.slug ?? "" });
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const registerMutation = trpc.registration.register.useMutation({
    onSuccess: () => {
      toast.success(`You're registered! We'll remind you before it starts.`);
      utils.events.bySlug.invalidate({ slug: params.slug ?? "" });
    },
    onError: (err: { message: string }) => {
      if (err.message.includes("login")) {
        toast.error("Please sign in to register for events.");
      } else {
        toast.error(err.message);
      }
    },
  });

  const waitlistMutation = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      toast.info("You've joined the waitlist. We'll notify you if a spot becomes available.");
      utils.events.bySlug.invalidate({ slug: params.slug ?? "" });
    },
    onError: (err) => {
      if (err.message.includes("login")) {
        toast.error("Please sign in to join the waitlist.");
      } else {
        toast.error(err.message);
      }
    },
  });

  if (isLoading) {
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

  if (!event || error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link href="/events" className="text-primary font-semibold hover:underline">Back to Events</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return <EventDetailContent event={event} isAuthenticated={isAuthenticated} registerMutation={registerMutation} waitlistMutation={waitlistMutation} />;
}

function EventDetailContent({ event, isAuthenticated, registerMutation, waitlistMutation }: {
  event: {
    id: number;
    slug: string;
    title: string;
    team1: string;
    team2: string;
    format: string;
    league: string;
    venue: string;
    startTime: Date;
    maxCapacity: number;
    seatsTaken: number;
    status: string;
    hosts: { name: string; bio: string }[] | null;
    agenda: { time: string; title: string }[] | null;
  };
  isAuthenticated: boolean;
  registerMutation: { mutate: (data: { eventId: number }) => void; isPending: boolean };
  waitlistMutation: { mutate: (data: { eventId: number }) => void; isPending: boolean };
}) {
  const startTimeStr = event.startTime instanceof Date ? event.startTime.toISOString() : String(event.startTime);
  const { days, hours, minutes, seconds } = useCountdown(startTimeStr);
  const capacityPercent = (event.seatsTaken / event.maxCapacity) * 100;
  const isFull = event.seatsTaken >= event.maxCapacity;

  const handleRegister = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (isFull) {
      waitlistMutation.mutate({ eventId: event.id });
    } else {
      registerMutation.mutate({ eventId: event.id });
    }
  };

  const handleCalendar = () => {
    const start = new Date(event.startTime);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Brand Pixel Studio: ${event.team1} vs ${event.team2}`)}&dates=${formatDate(start)}/${formatDate(end)}&details=${encodeURIComponent(`Join the live audio watch party on Brand Pixel Studio!`)}&location=${encodeURIComponent(event.venue)}`;
    window.open(url, "_blank");
    toast.success("Opening Google Calendar...");
  };

  const startDate = new Date(event.startTime);
  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const hosts = Array.isArray(event.hosts) ? event.hosts : [];
  const agenda = Array.isArray(event.agenda) ? event.agenda : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CRICKET_ACTION_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
        </div>

        <div className="container relative z-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded border border-primary/30 bg-primary/10 text-primary">
                {event.format}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded border border-border text-muted-foreground">
                {event.league}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
              {event.team1} <span className="text-muted-foreground">vs</span> {event.team2}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{dateStr} at {timeStr} IST</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column — Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card border border-border/60 rounded-xl p-6"
              >
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Starts In</h3>
                <div className="flex gap-4 sm:gap-6">
                  {[
                    { val: days, label: "Days" },
                    { val: hours, label: "Hours" },
                    { val: minutes, label: "Minutes" },
                    { val: seconds, label: "Seconds" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="font-mono-stat text-3xl sm:text-4xl font-bold text-primary">
                        {String(item.val).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Agenda */}
              {agenda.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card border border-border/60 rounded-xl p-6"
                >
                  <h3 className="font-display text-lg font-bold mb-5">Watch Party Schedule</h3>
                  <div className="space-y-0">
                    {agenda.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start relative">
                        {i < agenda.length - 1 && (
                          <div className="absolute left-[7px] top-6 bottom-0 w-px bg-border" />
                        )}
                        <div className="w-4 h-4 rounded-full border-2 border-primary bg-background shrink-0 mt-0.5 relative z-10" />
                        <div className="pb-6">
                          <p className="font-mono-stat text-xs text-primary font-bold">{item.time}</p>
                          <p className="text-sm text-foreground font-medium mt-0.5">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Hosts */}
              {hosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card border border-border/60 rounded-xl p-6"
                >
                  <h3 className="font-display text-lg font-bold mb-5">Your Hosts</h3>
                  <div className="space-y-4">
                    {hosts.map((host) => (
                      <div key={host.name} className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{host.name}</p>
                          <p className="text-sm text-muted-foreground">{host.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card border border-border/60 rounded-xl p-6"
              >
                <h3 className="font-display text-lg font-bold mb-5">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { icon: Headphones, title: "Join the Room", desc: "Once registered, you'll get access to the live audio + chat room when the party starts. Join as a listener by default." },
                    { icon: Mic2, title: "Request to Speak", desc: "Want to share your take? Use the 'Request to Speak' button. The host will bring you on stage." },
                    { icon: Shield, title: "Host's Rules Apply", desc: "The host moderates this party. Be respectful, follow their rules, and enjoy the game together." },
                  ].map((rule) => (
                    <div key={rule.title} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <rule.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{rule.title}</p>
                        <p className="text-sm text-muted-foreground">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column — Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-card border border-border/60 rounded-xl p-6 sticky top-24"
              >
                {/* Capacity */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Seats Taken</span>
                    </div>
                    <span className="font-mono-stat text-sm font-bold text-foreground">
                      {event.seatsTaken.toLocaleString()} / {event.maxCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isFull ? "bg-destructive" : "bg-primary"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPercent}%` }}
                      transition={{ duration: 1.2 }}
                    />
                  </div>
                  {isFull && (
                    <p className="text-xs text-destructive mt-2 font-medium">This event is now full.</p>
                  )}
                </div>

                {/* CTA Buttons */}
                <button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending || waitlistMutation.isPending}
                  className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all mb-3 disabled:opacity-50 ${
                    isFull
                      ? "bg-secondary text-secondary-foreground border border-border hover:bg-accent"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  }`}
                >
                  {registerMutation.isPending || waitlistMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : isFull ? (
                    "Join Waitlist"
                  ) : !isAuthenticated ? (
                    "Sign In to Join"
                  ) : (
                    "Join This Party"
                  )}
                </button>

                {/* Enter Room Button */}
                {isAuthenticated && (
                  <Link
                    href={`/room/${event.slug}`}
                    className="w-full py-3 rounded-lg font-medium text-sm border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2 mb-3"
                  >
                    <Headphones className="w-4 h-4" />
                    Enter Live Room
                  </Link>
                )}

                <button
                  onClick={handleCalendar}
                  className="w-full py-3 rounded-lg font-medium text-sm border border-border bg-card text-foreground hover:bg-accent transition-all flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Add to Calendar
                </button>

                {/* Disclaimer */}
                <div className="mt-5 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-primary/80">Important:</strong> This is a community discussion platform. Match streaming is not provided. Please watch the live game on your official broadcaster.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
