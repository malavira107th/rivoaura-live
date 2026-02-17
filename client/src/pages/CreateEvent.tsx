/*
 * CREATE EVENT PAGE — Any logged-in user can create a watch party
 * Design: Stadium Noir
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";

const FORMATS = ["T20", "ODI", "Test"] as const;

const POPULAR_LEAGUES = [
  "IPL",
  "ICC World Cup",
  "ICC Champions Trophy",
  "The Ashes",
  "Big Bash League",
  "CPL",
  "PSL",
  "SA20",
  "ICC T20 World Cup",
  "Asia Cup",
  "Border-Gavaskar Trophy",
  "Other",
];

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });

  // Form state
  const [title, setTitle] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [format, setFormat] = useState<"T20" | "ODI" | "Test">("T20");
  const [league, setLeague] = useState("IPL");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(10000);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  // Hosts
  const [hosts, setHosts] = useState<{ name: string; bio: string }[]>([
    { name: "", bio: "" },
  ]);

  // Agenda
  const [agenda, setAgenda] = useState<{ time: string; title: string }[]>([
    { time: "", title: "" },
  ]);

  const createMutation = trpc.events.create.useMutation({
    onSuccess: (data) => {
      toast.success("Watch party created!");
      setLocation(`/events/${data.slug}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !startTime) {
      toast.error("Please set a date and time for the match.");
      return;
    }

    const dateTime = new Date(`${startDate}T${startTime}`);
    if (isNaN(dateTime.getTime())) {
      toast.error("Invalid date/time.");
      return;
    }

    // Filter out empty hosts/agenda
    const validHosts = hosts.filter((h) => h.name.trim());
    const validAgenda = agenda.filter((a) => a.time.trim() && a.title.trim());

    createMutation.mutate({
      title: title || `${team1} vs ${team2}`,
      team1,
      team2,
      format,
      league,
      venue,
      startTime: dateTime,
      maxCapacity,
      visibility,
      hosts: validHosts.length > 0 ? validHosts : undefined,
      agenda: validAgenda.length > 0 ? validAgenda : undefined,
    });
  };

  const addHost = () => setHosts([...hosts, { name: "", bio: "" }]);
  const removeHost = (i: number) => setHosts(hosts.filter((_, idx) => idx !== i));
  const updateHost = (i: number, field: "name" | "bio", value: string) => {
    const updated = [...hosts];
    updated[i][field] = value;
    setHosts(updated);
  };

  const addAgenda = () => setAgenda([...agenda, { time: "", title: "" }]);
  const removeAgenda = (i: number) => setAgenda(agenda.filter((_, idx) => idx !== i));
  const updateAgenda = (i: number, field: "time" | "title", value: string) => {
    const updated = [...agenda];
    updated[i][field] = value;
    setAgenda(updated);
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-3xl">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Watch Parties
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              CREATE A <span className="text-gradient-saffron">WATCH PARTY</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Set up a live audio watch party for an upcoming cricket match. Fill in the details below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Match Info */}
              <div className="bg-card/80 border border-border/60 rounded-xl p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">Match Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Team 1 *</label>
                    <input
                      type="text"
                      value={team1}
                      onChange={(e) => setTeam1(e.target.value)}
                      placeholder="e.g., India"
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Team 2 *</label>
                    <input
                      type="text"
                      value={team2}
                      onChange={(e) => setTeam2(e.target.value)}
                      placeholder="e.g., Australia"
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Party Title <span className="text-muted-foreground">(auto-generated if blank)</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={team1 && team2 ? `${team1} vs ${team2}` : "e.g., India vs Australia - Semi Final"}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Format *</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as typeof format)}
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      {FORMATS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">League / Tournament *</label>
                    <select
                      value={league}
                      onChange={(e) => setLeague(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      {POPULAR_LEAGUES.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Venue *</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g., Wankhede Stadium, Mumbai"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Match Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Match Time *</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Max Capacity</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 10000)}
                    min={10}
                    max={100000}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">How many fans can join your party</p>
                </div>

                {/* Visibility Toggle */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Party Visibility *</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`flex-1 px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
                        visibility === "public"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background border-border/60 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>Public</span>
                        <span className="text-xs font-normal opacity-70">Anyone can find & join</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility("private")}
                      className={`flex-1 px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
                        visibility === "private"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background border-border/60 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>Private</span>
                        <span className="text-xs font-normal opacity-70">Invite link only</span>
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {visibility === "public"
                      ? "Your party will appear on the public Watch Parties page for everyone to see."
                      : "Your party will only be accessible via a shareable link. It won't appear on the public listing."}
                  </p>
                </div>
              </div>

              {/* Hosts */}
              <div className="bg-card/80 border border-border/60 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">Hosts (Optional)</h2>
                  <button
                    type="button"
                    onClick={addHost}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Host
                  </button>
                </div>

                {hosts.map((host, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={host.name}
                        onChange={(e) => updateHost(i, "name", e.target.value)}
                        placeholder="Host name"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                      />
                      <input
                        type="text"
                        value={host.bio}
                        onChange={(e) => updateHost(i, "bio", e.target.value)}
                        placeholder="Short bio"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    {hosts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHost(i)}
                        className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Agenda */}
              <div className="bg-card/80 border border-border/60 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">Agenda (Optional)</h2>
                  <button
                    type="button"
                    onClick={addAgenda}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                {agenda.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => updateAgenda(i, "time", e.target.value)}
                        placeholder="e.g., 30 min before"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateAgenda(i, "title", e.target.value)}
                        placeholder="e.g., Pre-match discussion"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    {agenda.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAgenda(i)}
                        className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Watch Party
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
