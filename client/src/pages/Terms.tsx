/*
 * TERMS & CONDITIONS PAGE
 * Design: Stadium Noir
 */
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">TERMS & CONDITIONS</h1>
            </div>
            <p className="text-muted-foreground mb-10">Last updated: February 2026</p>

            <div className="space-y-6">
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By accessing or using Cricket Watch Party ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Platform. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of the revised terms.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">2. Description of Service</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cricket Watch Party is a live audio community discussion platform for cricket fans. It is a "second-screen" companion service. <strong className="text-foreground">We do not provide, host, or stream any live video or audio of any cricket match.</strong> Users must have their own subscription to an official broadcaster to watch the game.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">3. User Accounts</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account. You must provide accurate information during registration. You are solely responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">4. User Conduct</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You agree to abide by our Community Guidelines. You shall not use the Platform for any unlawful purpose, to harass or abuse others, to share illegal content, or to impersonate any person or entity. Violation of these rules may result in immediate suspension or permanent ban.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">5. Intellectual Property</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All content, trademarks, and intellectual property on the Platform are owned by Cricket Watch Party or its licensors. You may not reproduce, distribute, or create derivative works from any content on the Platform without our prior written consent.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">6. Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Platform is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you have paid us, which is zero for a free service.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">7. Contact</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For any questions regarding these Terms, please contact us at <a href="mailto:support@cricketwatchparty.com" className="text-primary hover:underline">support@cricketwatchparty.com</a>.
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
