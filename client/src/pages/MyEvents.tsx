/*
 * MY EVENTS (User Dashboard) PAGE
 * Design: Stadium Noir
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyEvents() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">MY EVENTS</h1>
            <p className="text-muted-foreground mb-8">Welcome back! Here are your watch parties.</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-border">
              {(["upcoming", "past"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                    tab === t
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Empty State */}
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                {tab === "upcoming" ? "No Upcoming Events" : "No Past Events"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                {tab === "upcoming"
                  ? "You haven't registered for any upcoming events yet. Time to explore!"
                  : "You haven't attended any events yet."}
              </p>
              {tab === "upcoming" && (
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
                >
                  Explore Events <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
