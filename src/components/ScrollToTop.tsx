import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls halfway down the page
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check on mount
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center z-50 group animate-fade-in"
          aria-label="Scroll til toppen"
        >
          <ChevronUp className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform duration-200" />
        </button>
      )}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}