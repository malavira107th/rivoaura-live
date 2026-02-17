/*
 * HOME PAGE — Cricket Watch Party
 * Content: User-hosted watch parties with built-in audio & chat rooms
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, UserPlus, Search, Shield, Mic2, Quote, Loader2, Plus, Users, Lock, Globe, Settings } from "lucide-react";
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

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-10 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {["RD", "PN", "AS", "VK"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">Thousands of fans</span> hosting and joining parties worldwide
                </p>
              </motion.div>
            </div>

            {/* RIGHT — Live Watch Party Card Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />

                {/* Main Card */}
                <div className="relative bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Card Header — Live Badge */}
                  <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between bg-card/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Now</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-primary/70" />
                      <span className="text-xs text-muted-foreground">Public Party</span>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-1.5">
                          <span className="font-display font-bold text-blue-400 text-sm">IND</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground">India</p>
                        <p className="text-lg font-display font-bold text-primary">186/3</p>
                        <p className="text-[10px] text-muted-foreground">32.4 ov</p>
                      </div>
                      <div className="px-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">VS</span>
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-1.5">
                          <span className="font-display font-bold text-green-400 text-sm">AUS</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground">Australia</p>
                        <p className="text-lg font-display font-bold text-muted-foreground">Yet to bat</p>
                        <p className="text-[10px] text-muted-foreground">&nbsp;</p>
                      </div>
                    </div>

                    {/* Party Stats */}
                    <div className="bg-background/60 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Party Capacity</span>
                        <span className="text-foreground font-semibold">847 / 1,000</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full" style={{ width: '84.7%' }} />
                      </div>
                    </div>

                    {/* Audio Room Participants */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Headphones className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Live Audio Room</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { name: "Rahul", speaking: true },
                          { name: "Priya", speaking: false },
                          { name: "Arjun", speaking: true },
                          { name: "Sneha", speaking: false },
                          { name: "Vikram", speaking: false },
                        ].map((person, i) => (
                          <div key={i} className="text-center">
                            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              person.speaking
                                ? 'bg-primary/20 border-2 border-primary text-primary ring-2 ring-primary/30 ring-offset-1 ring-offset-card'
                                : 'bg-secondary border border-border/50 text-muted-foreground'
                            }`}>
                              {person.name.slice(0, 2).toUpperCase()}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{person.name}</p>
                            {person.speaking && (
                              <div className="flex items-center justify-center gap-[2px] mt-0.5">
                                <span className="w-[2px] h-2 bg-primary rounded-full animate-pulse" />
                                <span className="w-[2px] h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                                <span className="w-[2px] h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Chat Preview */}
                    <div className="bg-background/60 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Mic2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Live Chat</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-semibold text-primary shrink-0">Rahul:</span>
                          <span className="text-[10px] text-muted-foreground">What a shot by Kohli! 🔥</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-semibold text-blue-400 shrink-0">Priya:</span>
                          <span className="text-[10px] text-muted-foreground">That cover drive was pure class</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-semibold text-green-400 shrink-0">Arjun:</span>
                          <span className="text-[10px] text-muted-foreground">Need 115 more from 17 overs 💪</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-border/40 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground"><span className="text-foreground font-semibold">847</span> fans watching</span>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold">Join Party</span>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute -bottom-4 -left-4 bg-card border border-border/60 rounded-lg px-3 py-2 shadow-xl flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <UserPlus className="w-3 h-3 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-foreground">Sneha just joined!</p>
                    <p className="text-[9px] text-muted-foreground">2 seconds ago</p>
                  </div>
                </motion.div>

                {/* Floating host badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="absolute -top-3 -right-3 bg-card border border-primary/30 rounded-lg px-3 py-2 shadow-xl flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Settings className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-foreground">Hosted by Rahul</p>
                    <p className="text-[9px] text-primary">Party Admin</p>
                  </div>
                </motion.div>
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
                Stop watching alone. Host a party for your crew or join a public one with thousands of fans. It's free, it's live, and it's built for cricket.
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
