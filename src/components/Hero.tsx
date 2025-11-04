import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp } from "lucide-react";
import heroImage from "@/assets/hero-yacht.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Financial freedom through automated investing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary/70" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Luxury is Time;{" "} <br />
            <span className="text-gradient">Our Algos</span>{" "}
            Give You Both.
          </h1>

          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
            Build wealth the smarter way — without charts, stress, or sleepless nights.
          </p>

          <div className="flex justify-center items-center gap-4 pt-6">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-[var(--shadow-glow)] hover:scale-105 transition-all duration-300"
            >
              <Link to="/upcoming">
                Start Your Journey
              </Link>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-primary hover:bg-primary hover:border-accent text-white hover:text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-[var(--shadow-glow)] hover:scale-105 transition-all duration-300"
            >
              <Link to="/upcoming">
                Login to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <div className="w-1.5 h-3 bg-accent rounded-full mx-auto animate-pulse" />
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 rounded-full shadow-elegant hover:shadow-glow z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </section>
  );
};

export default Hero;
