const narrativeBlocks = [
  {
    num: "01",
    title: "Eliminate Fatigue",
    metric: "REAL-TIME MONITORING",
    desc: "Markets don't sleep. Our engines monitor the logic around the clock without fatigue or lapses.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="12" />
        <line x1="16" y1="8" x2="16" y2="16" />
        <line x1="16" y1="16" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Remove Bias",
    metric: "ZERO EMOTION",
    desc: "The system doesn't feel the market. No hesitation, no greed, no panic. Only data-driven execution.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="12" />
        <line x1="10" y1="16" x2="22" y2="16" />
        <line x1="16" y1="10" x2="16" y2="22" />
        <circle cx="16" cy="16" r="4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Scale Effortlessly",
    metric: "PARALLEL EXECUTION",
    desc: "Run multiple strategies across instruments simultaneously. No additional screen time required.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="14" width="24" height="12" rx="2" />
        <rect x="7" y="8" width="18" height="12" rx="2" opacity="0.5" />
        <rect x="10" y="2" width="12" height="12" rx="2" opacity="0.25" />
      </svg>
    ),
  },
];

const Philosophy = () => {
  return (
    <section id="philosophy" className="py-28 px-4 bg-dot-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-mono font-semibold text-goldenrod tracking-[0.25em] uppercase">
            INSTITUTIONAL-GRADE AUTOMATION
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Logic Over Luck. Process Over Profit.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Expert-built strategies for everyone. Experience the same systematic discipline used by professional desks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {narrativeBlocks.map((block) => (
            <div
              key={block.title}
              className="relative bg-card border border-border border-l-4 border-l-goldenrod rounded-lg p-8 overflow-hidden"
            >
              {/* Background number */}
              <span className="absolute top-4 right-6 text-7xl font-mono font-bold text-muted-foreground/10 select-none leading-none">
                {block.num}
              </span>

              <div className="relative z-10 space-y-4">
                {block.icon}
                <h3 className="text-xl font-bold text-foreground">{block.title}</h3>
                <p className="font-mono text-xs tracking-widest text-goldenrod font-semibold">
                  {block.metric}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                  {block.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
