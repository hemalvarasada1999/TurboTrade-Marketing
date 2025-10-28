import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Work Less. Earn More.{" "}
            <span className="text-gradient">Live Free.</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Start your journey toward financial freedom through automated investing today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300 group"
            >
              Start with a Demo
              <PlayCircle className="ml-2 h-6 w-6 group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary hover:bg-primary hover:text-white px-10 py-7 text-lg rounded-full transition-all duration-300"
            >
              Explore Strategies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-border/50 mt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">₹500Cr+</div>
              <div className="text-sm text-muted-foreground">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">15%+</div>
              <div className="text-sm text-muted-foreground">Average Annual Returns</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
