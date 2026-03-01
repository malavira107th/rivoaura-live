import { useState, useEffect } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = "6LdzhHUsAAAAAMBjGCMNWzEl_3Ohd4UrQQyP_AVg";
const STEP1_KEY = "captcha_verified"; // Google reCAPTCHA
const STEP2_KEY = "terms_agreed"; // Terms & Conditions agreement
const BOTH_VERIFIED_KEY = "all_verifications_passed";

// Detect if the visitor is a known search engine or social media crawler
function isSearchBot(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const bots = [
    "googlebot",
    "adsbot-google",
    "adsbot",
    "mediapartners-google",
    "google-inspectiontool",
    "bingbot",
    "slurp",         // Yahoo
    "duckduckbot",
    "baiduspider",
    "yandexbot",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "telegrambot",
    "applebot",
    "semrushbot",
    "ahrefsbot",
    "mj12bot",
    "petalbot",
    "bytespider",
    "gptbot",
    "chatgpt-user",
    "ccbot",
    "anthropic",
    "claudebot",
  ];
  return bots.some((bot) => ua.includes(bot));
}

// Step 1: Google reCAPTCHA v3 Verification
function Step1GoogleVerification({ onStep1Complete }: { onStep1Complete: () => void }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      if (!executeRecaptcha) {
        console.log("reCAPTCHA not yet loaded");
        return;
      }

      try {
        setIsVerifying(true);
        const token = await executeRecaptcha("verification_step1");
        
        if (token) {
          sessionStorage.setItem(STEP1_KEY, "true");
          setTimeout(() => {
            onStep1Complete();
          }, 800);
        } else {
          setError("Verification failed. Please refresh the page.");
        }
      } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        setError("Verification error. Please refresh the page.");
      } finally {
        setIsVerifying(false);
      }
    };

    const timer = setTimeout(verifyUser, 1000);
    return () => clearTimeout(timer);
  }, [executeRecaptcha, onStep1Complete]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-xl bg-background/95" />
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <img 
              src="/logo.webp" 
              alt="Rivoaura Live" 
              className="w-20 h-20 mx-auto rounded-full"
            />
          </div>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              STEP 1 OF 2
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Security Verification</h1>
          <p className="text-muted-foreground mb-6">
            {isVerifying ? "Verifying you're human..." : error ? error : "Verification complete!"}
          </p>

          <div className="flex justify-center mb-4">
            {isVerifying ? (
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : error ? (
              <div className="text-red-500 text-4xl">⚠️</div>
            ) : (
              <div className="text-green-500 text-4xl">✓</div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            This helps us protect our community from spam and abuse
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Protected by reCAPTCHA
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 2: Terms & Conditions Agreement
function Step2TermsAgreement({ onStep2Complete }: { onStep2Complete: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      alert("Please agree to the Terms & Conditions to continue.");
      return;
    }

    setIsConfirming(true);
    sessionStorage.setItem(STEP2_KEY, "true");
    sessionStorage.setItem(BOTH_VERIFIED_KEY, "true");
    
    setTimeout(() => {
      onStep2Complete();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-xl bg-background/95" />
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <img 
              src="/logo.webp" 
              alt="Rivoaura Live" 
              className="w-20 h-20 mx-auto rounded-full"
            />
          </div>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              STEP 2 OF 2
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-6">
            {isConfirming ? "Processing..." : "Please review and accept our terms to continue"}
          </p>

          <div className="flex justify-center mb-6">
            {isConfirming ? (
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="text-6xl mb-4">📋</div>
            )}
          </div>

          {!isConfirming && (
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-primary cursor-pointer"
                />
                <span className="text-sm">
                  I have read and agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms & Conditions
                  </a>
                  {" "}and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          )}

          {!isConfirming && (
            <button
              onClick={handleContinue}
              disabled={!agreed}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Website
            </button>
          )}

          <p className="text-xs text-muted-foreground mt-6">
            By continuing, you confirm that you accept our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}

// Main CaptchaGate component with 2-step verification
export default function CaptchaGate({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<"loading" | "step1" | "step2" | "complete">("loading");

  useEffect(() => {
    // ✅ FIX #1: Bypass verification for search engine crawlers (Google, Bing, etc.)
    // This prevents cloaking accusations — bots see the same content as users
    if (isSearchBot()) {
      setCurrentStep("complete");
      return;
    }

    // Check if user has already completed both verifications this session
    const bothDone = sessionStorage.getItem(BOTH_VERIFIED_KEY) === "true";
    if (bothDone) {
      setCurrentStep("complete");
      return;
    }

    // Check individual steps
    const step1Done = sessionStorage.getItem(STEP1_KEY) === "true";
    const step2Done = sessionStorage.getItem(STEP2_KEY) === "true";

    if (step1Done && step2Done) {
      sessionStorage.setItem(BOTH_VERIFIED_KEY, "true");
      setCurrentStep("complete");
    } else if (step1Done) {
      setCurrentStep("step2");
    } else {
      setCurrentStep("step1");
    }
  }, []);

  const handleStep1Complete = () => {
    setCurrentStep("step2");
  };

  const handleStep2Complete = () => {
    setCurrentStep("complete");
  };

  if (currentStep === "loading") {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentStep === "step1") {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
        <Step1GoogleVerification onStep1Complete={handleStep1Complete} />
      </GoogleReCaptchaProvider>
    );
  }

  if (currentStep === "step2") {
    return <Step2TermsAgreement onStep2Complete={handleStep2Complete} />;
  }

  return <>{children}</>;
}
