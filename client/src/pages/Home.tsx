/*
 * HOME PAGE — Cricket Watch Party
 * Design: Stadium Noir — dark cinematic, saffron accents, Oswald display, broadcast feel
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, UserPlus, Search, Shield, Users, Mic2, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { HERO_IMAGE, COMMUNITY_IMAGE, AUDIO_ROOM_IMAGE, HOW_IT_WORKS_BG, MOCK_EVENTS, TESTIMONIALS } from "@/lib/data";

export default function Home() {
  const upcomingEvents = MOCK_EVENTS.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-start overflow-hidden pt-16">
        {/* Background Image */}
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
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary tracking-wide uppercase">Live Audio Watch Parties</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
            >
              THE ROAR OF
              <br />
              THE CROWD.
              <br />
              <span className="text-gradient-saffron">IN YOUR POCKET.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
            >
              Join live audio watch parties for every cricket match. Discuss the game with thousands of fans, analyze every play, and feel the pulse of the stadium.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Explore Upcoming Parties
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-border bg-card/50 text-foreground font-semibold text-sm hover:bg-card transition-all"
              >
                How It Works
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
                <span className="text-foreground font-semibold">10,000+</span> fans from Mumbai to Melbourne
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== UPCOMING EVENTS ===== */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                YOUR FRONT-ROW SEAT
              </h2>
              <p className="text-muted-foreground max-w-md">
                The next big match is just a click away. Register now to secure your spot.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
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
              YOUR VIRTUAL CRICKET COMMUNITY
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to join the world's most passionate cricket conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Search,
                step: "01",
                title: "Discover Your Match",
                desc: "Browse our full schedule of upcoming watch parties for international clashes, league rivalries, and everything in between.",
              },
              {
                icon: UserPlus,
                step: "02",
                title: "Register in Seconds",
                desc: "Secure your spot with a quick, OTP-based registration. Once you're in, you're in. Add the event to your calendar with one tap.",
              },
              {
                icon: Headphones,
                step: "03",
                title: "Join the Conversation",
                desc: "When the match goes live, the audio room opens. Join as a listener, or request to speak and share your expert analysis.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="font-display text-5xl font-bold text-primary/10 absolute top-4 right-4">
                  {item.step}
                </div>
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

      {/* ===== AUDIO ROOM FEATURE ===== */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border/60 glow-saffron">
                <img
                  src={AUDIO_ROOM_IMAGE}
                  alt="Live audio room concept"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                LIVE AUDIO ROOMS.
                <br />
                <span className="text-gradient-saffron">REAL-TIME PASSION.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our Clubhouse-style audio rooms bring the stadium atmosphere to your phone. Join as a listener, or raise your hand to share your take on every boundary, wicket, and strategic play.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Headphones, title: "Listen In", desc: "Join as a listener by default and enjoy live community commentary." },
                  { icon: Mic2, title: "Request to Speak", desc: "Tap the button to request the mic. Moderators will bring you on stage." },
                  { icon: Shield, title: "Safe & Moderated", desc: "Trained moderators ensure a respectful, abuse-free environment." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold mb-0.5">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
              WHAT OUR COMMUNITY SAYS
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Real fans. Real conversations. Real passion for the game.
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
              { value: "10K+", label: "Active Fans" },
              { value: "50+", label: "Events Hosted" },
              { value: "6", label: "Formats Covered" },
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
                READY TO JOIN THE
                <br />
                <span className="text-gradient-saffron">ULTIMATE CRICKET COMMUNITY?</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Don't watch alone. Join thousands of passionate fans and experience every match together.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
