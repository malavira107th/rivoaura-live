/*
 * PRIVACY POLICY PAGE
 * Design: Stadium Noir
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
            <p className="text-muted-foreground mb-10">Last updated: February 2026</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Introduction</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your privacy is important to us. This policy explains what personal data we collect from you and how we use it. We are committed to being transparent and compliant with all applicable privacy laws. By using Cricket Watch Party, you consent to the practices described in this policy.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Information We Collect</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">We collect data to operate effectively and provide you the best experiences. This includes:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong className="text-foreground">Account Information:</strong> Your phone number or email address, chosen username, and optional favorite team.</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Information about the events you register for and attend.</li>
                  <li><strong className="text-foreground">Device Information:</strong> Basic information about the browser and device you use to access our service.</li>
                </ul>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">How We Use Your Information</h2>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Provide and manage your account.</li>
                  <li>Authenticate you and secure your account via OTP.</li>
                  <li>Send you important notifications about your registered events.</li>
                  <li>Improve our platform and develop new features.</li>
                  <li>Enforce our Community Guidelines and maintain platform safety.</li>
                </ul>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Sharing of Your Information</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We do not sell your personal data to third parties. Your username is visible to others in the community. We may share data with third-party service providers for functions like sending OTPs, but they are bound by strict confidentiality agreements. We may also disclose information if required by law or to protect the rights and safety of our users.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Data Security</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h2 className="font-display text-lg font-bold mb-3 text-foreground">Contact Us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@cricketwatchparty.com" className="text-primary hover:underline">support@cricketwatchparty.com</a>.
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
