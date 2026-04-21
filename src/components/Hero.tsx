import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp } from "lucide-react";
import turbotradeIcon from "/turbotrade.png"
import { useEffect, useState } from "react";

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

  const inputLines = [
    { label: "NEWS", y: 60 },
    { label: "SENTIMENT", y: 90 },
    { label: "VOLATILITY", y: 120 },
    { label: "RUMORS", y: 150 },
    { label: "TIPS", y: 180 },
    { label: "HERD", y: 210 },
    { label: "FEAR", y: 240, red: true },
    { label: "GREED", y: 270, red: true },
  ];

  const outputLines = [
    { label: "ENTRY", y: 110, dur: "2s", delay: "0s" },
    { label: "EXIT", y: 160, dur: "2.5s", delay: "3.5s" },
    { label: "SL", y: 210, dur: "1.8s", delay: "6s" },
    { label: "TP", y: 260, dur: "2.2s", delay: "1.8s" },
  ];

  const CircuitChipIllustration = () => (
    <div className="rounded-3xl bg-card shadow-2xl px-12 py-6 md:px-16 md:py-8 min-w-[380px] md:min-w-[600px]">
      <svg viewBox="0 0 600 340" className="w-full min-h-[320px] md:min-h-[400px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goldenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="conduitGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== LEFT — 8 Noisy Input Lines ===== */}
        {inputLines.map((line, i) => {
          const strokeColor = line.red ? "hsl(0, 50%, 65%)" : "hsl(var(--muted-foreground))";
          const textColor = line.red ? "hsl(0, 45%, 60%)" : "hsl(var(--muted-foreground))";
          const jag = i % 2 === 0 ? 1 : -1;
          return (
            <g key={i}>
              <text x="8" y={line.y + 5} fill={textColor} fontSize="14" fontFamily="monospace" fontWeight="600" opacity="0.7">{line.label}</text>
              <path
                d={`M${line.label.length * 7 + 18},${line.y} L${80 + i * 3},${line.y + jag * 6} L${100 + i * 2},${line.y - jag * 4} L${120 + i * 2},${line.y + jag * 8} L${140},${line.y - jag * 3} L${160},${line.y + jag * 5} L${185},${line.y} L200,${line.y}`}
                stroke={strokeColor}
                strokeWidth="1.4"
                strokeDasharray={line.red ? "none" : "4 2"}
                opacity={0.5 + i * 0.03}
              />
              {/* Pin connector on chip edge */}
              <rect x="198" y={line.y - 3} width="6" height="6" rx="1" fill={strokeColor} opacity="0.4" />
            </g>
          );
        })}
        <text x="80" y="310" fill="hsl(var(--muted-foreground))" fontSize="15" fontFamily="monospace" textAnchor="middle" fontWeight="600" opacity="0.6">MARKET NOISE</text>

        {/* ===== CENTER — Dark Navy Chip ===== */}
        <g>
          <rect x="204" y="40" width="192" height="260" rx="12" fill="hsl(var(--navy))" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" opacity="0.95" />
          {/* Inner circuit traces */}
          <line x1="220" y1="70" x2="220" y2="280" stroke="hsl(var(--goldenrod))" strokeWidth="0.4" opacity="0.15" />
          <line x1="380" y1="70" x2="380" y2="280" stroke="hsl(var(--goldenrod))" strokeWidth="0.4" opacity="0.15" />
          <line x1="220" y1="170" x2="380" y2="170" stroke="hsl(var(--goldenrod))" strokeWidth="0.4" opacity="0.12" />
          <line x1="240" y1="100" x2="360" y2="100" stroke="hsl(var(--goldenrod))" strokeWidth="0.3" opacity="0.1" />
          <line x1="240" y1="240" x2="360" y2="240" stroke="hsl(var(--goldenrod))" strokeWidth="0.3" opacity="0.1" />

          {/* Engine label */}
          <text x="300" y="78" fill="hsl(var(--goldenrod))" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold" opacity="0.7" letterSpacing="2">TURBOTRADE ENGINE</text>

          {/* TurboTrade icon */}
          <g>
            <image href={turbotradeIcon} x="250" y="110" width="100" height="100" />
          </g>

          {/* Version label */}
          <text x="300" y="270" fill="hsl(var(--goldenrod))" fontSize="11" fontFamily="monospace" textAnchor="middle" opacity="0.5" letterSpacing="1">v2.1 · LOGIC CORE</text>
        </g>

        {/* ===== RIGHT — 4 Clean Output Lines ===== */}
        <g>
          {outputLines.map((line, i) => (
            <g key={i}>
              {/* Pin connector */}
              <rect x="396" y={line.y - 3} width="6" height="6" rx="1" fill="hsl(var(--goldenrod))" opacity="0.5" />
              {/* Dotted straight line */}
              <line x1="402" y1={line.y} x2="520" y2={line.y} stroke="hsl(var(--goldenrod))" strokeWidth="2.5" strokeDasharray="6 4" opacity={0.8 + i * 0.05} />
              {/* Animated signal dot */}
              <circle cy={line.y} r="3" fill="hsl(var(--goldenrod))" opacity="0.95">
                <animate attributeName="cx" from="402" to="520" dur={line.dur} begin={line.delay} repeatCount="indefinite" />
              </circle>
              {/* Endpoint dot */}
              <circle cx="520" cy={line.y} r="4" fill="hsl(var(--goldenrod))" opacity="0.9" />
              <text x="532" y={line.y + 5} fill="hsl(var(--goldenrod))" fontSize="15" fontFamily="monospace" fontWeight="bold" opacity="0.9">{line.label}</text>
            </g>
          ))}
        </g>
        <text x="490" y="310" fill="hsl(var(--goldenrod))" fontSize="15" fontFamily="monospace" textAnchor="middle" fontWeight="600" opacity="0.6">CLEAN SIGNAL</text>
        {/* Signal flow indicator removed */}
      </svg>
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      <div className="absolute inset-0 bg-dot-grid opacity-50" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-goldenrod">Trade the System.</span>
            <br />
            <span className="text-muted-foreground line-through" style={{ textDecorationThickness: '2px' }}>Not the Noise.</span>
          </h1>

          <p className="text-lg text-foreground max-w-md leading-relaxed">
            Research-driven strategies, Automated for you.<br />
            No fear, no greed - just disciplined execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="btn-light-trail bg-primary text-primary-foreground font-semibold text-base px-8 h-12"
            >
              <a href="https://app.turbotrade.ai/auth/signup" target="_blank">
                Start Your Journey
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-12 text-base border-primary text-foreground hover:bg-transparent">
              <a href="https://app.turbotrade.ai/auth/login" target="_blank">
                Login to Dashboard
              </a>
            </Button>
          </div>

        </div>

        <div className="flex justify-center lg:justify-end">
          <CircuitChipIllustration />
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
