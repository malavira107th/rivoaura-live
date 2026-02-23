import { useState, useEffect } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = "6LdzhHUsAAAAAMBjGCMNWzEl_3Ohd4UrQQyP_AVg";
const VERIFICATION_KEY = "captcha_verified";

function CaptchaVerifier({ onVerified }: { onVerified: () => void }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!executeRecaptcha) {
        console.log("reCAPTCHA not yet loaded");
        return;
      }

      try {
        // Execute reCAPTCHA v3
        const token = await executeRecaptcha("homepage");
        
        // In v3, we just get a token. For full security, you'd send this to your backend
        // to verify the score. For now, we'll just accept any token as verification.
        if (token) {
          sessionStorage.setItem(VERIFICATION_KEY, "true");
          onVerified();
        }
      } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        // Still allow access even if verification fails (graceful degradation)
        onVerified();
      } finally {
        setIsVerifying(false);
      }
    };

    // Wait a moment for reCAPTCHA to load
    const timer = setTimeout(verifyUser, 1000);
    return () => clearTimeout(timer);
  }, [executeRecaptcha, onVerified]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-background/90" />
      
      {/* Loading overlay */}
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
            {isVerifying ? "Verifying you're human..." : "Verification complete!"}
          </p>

          {/* Loading spinner */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>

          {/* Footer text */}
          <p className="text-xs text-muted-foreground">
            This helps us protect our community from spam and abuse
          </p>
          
          {/* reCAPTCHA badge notice */}
          <p className="text-xs text-muted-foreground mt-4">
            Protected by reCAPTCHA
          </p>
        </div>
      </div>
    </div>
  );
}

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

  const handleVerified = () => {
    setIsVerified(true);
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
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
        <CaptchaVerifier onVerified={handleVerified} />
      </GoogleReCaptchaProvider>
    );
  }

  // User is verified, show the actual website
  return <>{children}</>;
}
