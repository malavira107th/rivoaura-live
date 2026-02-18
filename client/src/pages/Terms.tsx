/*
 * TERMS & CONDITIONS PAGE
 * Design: Stadium Noir
 * Clear, specific terms for Brand Pixel Studio
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
            <p className="text-muted-foreground mb-10">Last updated: February 17, 2026</p>

            <div className="space-y-8">

              {/* 1. Acceptance */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By creating an account on, accessing, or using Brand Pixel Studio at <strong className="text-foreground">brandpixelstudio.site</strong> (the "Platform"), you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree to any part of these Terms, you must not use the Platform. We may update these Terms from time to time — we will notify registered users via email when significant changes are made. Continued use after changes constitutes acceptance.
                </p>
              </div>

              {/* 2. What the Platform Is */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">2. What Brand Pixel Studio Is</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Brand Pixel Studio is a free, community-driven platform that allows cricket fans to:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside mb-3">
                  <li><strong className="text-foreground">Host watch parties</strong> — Create a party for any cricket match, set the capacity (how many fans can join), define rules, and choose whether the party is public (visible to everyone) or private (accessible only via a shareable invite link).</li>
                  <li><strong className="text-foreground">Join watch parties</strong> — Browse public parties or use an invite link to join private parties. Experience the match together with other fans through built-in live audio and chat rooms.</li>
                  <li><strong className="text-foreground">Manage their party</strong> — Hosts have full control over their party, including moderation, capacity, and rules.</li>
                </ul>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-foreground font-semibold mb-1">Important Clarification</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Brand Pixel Studio is a <strong className="text-foreground">second-screen companion service</strong>. We do not broadcast, stream, rebroadcast, or provide access to any live cricket match footage, video, or audio commentary. Users must have their own subscription to an official broadcaster (e.g., Disney+ Hotstar, Willow TV, Sky Sports) to watch the actual match. Our platform provides the social experience alongside the match — not the match itself.
                  </p>
                </div>
              </div>

              {/* 3. Eligibility */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">3. Eligibility</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must be at least 13 years old to create an account and use the Platform. If you are between 13 and 18 years old, you must have the consent of a parent or legal guardian. By creating an account, you represent that you meet these age requirements.
                </p>
              </div>

              {/* 4. User Accounts */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">4. Your Account</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">When you create an account, you agree to:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Provide accurate and truthful information (your real name and a valid email address).</li>
                  <li>Keep your password confidential and not share it with anyone.</li>
                  <li>Use only one account per person — creating multiple accounts is not allowed.</li>
                  <li>Notify us immediately at <a href="mailto:support@brandpixelstudio.site" className="text-primary hover:underline">support@brandpixelstudio.site</a> if you suspect unauthorized access to your account.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  You are solely responsible for all activity that occurs under your account. We are not liable for any loss or damage arising from unauthorized use of your account.
                </p>
              </div>

              {/* 5. Hosting a Party */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">5. Hosting a Watch Party</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">When you host a watch party, you agree to:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong className="text-foreground">Moderate your party responsibly.</strong> You are the admin of your party. You are responsible for maintaining a respectful environment within your party's audio and chat rooms.</li>
                  <li><strong className="text-foreground">Set accurate information.</strong> The match, teams, venue, date/time, and capacity you provide must be truthful.</li>
                  <li><strong className="text-foreground">Not use parties for illegal purposes.</strong> Parties must not be used for illegal streaming, gambling, hate speech, or any activity that violates applicable laws.</li>
                  <li><strong className="text-foreground">Not charge participants.</strong> Brand Pixel Studio is a free platform. You may not charge users to join your party or solicit payments through the Platform.</li>
                  <li><strong className="text-foreground">Follow Community Guidelines.</strong> All parties must comply with our <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a>.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  We reserve the right to remove any party that violates these Terms or our Community Guidelines, and to suspend or ban the host's account.
                </p>
              </div>

              {/* 6. Joining a Party */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">6. Joining a Watch Party</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">When you join a watch party, you agree to:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Respect the host's rules and moderation decisions.</li>
                  <li>Behave respectfully toward all participants — no hate speech, harassment, abuse, or threats.</li>
                  <li>Not share illegal streams, pirated content, or links to unauthorized broadcasts within the party.</li>
                  <li>Not spam, advertise, or promote unrelated products or services.</li>
                  <li>Accept that the host has the right to remove you from their party at their discretion.</li>
                </ul>
              </div>

              {/* 7. Public vs Private Parties */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">7. Public and Private Parties</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2 pr-4 text-foreground font-semibold">Feature</th>
                        <th className="text-left py-2 pr-4 text-foreground font-semibold">Public Party</th>
                        <th className="text-left py-2 text-foreground font-semibold">Private Party</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4">Visibility</td>
                        <td className="py-2 pr-4">Listed on the Watch Parties page</td>
                        <td className="py-2">Hidden — accessible only via invite link</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4">Who can join</td>
                        <td className="py-2 pr-4">Any registered user</td>
                        <td className="py-2">Only users with the invite link</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Host control</td>
                        <td className="py-2 pr-4">Full moderation rights</td>
                        <td className="py-2">Full moderation rights</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. Prohibited Content */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">8. Prohibited Content & Behavior</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">The following are strictly prohibited on the Platform:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Sharing or linking to illegal cricket streams or pirated content.</li>
                  <li>Hate speech, discrimination, or harassment based on race, religion, gender, nationality, or any other characteristic.</li>
                  <li>Threats of violence, doxxing, or sharing personal information of others without consent.</li>
                  <li>Spam, phishing, or distributing malware.</li>
                  <li>Impersonating other users, public figures, or Brand Pixel Studio staff.</li>
                  <li>Creating parties for non-cricket purposes or misleading events.</li>
                  <li>Any activity that violates applicable local, national, or international laws.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Violations may result in content removal, temporary suspension, or permanent account ban at our sole discretion.
                </p>
              </div>

              {/* 9. Intellectual Property */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">9. Intellectual Property</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Brand Pixel Studio name, logo, website design, and all original content on the Platform are owned by Brand Pixel Studio. You may not copy, reproduce, distribute, or create derivative works from any part of the Platform without our prior written consent. Cricket team names, logos, and match data referenced on the Platform belong to their respective owners (ICC, BCCI, IPL, etc.) and are used for informational purposes only.
                </p>
              </div>

              {/* 10. Pricing */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">10. Pricing & Payment</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Brand Pixel Studio is currently <strong className="text-foreground">100% free</strong> for all users — both hosting and joining parties. We may introduce optional premium features in the future. If we do, we will clearly communicate pricing before you are asked to pay anything. Free features available today will remain free.
                </p>
              </div>

              {/* 11. Termination */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">11. Account Termination</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground">By you:</strong> You can request deletion of your account at any time by emailing <a href="mailto:support@brandpixelstudio.site" className="text-primary hover:underline">support@brandpixelstudio.site</a>. Upon deletion, your personal data will be removed from our active systems within 30 days. Events you created will be removed or anonymized.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">By us:</strong> We may suspend or terminate your account if you violate these Terms, our Community Guidelines, or applicable laws. We will notify you via email with the reason for termination. You may appeal by contacting us within 14 days.
                </p>
              </div>

              {/* 12. Disclaimers */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">12. Disclaimers & Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  The Platform is provided <strong className="text-foreground">"as is"</strong> and <strong className="text-foreground">"as available"</strong> without warranties of any kind, either express or implied. Specifically:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>We do not guarantee the Platform will be available 24/7 or free from errors or interruptions.</li>
                  <li>We are not responsible for the behavior, content, or actions of users within watch parties.</li>
                  <li>We are not responsible for the accuracy of match schedules, scores, or team information displayed on the Platform.</li>
                  <li>We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.</li>
                  <li>Since the Platform is free, our total liability to you for any claim shall not exceed zero dollars ($0).</li>
                </ul>
              </div>

              {/* 13. Governing Law */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">13. Governing Law</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts in India.
                </p>
              </div>

              {/* 14. Contact */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">14. Contact Us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For questions, concerns, or disputes regarding these Terms:
                </p>
                <div className="mt-3 bg-background/60 rounded-lg p-4">
                  <p className="text-sm text-foreground font-semibold">Brand Pixel Studio — Legal</p>
                  <p className="text-sm text-muted-foreground mt-1">Email: <a href="mailto:legal@brandpixelstudio.site" className="text-primary hover:underline">legal@brandpixelstudio.site</a></p>
                  <p className="text-sm text-muted-foreground">Website: <a href="https://brandpixelstudio.site/contact" className="text-primary hover:underline">brandpixelstudio.site/contact</a></p>
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
