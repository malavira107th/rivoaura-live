import { useState, useEffect } from "react";

const BOTH_VERIFIED_KEY = "all_verifications_passed";
const WHATSAPP_LINK = "https://wa.link/99exch1";

/**
 * MobileOnlyImage Component
 * 
 * Shows a FULL-SIZE clickable image covering the entire screen ONLY if:
 * 1. User has passed both verification steps (Google reCAPTCHA + Age Verification)
 * 2. User is on a mobile device (screen width < 768px)
 * 
 * Clicking the image redirects to WhatsApp link.
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

  // Handle click to redirect to WhatsApp
  const handleClick = () => {
    window.location.href = WHATSAPP_LINK;
  };

  // Render the full-size clickable mobile-only image
  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {/* Full-size clickable image with cache-busting */}
      <img
        src="/images/mobile-special.webp?v=4"
        alt="Mobile exclusive promo - Click to contact us on WhatsApp"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
