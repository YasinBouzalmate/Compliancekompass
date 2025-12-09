import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Vis knappen når brukeren har scrollet minst 200px
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Alltid render knappen, men skjul/vis med CSS
  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        width: "3.5rem",
        height: "3.5rem",
        backgroundColor: "#9333ea",
        color: "white",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(147, 51, 234, 0.4)",
        opacity: showScrollTop ? 1 : 0,
        transform: showScrollTop ? "translateY(0)" : "translateY(1rem)",
        transition: "all 0.3s ease",
        pointerEvents: showScrollTop ? "auto" : "none",
      }}
      aria-label="Scroll til toppen"
    >
      <ArrowUp style={{ width: "1.5rem", height: "1.5rem" }} />
    </button>
  );
}
