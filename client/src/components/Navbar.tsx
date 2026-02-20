import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";


const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Watch Parties" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/rivoaura-live-assets/logo.webp"
            alt="Rivoaura Live Logo"
            className="w-9 h-9 rounded-lg"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-wide text-foreground">
              RIVOAURA
            </span>
            <span className="font-display text-[10px] font-medium tracking-[0.25em] text-primary uppercase">
              Live
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="ml-3 flex items-center gap-2">
              <Link
                href="/events/create"
                className="px-4 py-2 rounded-md text-sm font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Party
              </Link>
              <Link
                href="/my-events"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === "/my-events"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                My Events
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/60 border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {user?.name || "Fan"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="ml-3 px-5 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/events/create"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-md text-sm font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Party
                  </Link>
                  <Link
                    href="/my-events"
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      location === "/my-events"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    My Events
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-2 px-4 py-3 rounded-md bg-card/60 border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {user?.name || "Fan"}
                    </span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="mt-1 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { handleLogin(); setOpen(false); }}
                  className="mt-2 px-5 py-3 rounded-md text-sm font-semibold bg-primary text-primary-foreground text-center hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
