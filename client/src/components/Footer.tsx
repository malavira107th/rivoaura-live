import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      {/* Disclaimer Banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container py-3 text-center text-xs text-muted-foreground">
          <strong className="text-primary/80">Disclaimer:</strong> Rivoaura Live is a community platform for live discussion. Match viewing requires your own official broadcast provider.
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663073602365/SKAJHsMmNePfWoSaEf6sA3/brand-assets/logo.png"
                alt="Rivoaura Live Logo"
                className="w-8 h-8 rounded-lg"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-wide">RIVOAURA</span>
                <span className="font-display text-[9px] font-medium tracking-[0.2em] text-primary">LIVE</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Host your own cricket watch party or join one. Built-in audio rooms, live chat, and full host control. Free for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Public Parties</Link>
              <Link href="/events/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">Host a Party</Link>
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
              <a href="mailto:support@rivoauralive.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">support@rivoauralive.com</a>
              <a href="mailto:partners@rivoauralive.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">partners@rivoauralive.com</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Rivoaura Live. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with passion for cricket fans worldwide.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">RIVOAURA PRIVATE LIMITED</strong><br />
              Ground Floor, A 96, Shankar Garden, Vikas Puri, New Delhi, West Delhi, Delhi, 110018<br />
              CIN: U74999DL2016PTC306805
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
