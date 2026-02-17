/*
 * WATCH PARTIES (Events Listing) PAGE
 * Design: Stadium Noir — dark cinematic, saffron accents
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, CalendarDays, Loader2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { trpc } from "@/lib/trpc";

const FORMATS = ["All", "T20", "ODI", "Test"] as const;
const LEAGUES = ["All", "IPL", "International", "Big Bash", "PSL", "CPL"] as const;

export default function Events() {
  const [selectedFormat, setSelectedFormat] = useState<string>("All");
  const [selectedLeague, setSelectedLeague] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = trpc.events.list.useQuery();

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => {
      if (selectedFormat !== "All" && e.format !== selectedFormat) return false;
      if (selectedLeague !== "All" && e.league !== selectedLeague) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.team1.toLowerCase().includes(q) ||
          e.team2.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedFormat, selectedLeague, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                UPCOMING WATCH PARTIES
              </h1>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Find your next match and join the conversation. Filter by format, league, or search for your favorite teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-6">
        <div className="container">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teams, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters:</span>
              </div>

              {/* Format Filter */}
              <div className="flex flex-wrap gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border transition-all ${
                      selectedFormat === f
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="hidden sm:block w-px h-6 bg-border" />

              {/* League Filter */}
              <div className="flex flex-wrap gap-2">
                {LEAGUES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLeague(l)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border transition-all ${
                      selectedLeague === l
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-20 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing <span className="text-foreground font-semibold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">No Matching Events Found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Try adjusting your filters or check back soon. We are constantly adding new watch parties for matches around the world.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
