/*
 * 404 NOT FOUND PAGE
 * Design: Stadium Noir
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="flex-1 flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-display text-8xl font-bold text-primary/20 mb-4">404</p>
          <h1 className="font-display text-3xl font-bold mb-3">BOWLED OUT!</h1>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back to the action.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
