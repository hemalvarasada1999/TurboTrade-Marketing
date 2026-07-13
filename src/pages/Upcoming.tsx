import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Cpu, ShieldAlert, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Upcoming = () => {
  // --- Canvas Particle Background Logic ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseColor: string;
    }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 75);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1,
          baseColor: i % 4 === 0 ? "249, 191, 59" : "156, 163, 175", // gold accent or gray
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Initial setup
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint grid
      ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Interaction with mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha = 0.25;
        if (dist < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
          p.x -= dx * force * 0.03;
          p.y -= dy * force * 0.03;
          alpha += force * 0.45;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.baseColor}, ${alpha})`;
        ctx.fill();

        // Connect particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 100) {
            const connAlpha = (100 - cdist) / 100 * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(156, 163, 175, ${connAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/20">
      <Header />

      {/* Main Container with interactive particle canvas background */}
      <main className="flex-grow flex flex-col justify-center items-center relative py-24 px-6 overflow-hidden">
        {/* Particle Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Dynamic Glass Gradient Accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-2xl text-center relative z-10 flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Launch Phase Initiated
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-navy">
              Coming Soon
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We are finalizing our platform deployments and connection protocols. The trading dashboard and strategy marketplace will be active shortly.
            </p>
          </div>

          <div className="pt-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold px-8 h-12 rounded-xl shadow-lg shadow-primary/15 transition-all duration-200 active:scale-95">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Teasers Section */}
        <section className="container mx-auto max-w-5xl mt-24 pt-12 border-t border-border/80 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Advisory Core",
                desc: "Real-time market profiling utilizing multi-factor trend and sentiment signals, compiling institutional research data directly into risk-calibrated execution plans.",
                icon: Cpu,
              },
              {
                title: "High Frequency Core",
                desc: "Hyper-optimized execution models resolving trade allocations in milliseconds, capturing micro-structure price inefficiencies dynamically.",
                icon: TrendingUp,
              },
              {
                title: "Security Protocols",
                desc: "Fully isolated API sandboxing and bank-grade trade execution logs, keeping your asset custody perfectly segregated and protected at all times.",
                icon: ShieldAlert,
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-card/70 backdrop-blur-sm hover:bg-card/90 border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 relative group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
                <div className="bg-primary/10 border border-primary/20 text-primary w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-foreground">{f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Upcoming;
