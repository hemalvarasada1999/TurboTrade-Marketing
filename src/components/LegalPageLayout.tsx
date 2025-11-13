import { ReactNode, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
    title: ReactNode;
    description: string;
    children?: ReactNode;
}

const LegalPageLayout = ({ title, description, children }: LegalPageLayoutProps) => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.05),transparent_50%)] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-border bg-card">
                    <div className="container mx-auto px-6 py-6">
                        <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            ← Back to Home
                        </a>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 container mx-auto px-6 py-10">
                    <article className="max-w-[75ch] mx-auto">
                        <header className="mb-12 text-center">
                            {title}
                            <p className="text-lg text-muted-foreground">
                                {description}
                            </p>
                        </header>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            {children}
                        </div>
                    </article>
                </main>

                {/* Back to Top Button */}
                {showBackToTop && (
                    <Button
                        onClick={scrollToTop}
                        size="icon"
                        className="fixed bottom-8 right-8 rounded-full shadow-elegant hover:shadow-glow z-50"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </Button>
                )}

                <Footer />
            </div>
        </div>
    );
};

export default LegalPageLayout;
