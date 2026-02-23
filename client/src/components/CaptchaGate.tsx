import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LdzhHUsAAAAAMBjGCMNWzEl_3Ohd4UrQQyP_AVg";
const VERIFICATION_KEY = "captcha_verified";

export default function CaptchaGate({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already verified in this session
    const verified = sessionStorage.getItem(VERIFICATION_KEY);
    if (verified === "true") {
      setIsVerified(true);
    }
    setIsLoading(false);
  }, []);

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      // Store verification in session storage
      sessionStorage.setItem(VERIFICATION_KEY, "true");
      setIsVerified(true);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Blurred background */}
        <div className="absolute inset-0 backdrop-blur-xl bg-background/90" />
        
        {/* CAPTCHA overlay */}
        <div className="relative z-10 h-full flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src="/logo.webp" 
                alt="Rivoaura Live" 
                className="w-20 h-20 mx-auto rounded-full"
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">Welcome to Rivoaura Live</h1>
            <p className="text-muted-foreground mb-6">
              Please verify you're human to continue
            </p>

            {/* reCAPTCHA */}
            <div className="flex justify-center mb-4">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                theme="dark"
              />
            </div>

            {/* Footer text */}
            <p className="text-xs text-muted-foreground">
              This helps us protect our community from spam and abuse
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is verified, show the actual website
  return <>{children}</>;
}
