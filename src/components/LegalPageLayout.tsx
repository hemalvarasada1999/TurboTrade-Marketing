import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

/* ══════════════ LEGAL PAGE LAYOUT ══════════════
   The shell for the Contact page. The legal documents themselves (/legal and
   every policy) render through pages/LegalDoc.tsx, which shares this head band
   and adds breadcrumbs and a contents rail.

   Shape borrowed from the marketing pages: a tinted head band carrying the
   eyebrow, the title and the standfirst, then the copy on plain paper, then the
   same dark footer. See the header comment in styles/legal.css for why this
   scope is `.legal-page` rather than the `.site` the landing page uses.

   `title` accepts a node because several pages supply their own <h1> with one
   word accented. `.legal-head h1` in legal.css is specific enough to normalise
   either shape to the same size. */

interface LegalPageLayoutProps {
  title: ReactNode;
  description?: string;
  /* Overrides the mono eyebrow above the title. Defaults to the honest label for
     what these pages are. */
  eyebrow?: string;
  children?: ReactNode;
}

const LegalPageLayout = ({
  title,
  description,
  eyebrow = "Legal & disclosures",
  children,
}: LegalPageLayoutProps) => {
  const { pathname } = useLocation();

  return (
    <div className="legal-page min-h-screen flex flex-col">
      <Header />

      {/* key={pathname} is what makes the rise replay. Without it React keeps the
          same <main> node across a Privacy -> Terms navigation and the CSS
          animation, having already run once, never fires again. */}
      <main
        key={pathname}
        id="main-content"
        tabIndex={-1}
        className="page-rise flex-1 focus:outline-none"
      >
        <div className="legal-head">
          <div className="wrap">
            <Link className="legal-back" to="/">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                aria-hidden="true"
              >
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              Back to TurboTrade
            </Link>

            <span className="eyebrow">{eyebrow}</span>
            {typeof title === "string" ? <h1>{title}</h1> : title}
            {description && <p className="legal-lede">{description}</p>}
          </div>
        </div>

        <div className="legal-body">
          <div className="wrap">
            <article>{children}</article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPageLayout;
