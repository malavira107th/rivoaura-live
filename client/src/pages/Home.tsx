/*
 * HOME PAGE — Rivoaura Live
 * Cricket Fan Discussion Rooms — NOT a streaming service
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, UserPlus, Search, Shield, Mic2, Quote, Plus, Users, Lock, Globe, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HERO_IMAGE, COMMUNITY_IMAGE, AUDIO_ROOM_IMAGE, HOW_IT_WORKS_BG, TESTIMONIALS } from "@/lib/data";

const FAQ_ITEMS = [
  {
    q: "Is Rivoaura Live a cricket streaming service?",
    a: "No. Rivoaura Live is NOT a streaming service. We do not provide, host, or link to any live cricket streams or broadcasts. This platform is a fan discussion community where you can join audio rooms and chat with other fans during matches you are watching on your own authorized subscription (TV, OTT platform, etc.).",
  },
  {
    q: "What do I need to use Rivoaura Live?",
    a: "You need your own legal cricket broadcast subscription to watch the match (e.g., Hotstar, Willow TV, Sky Sports, or any authorized broadcaster in your region). Rivoaura Live provides the discussion layer — the audio room and chat — not the match footage.",
  },
  {
    q: "How do I host a fan discussion room?",
    a: "Create a free account, click 'Create Room', pick the match, set your capacity and rules, and choose whether it's public or private. When the match starts, your audio room goes live automatically.",
  },
  {
    q: "How do I join a discussion room?",
    a: "Browse the public room listings, find a room for the match you're watching, and register with one click. If the room is full, join the waitlist and you'll be notified when a spot opens.",
  },
  {
    q: "Is the platform free to use?",
    a: "Creating an account and joining discussion rooms is free. Hosting rooms is also free. We do not charge for any core features of the platform.",
  },
  {
    q: "How do you handle abuse and illegal content?",
    a: "Hosts moderate their own rooms and can mute or remove any participant. Users can report abuse with one click. We have zero tolerance for illegal content, harassment, or links to unauthorized streams. Violations result in immediate account suspension.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ===== TOP DISCLAIMER BANNER — ABOVE THE FOLD ===== */}
      <div className="bg-amber-950/40 border-b border-amber-700/40 pt-16">
        <div className="container py-3">
          <p className="text-xs text-amber-200/90 text-center leading-relaxed">
            <strong className="text-amber-300">⚠ Important Disclaimer:</strong> Rivoaura Live is a <strong>fan discussion community platform — NOT a cricket streaming or broadcasting service.</strong> We do not provide, host, or link to any live cricket streams. Match viewing requires your own authorized broadcast subscription (TV, OTT, etc.). <Link href="/disclaimer" className="text-amber-300 hover:underline">Read full disclaimer →</Link>
          </p>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-start overflow-hidden">
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
                  <span className="text-xs font-medium text-primary tracking-wide uppercase">Live Fan Discussion Rooms</span>
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
                DISCUSSION ROOM.
                <br />
                <span className="text-gradient-saffron">INVITE YOUR CREW.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
              >
                Create a fan discussion room for any cricket match. Set the capacity, control who joins, and experience every ball together with built-in live audio and chat. Your room, your rules.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Host a Discussion Room
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-border bg-card/50 text-foreground font-semibold text-sm hover:bg-card transition-all cursor-pointer"
                >
                  Browse Public Rooms
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground"
              >
                <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HOW_IT_WORKS_BG} alt="" className="w-full h-full object-cover opacity-10" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              HOW IT WORKS
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Whether you want to host your own room or join someone else's — it takes less than a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* HOST PATH */}
            <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <Plus className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wide uppercase">I Want to Host</span>
              </div>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Create Your Room", desc: "Pick the match, set your capacity (10 friends or 10,000 fans), and write your room rules." },
                  { step: "02", title: "Choose Public or Private", desc: "Public rooms appear on the listing for anyone. Private rooms are invite-only via a shareable link." },
                  { step: "03", title: "Go Live & Moderate", desc: "When the match starts, your audio room goes live. Control who speaks, mute or remove anyone. It's your room." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{item.step}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JOIN PATH */}
            <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <Users className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wide uppercase">I Want to Join</span>
              </div>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Browse Public Rooms", desc: "Explore upcoming fan discussion rooms on the listing page. Filter by match, format, or league." },
                  { step: "02", title: "Register & Get Ready", desc: "Secure your spot with one click. If it's full, join the waitlist — you'll be notified when a spot opens." },
                  { step: "03", title: "Join the Discussion", desc: "When the match starts, join the live audio room. Listen in, chat, or request to speak." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{item.step}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 border-y border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              EVERYTHING YOU NEED.
              <br />
              <span className="text-gradient-saffron">NOTHING YOU DON'T.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Built for cricket fans, by cricket fans. Every feature is designed to make your fan discussion room unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Headphones, title: "Built-in Audio Rooms", desc: "Every room gets a live audio channel. No Zoom links, no third-party apps. Just click and talk." },
              { icon: Settings, title: "Full Host Control", desc: "Set capacity, write rules, mute or remove users, control who speaks. Your room, your rules." },
              { icon: Globe, title: "Public Rooms", desc: "List your room publicly so any fan can discover and join. Great for building a community." },
              { icon: Lock, title: "Private Rooms", desc: "Keep it exclusive with a private invite link. Perfect for discussing with just your friends." },
              { icon: UserPlus, title: "Waitlist System", desc: "Room full? Fans join the waitlist and get notified automatically when a spot opens up." },
              { icon: Shield, title: "Safe & Moderated", desc: "Hosts moderate their own rooms. Report abusive users with one click. Zero tolerance for toxicity." },
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
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
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
              { value: "Live", label: "Audio Rooms" },
              { value: "You", label: "Control Everything" },
              { value: "0", label: "Tolerance for Abuse" },
              { value: "24/7", label: "Community Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to know about Rivoaura Live.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card border border-border/60 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/30 transition-colors"
                >
                  <span className="font-semibold text-sm text-foreground pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-primary hover:underline">
              View all FAQs →
            </Link>
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
                YOUR MATCH. YOUR ROOM.
                <br />
                <span className="text-gradient-saffron">YOUR RULES.</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Stop discussing alone. Host a room for your crew or join a public one. Built for cricket fans who want to share the moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Host Your Room
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-all cursor-pointer"
                >
                  Browse Rooms
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
                <Link href="/guidelines" className="hover:text-primary transition-colors">Community Guidelines</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
