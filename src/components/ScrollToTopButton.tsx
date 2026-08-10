import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { focusPageStart, smoothScrollToTop } from "@/lib/scroll";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    smoothScrollToTop();

    /* Restore focus for keyboard navigation (WCAG 2.4.3).
       focusPageStart uses preventScroll — a bare focus() scrolls the target into
       view, which used to cancel the smooth scroll on the frame after it
       started. That is why this button never actually animated. */
    focusPageStart();
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-[opacity,transform] duration-300 ease-out hover:cursor-pointer ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto hover:-translate-y-0.5 active:scale-95"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp className="h-5 w-5 stroke-[2.5]" />
    </Button>
  );
};

export default ScrollToTopButton;
