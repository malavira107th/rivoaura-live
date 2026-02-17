/*
 * DISCLAIMER PAGE
 * Design: Stadium Noir
 */
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">DISCLAIMER</h1>
            </div>
            <p className="text-muted-foreground mb-10">Last updated: February 2026</p>

            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-primary">Important Notice</h2>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  Cricket Watch Party is an independent community discussion platform. We are NOT affiliated with, endorsed by, or connected to the ICC, BCCI, IPL, any cricket board, any broadcaster, or any cricket team. All team names, logos, and trademarks are the property of their respective owners.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">No Streaming Service</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This platform does not provide, host, or facilitate the streaming of any live cricket match or any other copyrighted content. We are a "second-screen" audio discussion service. Users must have their own separate, legal subscription to an official broadcaster to watch any match.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">User-Generated Content</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The views and opinions expressed by users in our audio rooms are their own and do not reflect the views of Cricket Watch Party. We are not responsible for the accuracy, completeness, or reliability of any statements made by users during live discussions.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">No Betting or Gambling</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cricket Watch Party does not promote, facilitate, or endorse any form of betting, gambling, or wagering. Any discussion of betting odds or gambling activities within our audio rooms is strictly prohibited and will result in immediate action.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Contact</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you have any concerns about content on our platform, please contact us immediately at <a href="mailto:support@cricketwatchparty.com" className="text-primary hover:underline">support@cricketwatchparty.com</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
