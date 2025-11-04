import { ReactNode, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
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
        <div className="min-h-screen flex flex-col">
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
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {title}
                        </h1>
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
    );
};

export default LegalPageLayout;
