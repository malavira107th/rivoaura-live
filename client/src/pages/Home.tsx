/**
 * HOME PAGE — Rivoaura Live (Static Version - Full Featured)
 * Content: User-hosted watch parties with built-in audio & chat rooms
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, UserPlus, Search, Shield, Mic2, Quote, Plus, Users, Lock, Globe, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HERO_IMAGE, COMMUNITY_IMAGE, AUDIO_ROOM_IMAGE, HOW_IT_WORKS_BG, TESTIMONIALS } from "@/lib/data";

export default function Home() {
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
                  href="/events/create"
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
              { value: "Coming", label: "Soon" },
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
                  href="/events/create"
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
