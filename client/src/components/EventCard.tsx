import { Link } from "wouter";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import type { WatchPartyEvent } from "@/lib/data";

interface EventCardProps {
  event: WatchPartyEvent;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const { days, hours, minutes, seconds } = useCountdown(event.startTime);
  const capacityPercent = (event.seatsTaken / event.maxCapacity) * 100;
  const isFull = event.seatsTaken >= event.maxCapacity;

  const formatBadgeColor = {
    T20: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ODI: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Test: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/events/${event.id}`}>
        <div className="group relative bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Top accent line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="p-5">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${formatBadgeColor[event.format]}`}>
                {event.format}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border border-border text-muted-foreground">
                {event.league}
              </span>
              {isFull && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/30">
                  Full
                </span>
              )}
            </div>

            {/* Match Title */}
            <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
              {event.team1} vs {event.team2}
            </h3>

            {/* Venue */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <MapPin className="w-3 h-3" />
              <span>{event.venue}</span>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-4 h-4 text-primary/70" />
              <div className="flex gap-2">
                {[
                  { val: days, label: "D" },
                  { val: hours, label: "H" },
                  { val: minutes, label: "M" },
                  { val: seconds, label: "S" },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-0.5">
                    <span className="font-mono-stat text-lg font-bold text-foreground">
                      {String(item.val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>Seats</span>
                </div>
                <span className="font-mono-stat text-xs text-foreground">
                  {event.seatsTaken.toLocaleString()} / {event.maxCapacity.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isFull ? "bg-destructive" : capacityPercent > 80 ? "bg-primary" : "bg-primary/70"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${capacityPercent}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${isFull ? "text-destructive" : "text-primary"}`}>
                {isFull ? "Join Waitlist" : "Register to Join"}
              </span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
