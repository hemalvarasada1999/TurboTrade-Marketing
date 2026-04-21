import { Button } from "@/components/ui/button";

const engines = [
  {
    title: "Trend Engine",
    desc: "Captures directional moves using momentum and trend-following logic. Rides the wave, exits at structure breaks.",
    risk: "Medium Risk",
    type: "Trend Following",
    schematic: (
      <svg viewBox="0 0 300 150" className="w-full h-48 md:h-56" fill="none">
        <line x1="20" y1="130" x2="280" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" strokeDasharray="4" opacity="0.4" />
        <line x1="20" y1="140" x2="280" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" strokeDasharray="4" opacity="0.4" />
        <polyline points="30,135 60,120 90,115 120,105 150,95 180,80 210,75 240,60 270,40" stroke="hsl(var(--goldenrod))" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="90,116 80,132 100,132" fill="hsl(var(--goldenrod))" />
        <polygon points="180,80 170,96 190,96" fill="hsl(var(--goldenrod))" />
        <text x="20" y="18" fill="hsl(var(--foreground))" fontSize="14" fontFamily="monospace" opacity="0.9" fontWeight="700">TREND_ENGINE_v3.2</text>
      </svg>
    ),
  },
  {
    title: "Scalper Engine",
    desc: "Captures micro-movements with rapid entries and exits. Designed for high-frequency mean reversion strategies.",
    risk: "High Risk",
    type: "Mean Reversion",
    schematic: (
      <svg viewBox="0 0 300 150" className="w-full h-48 md:h-56" fill="none">
        <line x1="20" y1="75" x2="280" y2="75" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.3" />
        <polyline points="20,75 35,55 50,85 65,50 80,90 95,60 110,82 125,55 140,88 155,52 170,85 185,58 200,80 215,55 230,88 245,52 260,82 275,60" stroke="hsl(var(--goldenrod))" strokeWidth="3.5" strokeLinecap="round" />
        {[50,95,140,200,245].map((x, i) => (
          <circle key={i} cx={x} cy={i % 2 === 0 ? 87 : 54} r="5" fill="hsl(var(--goldenrod))" opacity="1" />
        ))}
        <text x="20" y="18" fill="hsl(var(--foreground))" fontSize="14" fontFamily="monospace" opacity="0.9" fontWeight="700">SCALPER_ENGINE_v2.1</text>
      </svg>
    ),
  },
  {
    title: "Systematic Seller",
    desc: "Harvests option premium through systematic selling. Manages decay curves and hedges automatically.",
    risk: "Low Risk",
    type: "Option Selling",
    schematic: (
      <svg viewBox="0 0 300 150" className="w-full h-48 md:h-56" fill="none">
        <path d="M 30 40 Q 80 42 130 55 Q 180 70 220 100 Q 250 120 280 135" stroke="hsl(var(--goldenrod))" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <rect x="60" y="42" width="44" height="17" rx="3" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="hsl(var(--goldenrod))" fillOpacity="0.2" />
        <rect x="130" y="55" width="44" height="20" rx="3" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="hsl(var(--goldenrod))" fillOpacity="0.2" />
        <rect x="200" y="90" width="44" height="24" rx="3" stroke="hsl(var(--goldenrod))" strokeWidth="1.5" fill="hsl(var(--goldenrod))" fillOpacity="0.2" />
        <text x="65" y="38" fill="hsl(var(--foreground))" fontSize="13" fontFamily="monospace" opacity="0.9" fontWeight="700">θ=0.8</text>
        <text x="135" y="51" fill="hsl(var(--foreground))" fontSize="13" fontFamily="monospace" opacity="0.9" fontWeight="700">θ=0.5</text>
        <text x="205" y="86" fill="hsl(var(--foreground))" fontSize="13" fontFamily="monospace" opacity="0.9" fontWeight="700">θ=0.2</text>
        <text x="20" y="18" fill="hsl(var(--foreground))" fontSize="14" fontFamily="monospace" opacity="0.9" fontWeight="700">SYS_SELLER_v1.4</text>
      </svg>
    ),
  },
];

const Engines = () => (
  <section id="engines" className="py-24 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-16 space-y-4">
        <p className="text-sm font-mono font-semibold text-goldenrod tracking-[0.25em] uppercase">Execution Engines</p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Vessels of Logic
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Pre-engineered strategies ready for deployment. Each engine is a precision instrument.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {engines.map((e) => (
          <div
            key={e.title}
            className="rounded-3xl shadow-xl bg-card p-10 space-y-6 hover:shadow-2xl transition-shadow"
          >
            <div className="rounded-2xl bg-secondary/5 p-6 border border-border">{e.schematic}</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">{e.risk}</span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{e.type}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{e.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 h-12">
          <a href="https://app.turbotrade.ai/marketplace">
            Explore Strategies
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default Engines;
