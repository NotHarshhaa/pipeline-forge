"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowUp } from "@tabler/icons-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
      aria-label="Scroll to top"
    >
      <IconArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>
  );
}
