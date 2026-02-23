import { useState, useEffect } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = "6LdzhHUsAAAAAMBjGCMNWzEl_3Ohd4UrQQyP_AVg";
const STEP1_KEY = "captcha_verified"; // Google reCAPTCHA
const STEP2_KEY = "age_verified"; // Age verification
const BOTH_VERIFIED_KEY = "all_verifications_passed";

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
        // Execute reCAPTCHA v3 (invisible verification)
        const token = await executeRecaptcha("verification_step1");
        
        if (token) {
          // Store Step 1 completion
          sessionStorage.setItem(STEP1_KEY, "true");
          
          // Wait a moment to show success message
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

    // Wait for reCAPTCHA to load
    const timer = setTimeout(verifyUser, 1000);
    return () => clearTimeout(timer);
  }, [executeRecaptcha, onStep1Complete]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-background/95" />
      
      {/* Verification overlay */}
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

          {/* Step indicator */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              STEP 1 OF 2
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">Security Verification</h1>
          <p className="text-muted-foreground mb-6">
            {isVerifying ? "Verifying you're human..." : error ? error : "Verification complete!"}
          </p>

          {/* Loading spinner or error */}
          <div className="flex justify-center mb-4">
            {isVerifying ? (
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : error ? (
              <div className="text-red-500 text-4xl">⚠️</div>
            ) : (
              <div className="text-green-500 text-4xl">✓</div>
            )}
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

// Step 2: Age Verification (18+)
function Step2AgeVerification({ onStep2Complete }: { onStep2Complete: () => void }) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    
    // Store Step 2 completion
    sessionStorage.setItem(STEP2_KEY, "true");
    
    // Mark all verifications as complete
    sessionStorage.setItem(BOTH_VERIFIED_KEY, "true");
    
    // Wait a moment to show success
    setTimeout(() => {
      onStep2Complete();
    }, 800);
  };

  const handleDecline = () => {
    alert("You must be 18 or older to access this website.");
    // Optionally redirect to another page or show an error
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-background/95" />
      
      {/* Age verification overlay */}
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

          {/* Step indicator */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              STEP 2 OF 2
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">Age Verification</h1>
          <p className="text-muted-foreground mb-6">
            {isConfirming ? "Confirming..." : "Please confirm you are 18 years or older"}
          </p>

          {/* Age verification icon */}
          <div className="flex justify-center mb-6">
            {isConfirming ? (
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="text-6xl mb-4">🔞</div>
            )}
          </div>

          {/* Buttons */}
          {!isConfirming && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                I'm 18 or Older
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
              >
                I'm Under 18
              </button>
            </div>
          )}

          {/* Footer text */}
          <p className="text-xs text-muted-foreground mt-6">
            By confirming, you agree to our Terms & Conditions
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
    // Check if user has already completed both verifications
    const bothVerified = sessionStorage.getItem(BOTH_VERIFIED_KEY);
    
    if (bothVerified === "true") {
      setCurrentStep("complete");
      return;
    }

    // Check individual steps
    const step1Done = sessionStorage.getItem(STEP1_KEY);
    const step2Done = sessionStorage.getItem(STEP2_KEY);

    if (step1Done === "true" && step2Done === "true") {
      // Both done but BOTH_VERIFIED_KEY not set (shouldn't happen, but handle it)
      sessionStorage.setItem(BOTH_VERIFIED_KEY, "true");
      setCurrentStep("complete");
    } else if (step1Done === "true") {
      // Step 1 done, show Step 2
      setCurrentStep("step2");
    } else {
      // Start from Step 1
      setCurrentStep("step1");
    }
  }, []);

  const handleStep1Complete = () => {
    setCurrentStep("step2");
  };

  const handleStep2Complete = () => {
    setCurrentStep("complete");
  };

  // Loading state
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

  // Step 1: Google reCAPTCHA
  if (currentStep === "step1") {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
        <Step1GoogleVerification onStep1Complete={handleStep1Complete} />
      </GoogleReCaptchaProvider>
    );
  }

  // Step 2: Age Verification
  if (currentStep === "step2") {
    return <Step2AgeVerification onStep2Complete={handleStep2Complete} />;
  }

  // Both verifications complete - show the website
  return <>{children}</>;
}
