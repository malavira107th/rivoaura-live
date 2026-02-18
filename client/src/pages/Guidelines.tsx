/*
 * COMMUNITY GUIDELINES PAGE
 * Updated: User-hosted model — hosts moderate their own parties
 */
import { motion } from "framer-motion";
import { Shield, Ban, MessageSquareOff, Focus, Gavel, Users, Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RULES = [
  {
    icon: Ban,
    title: "No Abuse, Harassment, or Hate Speech",
    body: "Zero tolerance for personal attacks, bullying, racism, sexism, or discrimination. Respect fellow fans, hosts, and speakers at all times. Violations may result in removal from the party or a permanent platform ban."
  },
  {
    icon: MessageSquareOff,
    title: "No Illegal Links or Spam",
    body: "Do not share links to illegal streaming sites, pirated content, or promotional spam. Flooding the chat or audio room with repetitive messages is strictly forbidden."
  },
  {
    icon: Focus,
    title: "Keep it Relevant",
    body: "While friendly banter is welcome, keep the conversation focused on the match and cricket. This ensures the best experience for everyone in the party."
  },
  {
    icon: Crown,
    title: "Respect the Host",
    body: "The host sets the rules for their party. If a host asks you to stop a behavior, respect their decision. If you disagree, you're free to leave and join or create a different party."
  },
  {
    icon: Users,
    title: "For Hosts: Your Party, Your Responsibility",
    body: "As a host, you are responsible for moderating your party. Use the mute, remove, and ban tools to keep your party safe. Set clear rules when creating your party so attendees know what to expect."
  },
  {
    icon: Gavel,
    title: "Platform Enforcement",
    body: "While hosts moderate their own parties, the Brand Pixel Studio team monitors the platform for serious violations. Repeated reports against a user across multiple parties may result in a permanent platform ban. Use the Report button if you see something that crosses the line."
  }
];

export default function Guidelines() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                COMMUNITY GUIDELINES
              </h1>
            </div>
            <p className="text-muted-foreground mb-10 max-w-lg">
              Brand Pixel Studio is a community-driven platform. These guidelines apply to everyone — hosts, speakers, and listeners alike.
            </p>

            {/* Spirit of the Game */}
            <div className="bg-card border border-border/60 rounded-xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-3">The Spirit of the Game</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every watch party is hosted by a fan, for fans. Whether you're hosting for 10 friends or 10,000 strangers, the same spirit applies: respect, passion, and love for cricket. Treat others as you would want to be treated on and off the field.
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-4">
              {RULES.map((rule, i) => (
                <motion.div
                  key={rule.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-card border border-border/60 rounded-xl p-6"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <rule.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold mb-1.5">{rule.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{rule.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
