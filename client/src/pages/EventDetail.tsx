/*
 * EVENT DETAILS PAGE
 * Design: Stadium Noir — dark cinematic, saffron accents
 */
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, MapPin, CalendarPlus, Headphones, Mic2, Shield, AlertTriangle, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCountdown } from "@/hooks/useCountdown";
import { MOCK_EVENTS, CRICKET_ACTION_IMAGE } from "@/lib/data";

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const event = MOCK_EVENTS.find((e) => e.id === params.id);

  if (!event) {
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

  const { days, hours, minutes, seconds } = useCountdown(event.startTime);
  const capacityPercent = (event.seatsTaken / event.maxCapacity) * 100;
  const isFull = event.seatsTaken >= event.maxCapacity;

  const handleRegister = () => {
    if (isFull) {
      toast.info("You've joined the waitlist. We'll notify you if a spot becomes available.");
    } else {
      toast.success(`Success! You're registered for ${event.team1} vs ${event.team2}. We'll remind you before it starts.`);
    }
  };

  const handleCalendar = () => {
    toast.success("Event added to your calendar!");
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border/60 rounded-xl p-6"
              >
                <h3 className="font-display text-lg font-bold mb-5">Today's Watch Party Schedule</h3>
                <div className="space-y-0">
                  {event.agenda.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start relative">
                      {i < event.agenda.length - 1 && (
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

              {/* Hosts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card border border-border/60 rounded-xl p-6"
              >
                <h3 className="font-display text-lg font-bold mb-5">Your Hosts for Today</h3>
                <div className="space-y-4">
                  {event.hosts.map((host) => (
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

              {/* Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card border border-border/60 rounded-xl p-6"
              >
                <h3 className="font-display text-lg font-bold mb-5">How to Participate</h3>
                <div className="space-y-4">
                  {[
                    { icon: Headphones, title: "Listen In", desc: "You join as a listener by default. Enjoy the live commentary and community chat." },
                    { icon: Mic2, title: "Request to Speak", desc: "Want to share your take? Use the 'Request to Speak' button. Our moderators will bring you on stage." },
                    { icon: Shield, title: "Be Respectful", desc: "We have a zero-tolerance policy for abuse, spam, or hate speech. See our full Community Guidelines." },
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
                  className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all mb-3 ${
                    isFull
                      ? "bg-secondary text-secondary-foreground border border-border hover:bg-accent"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  }`}
                >
                  {isFull ? "Join Waitlist" : "Register to Join"}
                </button>

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
