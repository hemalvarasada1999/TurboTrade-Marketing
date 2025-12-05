import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
            Work Smart. Earn More.{" "} <br />
            <span className="text-gradient">Live Free.</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Start your journey toward financial freedom through automated investing today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {/* <Butt/ */}
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary hover:bg-primary hover:text-white px-10 py-7 text-lg rounded-full transition-all duration-300"
            >
              <a href="https://staging.turbotrade.ai/marketplace" target="_blank">
                Explore Strategies
              </a>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};


export default FinalCTA;