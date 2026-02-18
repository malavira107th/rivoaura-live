/*
 * DISCLAIMER PAGE
 * Design: Stadium Noir
 * Clear, specific disclaimers for Brand Pixel Studio
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
            <p className="text-muted-foreground mb-10">Last updated: February 17, 2026</p>

            <div className="space-y-8">

              {/* Critical Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-primary">Critical Notice — Please Read Carefully</h2>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  Brand Pixel Studio is an independent, community-driven platform built by cricket fans, for cricket fans. We are <strong>NOT affiliated with, endorsed by, sponsored by, or connected to</strong> the International Cricket Council (ICC), Board of Control for Cricket in India (BCCI), Indian Premier League (IPL), Cricket Australia (CA), England and Wales Cricket Board (ECB), Pakistan Cricket Board (PCB), or any other national or international cricket governing body, broadcaster, team, or player. All team names, tournament names, logos, and trademarks mentioned on this platform are the property of their respective owners and are used solely for identification and informational purposes.
                </p>
              </div>

              {/* No Streaming */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">We Do NOT Stream Cricket Matches</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  This is the most important thing to understand about Brand Pixel Studio:
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-400 font-semibold">
                    Brand Pixel Studio does not broadcast, stream, rebroadcast, host, link to, or provide access to any live cricket match footage, video, audio commentary, or any other copyrighted broadcast content — in any form.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Our platform is a <strong className="text-foreground">"second-screen" social companion</strong>. It provides live audio rooms and text chat rooms where fans can talk to each other while watching a match on their own screens. Think of it as a group phone call with friends during a match — we provide the call, not the match.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To watch any cricket match, you must have your own legal subscription to an official broadcaster such as Disney+ Hotstar, JioCinema, Sky Sports, Willow TV, Kayo Sports, or any other licensed provider in your region. Brand Pixel Studio has no relationship with any of these services.
                </p>
              </div>

              {/* User-Hosted Parties */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">User-Hosted Parties — Not Our Content</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Watch parties on this platform are created and managed entirely by individual users (the "hosts"). Brand Pixel Studio the company does not create, curate, endorse, or moderate the content of individual parties. Specifically:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong className="text-foreground">Opinions expressed</strong> by hosts and participants in audio rooms and chat rooms are their own and do not represent the views of Brand Pixel Studio.</li>
                  <li><strong className="text-foreground">Match predictions, analysis, and commentary</strong> shared by users are personal opinions and should not be treated as professional advice or official information.</li>
                  <li><strong className="text-foreground">Hosts are responsible</strong> for moderating their own parties and ensuring their party complies with our <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a> and <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>.</li>
                  <li><strong className="text-foreground">We are not liable</strong> for any content, statements, behavior, or interactions that occur within user-hosted parties.</li>
                </ul>
              </div>

              {/* No Betting */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">No Betting, Gambling, or Match Fixing</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Brand Pixel Studio <strong className="text-foreground">strictly prohibits</strong> the following activities on the Platform:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Betting, gambling, or wagering of any kind — including casual bets between users.</li>
                  <li>Sharing betting odds, tips, or links to betting/gambling websites.</li>
                  <li>Promoting or discussing match fixing, spot fixing, or any form of corruption in cricket.</li>
                  <li>Promoting fantasy sports platforms or referral codes within parties.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Any user found engaging in these activities will be permanently banned without warning. We cooperate with law enforcement authorities if we become aware of any illegal gambling or match-fixing activity.
                </p>
              </div>

              {/* Match Information Accuracy */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Match Information Accuracy</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Match schedules, team names, venues, dates, and times displayed on the Platform are provided by users when they create watch parties and may also be sourced from publicly available information. We do not guarantee the accuracy, completeness, or timeliness of this information. Match schedules can change due to weather, ground conditions, broadcaster decisions, or other factors beyond our control. Always verify match details with the official broadcaster or cricket board before relying on information from this Platform.
                </p>
              </div>

              {/* No Warranty */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Platform Availability & Warranty</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Brand Pixel Studio is provided on an <strong className="text-foreground">"as is"</strong> and <strong className="text-foreground">"as available"</strong> basis. We make no warranties, express or implied, regarding the Platform's availability, reliability, or fitness for any particular purpose. The Platform may experience downtime, bugs, or interruptions — particularly during high-traffic moments like IPL finals or World Cup matches. We will do our best to keep the Platform running, but we cannot guarantee uninterrupted service. We are not liable for any loss, inconvenience, or frustration caused by Platform downtime or technical issues.
                </p>
              </div>

              {/* Third-Party Links */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Third-Party Links & Content</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Users may share links to external websites within chat rooms or party descriptions. Brand Pixel Studio does not endorse, verify, or take responsibility for any third-party content, websites, or services linked from the Platform. Clicking on external links is at your own risk. We strongly advise against clicking on links from unknown users.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by applicable law, Brand Pixel Studio, its founders, team members, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to: loss of data, loss of goodwill, emotional distress, or any damages resulting from interactions with other users. Since the Platform is free, our maximum aggregate liability for any claim is zero ($0 / ₹0).
                </p>
              </div>

              {/* DMCA / Copyright */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Copyright & DMCA Compliance</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We respect intellectual property rights. If you believe that any content on the Platform infringes your copyright, please send a detailed notice to <a href="mailto:legal@brandpixelstudio.site" className="text-primary hover:underline">legal@brandpixelstudio.site</a> with the following information: (1) a description of the copyrighted work, (2) the specific location on the Platform where the infringing content appears, (3) your contact information, and (4) a statement that you have a good-faith belief that the use is not authorized. We will review and respond to valid notices promptly.
                </p>
              </div>

              {/* Report Concerns */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Report a Concern</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you encounter any content, behavior, or activity on the Platform that you believe violates this Disclaimer, our Terms, or applicable laws, please report it immediately:
                </p>
                <div className="mt-3 bg-background/60 rounded-lg p-4">
                  <p className="text-sm text-foreground font-semibold">Brand Pixel Studio — Trust & Safety</p>
                  <p className="text-sm text-muted-foreground mt-1">General: <a href="mailto:support@brandpixelstudio.site" className="text-primary hover:underline">support@brandpixelstudio.site</a></p>
                  <p className="text-sm text-muted-foreground">Legal & Copyright: <a href="mailto:legal@brandpixelstudio.site" className="text-primary hover:underline">legal@brandpixelstudio.site</a></p>
                  <p className="text-sm text-muted-foreground">Privacy: <a href="mailto:privacy@brandpixelstudio.site" className="text-primary hover:underline">privacy@brandpixelstudio.site</a></p>
                  <p className="text-sm text-muted-foreground">Contact Form: <a href="/contact" className="text-primary hover:underline">brandpixelstudio.site/contact</a></p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
