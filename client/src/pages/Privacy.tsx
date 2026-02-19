/*
 * PRIVACY POLICY PAGE
 * Design: Stadium Noir
 * Clear, specific privacy information for Rivoaura Live
 */
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">PRIVACY POLICY</h1>
            </div>
            <p className="text-muted-foreground mb-10">Last updated: February 17, 2026</p>

            <div className="prose prose-invert max-w-none space-y-8">

              {/* 1. Introduction */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">1. Introduction</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Rivoaura Live ("we," "us," or "our") operates the website at <strong className="text-foreground">rivoauralive.com</strong> (the "Platform"). This Privacy Policy explains exactly what personal data we collect, why we collect it, how we store and protect it, and your rights regarding that data.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rivoaura Live is a free, community-driven platform where cricket fans host and join live watch parties with built-in audio and chat rooms. By creating an account or using the Platform, you agree to the data practices described below.
                </p>
              </div>

              {/* 2. Data We Collect */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">2. Data We Collect</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">We collect only the data necessary to operate the Platform. Here is a complete list:</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2 pr-4 text-foreground font-semibold">Data</th>
                        <th className="text-left py-2 pr-4 text-foreground font-semibold">When Collected</th>
                        <th className="text-left py-2 text-foreground font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Full Name</strong></td>
                        <td className="py-2 pr-4">Account signup</td>
                        <td className="py-2">Display your name when you host or join a party</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Email Address</strong></td>
                        <td className="py-2 pr-4">Account signup</td>
                        <td className="py-2">Account login, password recovery, event notifications</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Password</strong></td>
                        <td className="py-2 pr-4">Account signup</td>
                        <td className="py-2">Authentication — stored as a bcrypt hash, never in plain text</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Favorite Team</strong></td>
                        <td className="py-2 pr-4">Account signup (optional)</td>
                        <td className="py-2">Personalization — shown on your profile, helps you find relevant parties</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Events Created</strong></td>
                        <td className="py-2 pr-4">When you host a party</td>
                        <td className="py-2">Display your party on the listing (if public) and manage it</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Event Registrations</strong></td>
                        <td className="py-2 pr-4">When you join a party</td>
                        <td className="py-2">Track your registered parties, manage capacity for hosts</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 pr-4"><strong className="text-foreground">Contact Messages</strong></td>
                        <td className="py-2 pr-4">When you submit the contact form</td>
                        <td className="py-2">Respond to your inquiry or feedback</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4"><strong className="text-foreground">Browser & Device Info</strong></td>
                        <td className="py-2 pr-4">Automatically on each visit</td>
                        <td className="py-2">Security (detect suspicious logins), fix bugs, improve performance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Data We Do NOT Collect */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">3. Data We Do NOT Collect</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We do not collect your phone number, physical address, payment or financial information (the Platform is free), government-issued ID, location data (GPS), or social media profiles. We do not use tracking pixels, third-party advertising cookies, or sell any data to advertisers.
                </p>
              </div>

              {/* 4. How We Use Your Data */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">4. How We Use Your Data</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">Your data is used exclusively for the following purposes:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong className="text-foreground">Account Management:</strong> Create and authenticate your account using your email and password.</li>
                  <li><strong className="text-foreground">Hosting & Joining Parties:</strong> Display your name as a host or participant in watch parties you create or join.</li>
                  <li><strong className="text-foreground">Event Notifications:</strong> Send you email reminders about upcoming parties you've registered for (you can opt out).</li>
                  <li><strong className="text-foreground">Platform Safety:</strong> Enforce our Community Guidelines, detect abuse, and protect users from harmful behavior.</li>
                  <li><strong className="text-foreground">Product Improvement:</strong> Analyze aggregate, anonymized usage patterns to improve the Platform (e.g., which match formats are most popular).</li>
                </ul>
              </div>

              {/* 5. How We Store & Protect Your Data */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">5. How We Store & Protect Your Data</h2>
                <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
                  <li><strong className="text-foreground">Database:</strong> Your data is stored in a secure MySQL database with encrypted connections (TLS/SSL).</li>
                  <li><strong className="text-foreground">Passwords:</strong> All passwords are hashed using bcrypt with a cost factor of 10. We never store or log plain-text passwords.</li>
                  <li><strong className="text-foreground">Sessions:</strong> Authentication uses signed JWT tokens stored in secure, HTTP-only cookies that cannot be accessed by JavaScript.</li>
                  <li><strong className="text-foreground">Access Control:</strong> Only authorized team members have access to production databases, and all access is logged.</li>
                  <li><strong className="text-foreground">No Absolute Guarantee:</strong> While we implement industry-standard security measures, no system is 100% secure. We will notify affected users promptly in the event of a data breach.</li>
                </ul>
              </div>

              {/* 6. Data Sharing */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">6. Who Can See Your Data</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground">We do not sell, rent, or trade your personal data to any third party.</strong> Here is exactly who can see what:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong className="text-foreground">Other Users:</strong> Your name is visible when you host a party (shown as "Hosted by [Name]") or when you join a party (shown in the participant list). Your email is never visible to other users.</li>
                  <li><strong className="text-foreground">Party Hosts:</strong> If you join someone's party, the host can see your name in their participant list. They cannot see your email, password, or any other data.</li>
                  <li><strong className="text-foreground">Infrastructure Providers:</strong> We use third-party services for hosting (cloud servers) and database management. These providers process data on our behalf under strict confidentiality agreements and do not use your data for their own purposes.</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose data if required by law, court order, or to protect the safety of our users.</li>
                </ul>
              </div>

              {/* 7. Cookies */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">7. Cookies</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use a single essential cookie to keep you logged in (a signed JWT session cookie). This cookie is HTTP-only, secure, and cannot be read by third-party scripts. We do not use advertising cookies, analytics cookies from third parties, or any form of cross-site tracking. There is no cookie banner because we only use strictly necessary cookies required for the Platform to function.
                </p>
              </div>

              {/* 8. Your Rights */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">8. Your Rights</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">You have the following rights regarding your personal data:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong className="text-foreground">Access:</strong> Request a copy of all personal data we hold about you.</li>
                  <li><strong className="text-foreground">Correction:</strong> Update or correct your name, email, or favorite team from your account settings.</li>
                  <li><strong className="text-foreground">Deletion:</strong> Request permanent deletion of your account and all associated data. Email us at <a href="mailto:privacy@rivoauralive.com" className="text-primary hover:underline">privacy@rivoauralive.com</a> and we will process your request within 30 days.</li>
                  <li><strong className="text-foreground">Data Portability:</strong> Request an export of your data in a machine-readable format (JSON).</li>
                  <li><strong className="text-foreground">Withdraw Consent:</strong> You can delete your account at any time, which removes your data from our active systems.</li>
                </ul>
              </div>

              {/* 9. Children */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">9. Children's Privacy</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rivoaura Live is not intended for users under the age of 13. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at <a href="mailto:privacy@rivoauralive.com" className="text-primary hover:underline">privacy@rivoauralive.com</a> and we will delete the data promptly.
                </p>
              </div>

              {/* 10. Changes */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">10. Changes to This Policy</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. When we make significant changes, we will notify registered users via email and update the "Last updated" date at the top of this page. Continued use of the Platform after changes constitutes acceptance of the revised policy.
                </p>
              </div>

              {/* 11. Contact */}
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">11. Contact Us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy, want to exercise your data rights, or have concerns about how your data is handled, contact us at:
                </p>
                <div className="mt-3 bg-background/60 rounded-lg p-4">
                  <p className="text-sm text-foreground font-semibold">Rivoaura Live — Privacy Team</p>
                  <p className="text-sm text-muted-foreground mt-1">Email: <a href="mailto:privacy@rivoauralive.com" className="text-primary hover:underline">privacy@rivoauralive.com</a></p>
                  <p className="text-sm text-muted-foreground">Website: <a href="https://rivoauralive.com/contact" className="text-primary hover:underline">rivoauralive.com/contact</a></p>
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
