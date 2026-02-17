/*
 * COMMUNITY GUIDELINES PAGE
 * Design: Stadium Noir
 */
import { motion } from "framer-motion";
import { Shield, Ban, MessageSquareOff, Focus, Gavel } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RULES = [
  {
    icon: Ban,
    title: "No Abuse, Harassment, or Hate Speech",
    body: "There is a zero-tolerance policy for any form of personal attacks, bullying, racism, sexism, or discrimination. Respect your fellow fans, hosts, and moderators at all times."
  },
  {
    icon: MessageSquareOff,
    title: "No Illegal Links or Spam",
    body: "Do not share links to illegal streaming sites, unauthorized services, or promotional content. Spamming the chat or audio room with repetitive messages is strictly forbidden."
  },
  {
    icon: Focus,
    title: "Keep it Relevant",
    body: "While a little off-topic chat is fine, please try to keep the conversation focused on the match and cricket in general. This ensures the best experience for everyone."
  },
  {
    icon: Gavel,
    title: "How We Enforce These Rules",
    body: "Our moderators have the final say. Violating these guidelines may result in being muted, removed from a room, or a permanent ban from the platform. If you see someone breaking the rules, please use the Report button immediately."
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
              We are committed to creating a welcoming and respectful space for all cricket fans. By participating, you agree to abide by these rules.
            </p>

            {/* Spirit of the Game */}
            <div className="bg-card border border-border/60 rounded-xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-3">The Spirit of the Game</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our community is built on a shared passion for cricket. We encourage healthy debate, insightful analysis, and friendly banter. Treat others as you would want to be treated on and off the field. Remember, we are all here because we love this game.
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
