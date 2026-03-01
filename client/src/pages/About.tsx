/*
 * ABOUT US PAGE
 * Rivoaura Live — Cricket Fan Community Platform
 */
import { motion } from "framer-motion";
import { Users, Shield, Mic2, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* DISCLAIMER BANNER — TOP */}
      <div className="bg-amber-900/30 border-b border-amber-700/40 py-3 px-4 text-center mt-16">
        <p className="text-xs text-amber-200/90 max-w-3xl mx-auto">
          <strong className="text-amber-300">Important:</strong> Rivoaura Live is a <strong>fan discussion community platform</strong> — NOT a cricket streaming or broadcasting service. We do not provide, host, or link to any live cricket streams. Match viewing requires your own authorized broadcast subscription.
        </p>
      </div>

      <section className="pt-12 pb-20 flex-1">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">ABOUT US</h1>
            </div>
            <p className="text-muted-foreground mb-10">Who we are and what we stand for.</p>

            {/* Who We Are */}
            <div className="bg-card border border-border/60 rounded-xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-3 text-foreground">Who We Are</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Rivoaura Live is a cricket fan community platform built and operated by <strong className="text-foreground">Rivoaura Private Limited</strong> (CIN: U74999DL2016PTC306805), incorporated in New Delhi, India in 2016.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We built Rivoaura Live because cricket is more than a sport — it is a shared experience. Our platform gives fans the tools to host and join live audio discussion rooms during matches, connecting supporters from across the world in real-time conversation.
              </p>
            </div>

            {/* What We Are NOT */}
            <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-3 text-red-300">What We Are NOT</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Rivoaura Live is <strong className="text-foreground">not a streaming service, not a broadcasting platform, and not a piracy site</strong>. We have zero affiliation with any illegal cricket stream or unauthorized broadcast.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our platform does not host, distribute, or link to any cricket match footage. All users are required to watch matches through their own authorized subscriptions — whether that is a television provider, an official OTT platform, or any other licensed broadcaster. Rivoaura Live is purely a second-screen social experience layered on top of the match you are already watching legally.
              </p>
            </div>

            {/* Our Mission */}
            <div className="bg-card border border-border/60 rounded-xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-3 text-foreground">Our Mission</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our mission is to recreate the electric atmosphere of watching cricket with a crowd — for fans who are watching from home, abroad, or anywhere in the world. We believe every fan deserves to celebrate a six, mourn a wicket, and debate a selection with fellow supporters, regardless of geography.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  icon: <Shield className="w-5 h-5 text-primary" />,
                  title: "Safety First",
                  desc: "Zero tolerance for abuse, harassment, or illegal content. Every room is moderated by its host and our platform team.",
                },
                {
                  icon: <Mic2 className="w-5 h-5 text-primary" />,
                  title: "Fan-Powered",
                  desc: "Hosts set the rules, control the room, and create the atmosphere. Every discussion room reflects its community.",
                },
                {
                  icon: <Heart className="w-5 h-5 text-primary" />,
                  title: "Built for Fans",
                  desc: "Every feature is designed around the real needs of cricket fans — not advertisers, not broadcasters, not algorithms.",
                },
                {
                  icon: <Users className="w-5 h-5 text-primary" />,
                  title: "Community First",
                  desc: "We are a community platform. The fans who use Rivoaura Live are our product — their experience is our priority.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Legal & Compliance */}
            <div className="bg-card border border-border/60 rounded-xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-3 text-foreground">Legal & Compliance</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Rivoaura Live operates in full compliance with applicable Indian and international laws. We respect all intellectual property rights, including broadcasting rights held by cricket boards and their authorized licensees.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We actively monitor our platform for any content that may infringe on third-party rights and remove such content immediately upon identification. If you believe any content on our platform violates your rights, please contact us at <a href="mailto:support@rivoauralive.com" className="text-primary hover:underline">support@rivoauralive.com</a>.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border/60 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold mb-3 text-foreground">Contact Us</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Company:</strong> Rivoaura Private Limited</p>
                <p><strong className="text-foreground">CIN:</strong> U74999DL2016PTC306805</p>
                <p><strong className="text-foreground">Address:</strong> Ground Floor, A 96, Shankar Garden, Vikas Puri, New Delhi, Delhi 110018, India</p>
                <p><strong className="text-foreground">Email:</strong> <a href="mailto:support@rivoauralive.com" className="text-primary hover:underline">support@rivoauralive.com</a></p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
