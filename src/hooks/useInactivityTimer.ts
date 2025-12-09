import { useEffect, useRef, useCallback } from "react";

interface UseInactivityTimerProps {
  onInactive: () => void;
  inactivityTime?: number; // in milliseconds
  warningTime?: number; // time before logout to show warning (in milliseconds)
  onWarning?: () => void;
}

export function useInactivityTimer({
  onInactive,
  inactivityTime = 15 * 60 * 1000, // 15 minutes default
  warningTime = 1 * 60 * 1000, // 1 minute before logout
  onWarning,
}: UseInactivityTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timer (if callback provided)
    if (onWarning && warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        onWarning();
      }, inactivityTime - warningTime);
    }

    // Set inactivity timer
    timeoutRef.current = setTimeout(() => {
      onInactive();
    }, inactivityTime);
  }, [inactivityTime, warningTime, onInactive, onWarning]);

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
    ];

    // Reset timer on any activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [resetTimer]);

  // Return function to manually reset timer
  return { resetTimer };
}
