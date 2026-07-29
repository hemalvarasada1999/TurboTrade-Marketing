import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface LegalPageLayoutProps {
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

const LegalPageLayout = ({
  title,
  description,
  children,
}: LegalPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col justify-between">
      <Header />
      <div className="relative z-10 pt-16 flex-1 flex flex-col justify-between">
        {/* Main Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 focus:outline-none"
        >
          <article className="w-full">
            {/* Back to Home Button */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
            </div>

            <header className="mb-8 text-center">
              {typeof title === "string" ? (
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-2">
                  {title}
                </h1>
              ) : (
                title
              )}
              {description && (
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </header>

            <div className="space-y-5">{children}</div>
          </article>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default LegalPageLayout;
