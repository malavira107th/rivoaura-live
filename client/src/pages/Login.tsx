/*
 * REGISTER / LOGIN PAGE
 * Design: Stadium Noir — OTP-based auth flow
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Step = "input" | "otp" | "profile" | "done";

export default function Login() {
  const [step, setStep] = useState<Step>("input");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [team, setTeam] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      toast.error("Please enter your phone number or email.");
      return;
    }
    toast.success("OTP Sent!");
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("The code you entered is incorrect. Please try again.");
      return;
    }
    setStep("profile");
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please choose a username.");
      return;
    }
    toast.success("Welcome to Cricket Watch Party!");
    setStep("done");
  };

  const TEAMS = [
    "India", "Australia", "England", "Pakistan", "South Africa", "New Zealand",
    "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan",
    "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bengaluru",
    "Kolkata Knight Riders", "Delhi Capitals", "Rajasthan Royals",
    "Sunrisers Hyderabad", "Punjab Kings", "Gujarat Titans", "Lucknow Super Giants"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="flex-1 flex items-center justify-center pt-16 pb-20">
        <div className="container max-w-md">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-border/60 rounded-2xl p-8"
          >
            {step === "input" && (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold mb-2">JOIN THE COMMUNITY</h1>
                  <p className="text-sm text-muted-foreground">
                    Create your account or sign in to register for events and be part of the conversation.
                  </p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Enter your Phone Number or Email
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="e.g., +91 9876543210 or you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">You will receive a 6-digit OTP</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    Send OTP <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold mb-2">VERIFY YOUR IDENTITY</h1>
                  <p className="text-sm text-muted-foreground">
                    Please enter the 6-digit code sent to your device.
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm text-center tracking-[0.5em] font-mono-stat text-lg placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Didn't receive the code? <button type="button" className="text-primary font-medium hover:underline" onClick={() => toast.success("OTP Resent!")}>Resend OTP</button>
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
                  >
                    Verify & Proceed
                  </button>
                </form>
              </>
            )}

            {step === "profile" && (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold mb-2">CREATE YOUR PROFILE</h1>
                  <p className="text-sm text-muted-foreground">
                    Choose a username and optionally pick your favorite team.
                  </p>
                </div>
                <form onSubmit={handleCreateProfile} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Choose a Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g., CricketFan123"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Your username will be visible to other users.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Your Favorite Team <span className="text-muted-foreground">(Optional)</span></label>
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Select a team...</option>
                      {TEAMS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
                  >
                    Complete Registration
                  </button>
                </form>
              </>
            )}

            {step === "done" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">YOU'RE IN!</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Welcome to Cricket Watch Party, <strong className="text-foreground">{username}</strong>! You can now register for events and join live audio rooms.
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
                >
                  Explore Events <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
