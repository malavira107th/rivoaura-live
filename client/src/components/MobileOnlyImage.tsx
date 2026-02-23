import { useState, useEffect } from "react";

const BOTH_VERIFIED_KEY = "all_verifications_passed";

/**
 * MobileOnlyImage Component
 * 
 * Shows a FULL-SIZE image covering the entire screen ONLY if:
 * 1. User has passed both verification steps (Google reCAPTCHA + Age Verification)
 * 2. User is on a mobile device (screen width < 768px)
 * 
 * If either condition is not met, the image will not be displayed.
 */
export default function MobileOnlyImage() {
  const [shouldShowImage, setShouldShowImage] = useState(false);

  useEffect(() => {
    const checkConditions = () => {
      // Condition 1: Check if both verifications passed (using localStorage)
      const bothVerified = localStorage.getItem(BOTH_VERIFIED_KEY) === "true";
      
      // Condition 2: Check if user is on mobile (screen width < 768px)
      const isMobile = window.innerWidth < 768;
      
      // Show image only if BOTH conditions are true
      if (bothVerified && isMobile) {
        setShouldShowImage(true);
      } else {
        setShouldShowImage(false);
      }
    };

    // Check conditions on mount
    checkConditions();

    // Re-check on window resize (in case user rotates device or resizes browser)
    window.addEventListener("resize", checkConditions);

    return () => {
      window.removeEventListener("resize", checkConditions);
    };
  }, []);

  // Don't render anything if conditions are not met
  if (!shouldShowImage) {
    return null;
  }

  // Render the full-size mobile-only image covering the entire screen
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Full-size image with cache-busting */}
      <img
        src="/images/mobile-special.webp?v=2"
        alt="Mobile exclusive promo"
        className="w-full h-full object-cover"
      />
      
      {/* Close button (optional - allows users to dismiss the image) */}
      <button
        onClick={() => setShouldShowImage(false)}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold hover:bg-white/30 transition-colors"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
