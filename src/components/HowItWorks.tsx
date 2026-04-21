const steps = [
  {
    num: "01",
    title: "Pick your Strategies",
    desc: "Browse our catalog of institutional-grade, blackbox strategies. Choose the ones that align with your risk appetite.",
    icon: (
      <svg viewBox="0 0 80 80" className="w-24 h-24" fill="none">
        <circle cx="40" cy="36" r="16" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="none" />
        <path d="M32 36 Q36 28 40 36 Q44 44 48 36" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <line x1="40" y1="52" x2="40" y2="60" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="62" r="2.5" fill="hsl(var(--goldenrod))" fillOpacity="0.4" stroke="hsl(var(--goldenrod))" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Link your Broker",
    desc: "Connect your preferred broker in seconds via our encrypted API gateway. Your capital stays exactly where it belongs - in your demat account.",
    icon: (
      <svg viewBox="0 0 80 80" className="w-24 h-24" fill="none">
        <rect x="24" y="22" width="32" height="36" rx="4" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="none" />
        <text x="33" y="46" fill="hsl(var(--goldenrod))" fontSize="18" fontWeight="bold" fontFamily="monospace">T</text>
        <circle cx="48" cy="28" r="2" fill="hsl(var(--goldenrod))" fillOpacity="0.5" />
        <line x1="28" y1="52" x2="52" y2="52" stroke="hsl(var(--goldenrod))" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Authorize & Go",
    desc: "Review the quantity and authorize the engine to execute. Once activated, our system takes over the trades with total control and consistency.",
    icon: (
      <svg viewBox="0 0 80 80" className="w-24 h-24" fill="none">
        <rect x="24" y="24" width="32" height="32" rx="4" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="40" r="6" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="40" r="2" fill="hsl(var(--goldenrod))" fillOpacity="0.5" />
        <line x1="40" y1="56" x2="40" y2="62" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="62" x2="44" y2="62" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-16 space-y-4">
        <p className="text-sm font-mono font-semibold text-goldenrod tracking-[0.25em] uppercase">3 STEPS TO SYSTEMATIC TRADING</p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">Deploy Intelligence. Automate Execution.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Algo trading. Simpler than it sounds.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Animated dashed connection line - dashes march left to right */}
        <svg className="hidden md:block absolute top-12 left-[16.67%] w-[66.66%] h-[2px]" preserveAspectRatio="none">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="hsl(var(--goldenrod))" strokeWidth="2" strokeDasharray="8 6" className="animate-marching-dashes" />
        </svg>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${i * 0.2}s`, animationFillMode: "both" }}
            >
              <div className="flex justify-center relative z-10">
                <div className="relative bg-background rounded-full">{s.icon}</div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono text-goldenrod">{s.num}</span>
                <h3 className="text-xl font-bold text-navy">{s.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
