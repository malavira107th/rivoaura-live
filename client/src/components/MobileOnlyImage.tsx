import { useState, useEffect } from "react";

const BOTH_VERIFIED_KEY = "all_verifications_passed";

/**
 * MobileOnlyImage Component
 * 
 * Shows an image ONLY if:
 * 1. User has passed both verification steps (Google reCAPTCHA + Age Verification)
 * 2. User is on a mobile device (screen width < 768px)
 * 
 * If either condition is not met, the image will not be displayed.
 */
export default function MobileOnlyImage() {
  const [shouldShowImage, setShouldShowImage] = useState(false);

  useEffect(() => {
    const checkConditions = () => {
      // Condition 1: Check if both verifications passed
      const bothVerified = sessionStorage.getItem(BOTH_VERIFIED_KEY) === "true";
      
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

  // Render the mobile-only image
  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs">
        {/* Image */}
        <img
          src="/images/mobile-special.webp"
          alt="Mobile exclusive content"
          className="w-full h-auto rounded-lg mb-2"
        />
        
        {/* Caption */}
        <p className="text-xs text-center text-muted-foreground">
          🎉 Mobile Exclusive Content
        </p>
      </div>
    </div>
  );
}
