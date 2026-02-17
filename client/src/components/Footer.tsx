import { Link } from "wouter";


export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      {/* Disclaimer Banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container py-3 text-center text-xs text-muted-foreground">
          <strong className="text-primary/80">Disclaimer:</strong> This platform is for community discussion only. Match viewing is separate and available via official broadcasters.
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663073602365/XsRgERjtFAKleAlN.png"
                alt="Cricket Watch Party Logo"
                className="w-8 h-8 rounded-lg"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-wide">CRICKET</span>
                <span className="font-display text-[9px] font-medium tracking-[0.2em] text-primary">WATCH PARTY</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate live audio companion for every cricket match. Join the conversation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Watch Parties</Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              <Link href="/guidelines" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community Guidelines</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:support@cricketwatchparty.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">support@cricketwatchparty.com</a>
              <a href="mailto:partners@cricketwatchparty.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">partners@cricketwatchparty.com</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Cricket Watch Party. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with passion for cricket fans worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
