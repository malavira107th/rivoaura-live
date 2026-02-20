/**
 * HOME PAGE — Rivoaura Live (Static Version)
 * Content: User-hosted watch parties with built-in audio & chat rooms
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, UserPlus, Search, Shield, Mic2, Quote } from "lucide-react";
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
                Watch cricket together, wherever you are. Create or join live audio watch parties with real-time chat. No downloads. No delays. Just pure cricket passion.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/events">
                  <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                    Browse Events
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Link>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted/50 backdrop-blur-sm border border-border text-foreground font-semibold rounded-md opacity-60 cursor-not-allowed">
                  <span className="text-sm">Coming Soon</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex items-center gap-6 mt-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-primary" />
                  <span>HD Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  <span>No Sign-Up Required</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== UPCOMING EVENTS ===== */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Upcoming Watch Parties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of cricket fans in live audio rooms. Real-time commentary, instant reactions, and the electric atmosphere of match day.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Events loading...</p>
            <p className="text-sm text-muted-foreground">Full features coming soon!</p>
          </div>

          <div className="text-center mt-8">
            <Link href="/events">
              <a className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                View All Events
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
