/*
 * CONTACT US PAGE
 * Design: Stadium Noir
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you shortly.");
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (err: { message: string }) => {
      toast.error(err.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    sendMutation.mutate({ name: name.trim(), email: email.trim(), message: message.trim() });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">GET IN TOUCH</h1>
            </div>
            <p className="text-muted-foreground mb-10 max-w-lg">
              Have a question about hosting a party, need help with your account, or want to partner with us? We'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Contact Form */}
              <div className="md:col-span-3">
                <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendMutation.isPending}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sendMutation.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-card border border-border/60 rounded-xl p-6">
                  <Mail className="w-5 h-5 text-primary mb-3" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-1">General Support</h3>
                  <a href="mailto:support@cricketwatchparty.com" className="text-sm text-primary hover:underline">
                    support@cricketwatchparty.com
                  </a>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-6">
                  <Mail className="w-5 h-5 text-primary mb-3" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-1">Partnerships</h3>
                  <a href="mailto:partners@cricketwatchparty.com" className="text-sm text-primary hover:underline">
                    partners@cricketwatchparty.com
                  </a>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-6">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We typically respond within 24 hours. For urgent matters, please include "URGENT" in your subject line.
                  </p>
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
