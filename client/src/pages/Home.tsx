/*
 * HOME PAGE — Rivoaura Live
 * Content: User-hosted watch parties with built-in audio & chat rooms
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, UserPlus, Search, Shield, Mic2, Quote, Loader2, Plus, Users, Lock, Globe, Settings, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { HERO_IMAGE, COMMUNITY_IMAGE, AUDIO_ROOM_IMAGE, HOW_IT_WORKS_BG, TESTIMONIALS } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { data: events, isLoading } = trpc.events.list.useQuery();
  const { isAuthenticated } = useAuth();
  const upcomingEvents = (events ?? []).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-start overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Cricket stadium at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT — Copy */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary tracking-wide uppercase">Host or Join — It's Free</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
              >
                HOST YOUR OWN
                <br />
                WATCH PARTY.
                <br />
                <span className="text-gradient-saffron">INVITE YOUR CREW.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
              >
                Create a watch party for any cricket match. Set the capacity, control who joins, and experience every ball together with built-in live audio and chat rooms. Your party, your rules.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href={isAuthenticated ? "/events/create" : "/login"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Host a Watch Party
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-border bg-card/50 text-foreground font-semibold text-sm hover:bg-card transition-all"
                >
                  Browse Public Parties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Compliance Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-10 p-4 rounded-lg border border-border/60 bg-card/50"
              >
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important:</strong> Rivoaura Live is a community platform for live discussion during cricket matches. Match viewing requires your own official broadcast subscription (TV, streaming service, etc.). We do not provide live match streams. By using this platform, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. For support, contact{" "}
                  <a href="mailto:support@rivoauralive.com" className="text-primary hover:underline">support@rivoauralive.com</a>.
                </p>
              </motion.div>
            </div>

            {/* RIGHT — Upcoming Watch Parties (Real Data) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-primary/8 rounded-3xl blur-2xl" />

                <div className="relative space-y-3">
                  {/* Section Label */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Upcoming Parties</span>
                    </div>
                    <Link href="/events" className="text-[11px] text-muted-foreground hover:text-primary transition-colors">
                      View all →
                    </Link>
                  </div>

                  {/* Real Event Cards from DB */}
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-xl p-4 animate-pulse">
                          <div className="h-4 bg-secondary rounded w-3/4 mb-3" />
                          <div className="h-3 bg-secondary rounded w-1/2 mb-2" />
                          <div className="h-2 bg-secondary rounded w-full" />
                        </div>
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, i) => {
                      const capacityPercent = (event.seatsTaken / event.maxCapacity) * 100;
                      const isFull = event.seatsTaken >= event.maxCapacity;
                      const startDate = new Date(event.startTime);
                      const now = new Date();
                      const diffMs = startDate.getTime() - now.getTime();
                      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
                      const diffHours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                      const eventLink = event.slug ? `/events/${event.slug}` : `/events/${event.id}`;

                      const formatColors: Record<string, string> = {
                        T20: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                        ODI: "text-blue-400 border-blue-500/30 bg-blue-500/10",
                        Test: "text-orange-400 border-orange-500/30 bg-orange-500/10",
                      };

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
                        >
                          <Link href={eventLink}>
                            <div className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  {/* Format + League badges */}
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${formatColors[event.format] || 'text-muted-foreground border-border'}`}>
                                      {event.format}
                                    </span>
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                                      {event.league}
                                    </span>
                                  </div>

                                  {/* Match title */}
                                  <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                    {event.team1} vs {event.team2}
                                  </h4>

                                  {/* Venue */}
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="w-2.5 h-2.5 text-muted-foreground/60" />
                                    <span className="text-[10px] text-muted-foreground truncate">{event.venue}</span>
                                  </div>
                                </div>

                                {/* Countdown badge */}
                                <div className="shrink-0 text-right">
                                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5">
                                    <p className="font-mono-stat text-sm font-bold text-primary leading-none">
                                      {diffDays > 0 ? `${diffDays}d ${diffHours}h` : `${diffHours}h`}
                                    </p>
                                    <p className="text-[8px] text-primary/60 uppercase tracking-wider mt-0.5">to go</p>
                                  </div>
                                </div>
                              </div>

                              {/* Capacity bar */}
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-2.5 h-2.5 text-muted-foreground/60" />
                                    <span className="text-[10px] text-muted-foreground">
                                      {event.seatsTaken} / {event.maxCapacity} fans
                                    </span>
                                  </div>
                                  {isFull ? (
                                    <span className="text-[9px] font-semibold text-red-400">Full — Waitlist</span>
                                  ) : (
                                    <span className="text-[9px] font-semibold text-primary">Join →</span>
                                  )}
                                </div>
                                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-primary to-amber-400'}`}
                                    style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })
                  ) : (
                    /* Empty state — no events yet */
                    <div className="bg-card/70 backdrop-blur-sm border border-dashed border-border/60 rounded-xl p-6 text-center">
                      <Headphones className="w-8 h-8 text-primary/40 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-foreground mb-1">No parties yet</p>
                      <p className="text-xs text-muted-foreground mb-3">Be the first to host a watch party!</p>
                      <Link
                        href={isAuthenticated ? "/events/create" : "/login"}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        Create Party
                      </Link>
                    </div>
                  )}

                  {/* Platform stats bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-lg px-4 py-2.5 flex items-center justify-between"
                  >
                    <div className="text-center">
                      <p className="font-mono-stat text-sm font-bold text-primary">{events?.length ?? 0}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Parties</p>
                    </div>
                    <div className="w-px h-6 bg-border/40" />
                    <div className="text-center">
                      <p className="font-mono-stat text-sm font-bold text-foreground">
                        {(events ?? []).reduce((sum, e) => sum + e.seatsTaken, 0)}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Fans Joined</p>
                    </div>
                    <div className="w-px h-6 bg-border/40" />
                    <div className="text-center">
                      <p className="font-mono-stat text-sm font-bold text-foreground">100%</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Free</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HOW_IT_WORKS_BG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              HOW IT WORKS
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Whether you want to host your own party or join someone else's — it takes less than a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* HOST PATH */}
            <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-xl p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Plus className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">I Want to Host</span>
              </div>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Create Your Party", desc: "Pick the match, set your capacity (10 friends or 10,000 fans), and write your party rules." },
                  { step: "02", title: "Choose Public or Private", desc: "Public parties appear on the listing for anyone. Private parties are invite-only via a shareable link." },
                  { step: "03", title: "Go Live & Moderate", desc: "When the match starts, your audio room goes live. Control who speaks, mute or remove anyone. It's your party." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="font-display text-2xl font-bold text-primary/30 shrink-0 w-8">{item.step}</div>
                    <div>
                      <h4 className="font-display text-sm font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JOIN PATH */}
            <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 border border-border/60 mb-6">
                <Users className="w-3.5 h-3.5 text-foreground" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">I Want to Join</span>
              </div>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Browse Public Parties", desc: "Explore upcoming watch parties on the listing page. Filter by match, format, or league." },
                  { step: "02", title: "Register & Get Ready", desc: "Secure your spot with one click. If it's full, join the waitlist — you'll be notified when a spot opens." },
                  { step: "03", title: "Join the Room", desc: "When the match starts, join the live audio room. Listen in, chat, or request to speak." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="font-display text-2xl font-bold text-muted-foreground/30 shrink-0 w-8">{item.step}</div>
                    <div>
                      <h4 className="font-display text-sm font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PUBLIC PARTIES PREVIEW ===== */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                PUBLIC WATCH PARTIES
              </h2>
              <p className="text-muted-foreground max-w-md">
                Open to everyone. Find a party for the next big match and jump in.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All Parties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No public parties yet. Be the first to host one!</p>
              <Link
                href={isAuthenticated ? "/events/create" : "/login"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Your First Party
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURES — WHAT YOU GET ===== */}
      <section className="py-20 border-y border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              EVERYTHING YOU NEED.
              <br />
              <span className="text-gradient-saffron">NOTHING YOU DON'T.</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built for cricket fans, by cricket fans. Every feature is designed to make your watch party unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Headphones, title: "Built-in Audio Rooms", desc: "Every party gets a live audio room. No Zoom links, no third-party apps. Just click and talk." },
              { icon: Settings, title: "Full Host Control", desc: "Set capacity, write rules, mute or remove users, control who speaks. Your party, your rules." },
              { icon: Globe, title: "Public Parties", desc: "List your party publicly so any fan can discover and join. Great for building a following." },
              { icon: Lock, title: "Private Parties", desc: "Keep it exclusive with a private invite link. Perfect for watching with just your friends." },
              { icon: Users, title: "Waitlist System", desc: "Party full? Fans join the waitlist and get notified automatically when a spot opens up." },
              { icon: Shield, title: "Safe & Moderated", desc: "Hosts moderate their own parties. Report abusive users with one click. Zero tolerance for toxicity." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY / TESTIMONIALS ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={COMMUNITY_IMAGE} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/85" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              FROM OUR COMMUNITY
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Hosts and fans sharing their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-6"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm text-foreground/90 leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-14 border-y border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "100%", label: "Free Forever" },
              { value: String(events?.length ?? 0) + "+", label: "Parties Hosted" },
              { value: "You", label: "Control Everything" },
              { value: "0", label: "Tolerance for Abuse" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20">
        <div className="container">
          <div className="relative bg-card border border-border/60 rounded-2xl p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                YOUR MATCH. YOUR PARTY.
                <br />
                <span className="text-gradient-saffron">YOUR RULES.</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Stop watching alone. Host a party for your crew or join a public one. It's free, it's live, and it's built for cricket fans.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={isAuthenticated ? "/events/create" : "/login"}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Host Your Party
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-all"
                >
                  Browse Parties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
