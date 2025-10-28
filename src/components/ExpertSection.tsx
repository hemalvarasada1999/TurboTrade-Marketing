import { TrendingUp, LineChart, Shield, Zap } from "lucide-react";

const ExpertSection = () => {
  const steps = [
    {
      icon: LineChart,
      title: "Research",
      description: "Years of market analysis and strategy development",
    },
    {
      icon: TrendingUp,
      title: "Backtesting",
      description: "Rigorous testing across multiple market conditions",
    },
    {
      icon: Shield,
      title: "Live Monitoring",
      description: "Real-time performance tracking and optimization",
    },
    {
      icon: Zap,
      title: "Returns",
      description: "Consistent long-term growth and profitability",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Built by Experts.{" "}
              <span className="text-gradient">Proven by Data.</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Behind every strategy lies years of market research, backtesting, and optimization.
              Our in-house quant and research team designs strategies that adapt to real market
              conditions—delivering consistency and long-term growth.
            </p>
          </div>

          {/* Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting Lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />

            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-2 border border-border"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-md mx-auto">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-primary rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
