/*
 * PROFILE PAGE — Cricket Watch Party
 * Allows users to edit their name, favorite team, and password.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { User, Shield, Heart, Lock, ArrowLeft, Loader2, Check, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  // Form state
  const [name, setName] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Messages
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setFavoriteTeam((user as any).favoriteTeam || "");
    }
  }, [user]);

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      utils.auth.me.invalidate();
      setTimeout(() => setProfileMsg(null), 3000);
    },
    onError: (err) => {
      setProfileMsg({ type: "error", text: err.message });
    },
  });

  const updatePasswordMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(null), 3000);
    },
    onError: (err) => {
      setPasswordMsg({ type: "error", text: err.message });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    updateProfileMutation.mutate({ name, favoriteTeam });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    updatePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container max-w-2xl">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground mb-10">Manage your account settings and preferences.</p>
          </motion.div>

          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border/60 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Update your name and cricket preferences.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border/40">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all text-sm"
                  placeholder="Your name"
                  required
                  minLength={2}
                />
              </div>

              {/* Favorite Team */}
              <div>
                <label htmlFor="favoriteTeam" className="block text-sm font-medium text-foreground mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-primary" />
                    Favorite Team
                  </span>
                </label>
                <input
                  id="favoriteTeam"
                  type="text"
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all text-sm"
                  placeholder="e.g., India, Mumbai Indians, CSK"
                />
              </div>

              {/* Profile Message */}
              {profileMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  profileMsg.type === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-destructive/10 border border-destructive/20 text-destructive"
                }`}>
                  {profileMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {profileMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </motion.div>

          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border/60 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Change Password</h2>
                <p className="text-sm text-muted-foreground">Keep your account secure with a strong password.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all text-sm"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all text-sm"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all text-sm"
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </div>

              {/* Password Message */}
              {passwordMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  passwordMsg.type === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-destructive/10 border border-destructive/20 text-destructive"
                }`}>
                  {passwordMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {passwordMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className="w-full py-3 rounded-lg bg-card text-foreground font-semibold text-sm border border-border hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updatePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/40"
          >
            <p className="text-xs text-muted-foreground text-center">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"} · 
              Last signed in {user?.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
