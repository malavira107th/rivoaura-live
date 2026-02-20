/*
 * LOGIN / SIGNUP PAGE — Custom Auth
 * Design: Stadium Noir
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_URL = "/logo.webp";

export default function Login() {
  const [, setLocation] = useLocation();
  
  // Get tab from URL params (e.g., /login?tab=signup)
  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get("tab") === "signup" ? "signup" : "login";
  
  const [mode, setMode] = useState<"login" | "signup">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const utils = trpc.useUtils();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");

  // Get returnTo from URL params
  const returnTo = params.get("returnTo") || "/";

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      toast.success("Welcome back!");
      await utils.auth.me.invalidate();
      setLocation(returnTo);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: async () => {
      toast.success("Account created! Welcome to Rivoaura Live!");
      await utils.auth.me.invalidate();
      setLocation(returnTo);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      signupMutation.mutate({ name, email, password, favoriteTeam: favoriteTeam || undefined });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="flex-1 flex items-center justify-center pt-20 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <img
              src={LOGO_URL}
              alt="Rivoaura Live"
              className="w-16 h-16 rounded-xl mx-auto mb-4"
            />
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {mode === "login" ? "WELCOME BACK" : "JOIN THE COMMUNITY"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login"
                ? "Sign in to your Rivoaura Live account"
                : "Create your account and start hosting watch parties"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-card border border-border/60 p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min 6 characters" : "Enter your password"}
                  required
                  minLength={mode === "signup" ? 6 : 1}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Favorite Team <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  placeholder="e.g., your favorite cricket team"
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
