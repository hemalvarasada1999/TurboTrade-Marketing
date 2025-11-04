import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { Sparkles, TrendingUp, Bell, CheckCircle2 } from "lucide-react";

const Upcoming = () => {
    const roadmapItems = [
        {
            title: "Advanced AI Analytics",
            description: "Machine learning-powered insights for smarter trading decisions",
            status: "In Development",
        },
        {
            title: "Mobile App",
            description: "Trade on the go with our native iOS and Android applications",
            status: "Coming Soon",
        },
        {
            title: "Social Trading",
            description: "Follow and copy strategies from top-performing traders",
            status: "Planned",
        },
        {
            title: "Advanced Risk Management",
            description: "Enhanced portfolio protection and risk assessment tools",
            status: "Planned",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-6">
                    <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ← Back to Home
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20 md:py-28">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">What's Next</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Exciting Features Coming Soon
                    </h1>
                    <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                        We're constantly innovating to bring you the best algorithmic trading experience. Here's what we're working on.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Upcoming;
