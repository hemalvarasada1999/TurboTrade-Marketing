import { Shield, Lock, FileText, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const TrustSection = () => {
  const trustBadges = [
    {
      icon: Shield,
      title: "SEBI Registered Partner",
      description: "Fully compliant with regulatory standards",
    },
    {
      icon: Lock,
      title: "Secure Trading Platform",
      description: "Bank-grade encryption and security",
    },
    {
      icon: FileText,
      title: "Real-time Reports",
      description: "Complete transparency at every step",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Your Investments,{" "}
              <span className="text-gradient">Your Control.</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              You remain in control at every step. We never touch your funds.
              Our algos execute trades on your brokerage account with full transparency and security.
            </p>
          </div>

          {/* Trust Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {trustBadges.map((badge, index) => (
              <Card
                key={badge.title}
                className="p-8 text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300 border-border bg-card/50 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <badge.icon className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  {badge.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {badge.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Additional Trust Message */}
          <div className="text-center max-w-2xl mx-auto bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/20">
            <Lock className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3 text-foreground">
              Your Security is Our Priority
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              All trades are executed directly through your linked brokerage account.
              We never have access to withdraw your funds. Your capital stays in your control,
              protected by industry-leading security measures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
