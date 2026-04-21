import { ShieldCheck, Shield, Target, Lock, Bell } from "lucide-react";

const features = [
  {
    title: "SEBI Compliant & Empanelled",
    desc: "Trade with confidence. We are SEBI registered RA and Exchange empanelled, ensuring your algo execution meets the highest regulatory standards in India.",
    icon: ShieldCheck,
  },
  {
    title: "Institutional Risk Controls",
    desc: "Your capital is guarded. Configure position sizing, use emergency kill-switches that act instantly to protect your account from unexpected volatility.",
    icon: Shield,
  },
  {
    title: "Systematic SL/TP",
    desc: "Automated trade management. Every strategy comes with pre-defined exit rules, executed systematically to eliminate fear and greed from your decision-making.",
    icon: Target,
  },
  {
    title: "Bank-Grade Security",
    desc: "Cybersecurity-first architecture. We use AES-256 encryption for API keys. Your funds never leave your broker demat.",
    icon: Lock,
  },
  {
    title: "Real-time Transparency",
    desc: "Stay informed, effortlessly. Receive instant trade logs, execution details, and P&L updates directly on your dashboard along with WhatsApp notifications.",
    icon: Bell,
  },
];

const Features = () => (
  <section className="py-32 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-20 space-y-4">
        <p className="text-sm font-mono font-semibold text-goldenrod tracking-[0.25em] uppercase">Features</p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">Built for Serious Traders.</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Regulated. Empanelled. Secure. Trade with absolute peace of mind.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-5 max-w-6xl mx-auto">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-2.5 hover:border-goldenrod/30 transition-colors"
            >
              <Icon className="w-5 h-5 text-goldenrod" />
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
