import { MouseEvent, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NotFound from "@/pages/NotFound";
import { LEGAL_DOCS, fillLegal, type LegalDoc as Doc } from "@/content/legal/pages";

/* ══════════════ LEGAL DOCUMENT PAGE ══════════════
   One component for all ten legal routes — the /legal hub, Terms, Privacy,
   Cancellation & Refund, Risk Disclosure, Grievance Redressal, the Investor
   Charter, Regulatory Disclosures, the Complaint Board and the Accessibility
   Statement.

   The copy lives in content/legal/pages.ts, which cites the Algo Services
   Agreement article by article. Keeping it as HTML strings is deliberate: the
   wording is legal text and has to stay verbatim, so it is injected, not
   re-typed as JSX. It is our own static content, never user input. Company
   details inside it are {{TOKENS}} filled from .env (see lib/company.ts).

   Shape: the same tinted head band as LegalPageLayout, with breadcrumbs and
   date chips, then a sticky "On this page" rail beside the section cards
   (a <details> jump list below 940px). Styles are in styles/legal.css. */

type Props = { slug: string };

/* Every string on the page, with its {{TOKENS}} filled in. */
const filled = (d: Doc): Doc => ({
  ...d,
  titleHtml: fillLegal(d.titleHtml),
  lede: fillLegal(d.lede),
  description: fillLegal(d.description),
  chips: d.chips.map(fillLegal),
  introHtml: fillLegal(d.introHtml),
  sections: d.sections.map((s) => ({ ...s, heading: fillLegal(s.heading), html: fillLegal(s.html) })),
});

const LegalDoc = ({ slug }: Props) => {
  const doc = useMemo(() => (LEGAL_DOCS[slug] ? filled(LEGAL_DOCS[slug]) : undefined), [slug]);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const tocRef = useRef<HTMLElement>(null);

  /* index.html ships one title and description for the home page. */
  useEffect(() => {
    if (!doc) return;
    const prevTitle = document.title;
    const plain = doc.titleHtml.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
    document.title = `${plain} · TurboTrade.ai`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content;
    if (meta) meta.content = doc.description;
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== undefined) meta.content = prevDesc;
    };
  }, [doc]);

  /* The route reset in App.tsx puts every new route at the top. A link such as
     /terms#most-important-terms-and-conditions-mitc should then land on its
     section, so that happens one frame later. */
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  /* Scroll-spy for the rail: the section crossing the top third of the viewport
     is the one marked current. */
  useEffect(() => {
    const links = Array.from(tocRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const current = byId.get(e.target.id);
          if (!current) return;
          links.forEach((a) => {
            a.classList.toggle("active", a === current);
            if (a === current) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-120px 0px -65% 0px" }
    );
    byId.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [slug]);

  /* The injected copy links between the legal pages with plain <a href="/…">.
     Left alone those would reload the whole app, so same-origin clicks are
     handed to the router. External, mailto:, tel: and new-tab links pass
     through untouched. */
  const onBodyClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest("a");
    if (!a || a.target || a.hasAttribute("download")) return;
    const href = a.getAttribute("href") ?? "";
    if (!href.startsWith("/")) return;
    e.preventDefault();
    navigate(href);
  };

  if (!doc) return <NotFound />;

  const tocItems = doc.sections.map((s) => (
    <li key={s.id}>
      <a href={`#${s.id}`}>{s.heading.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")}</a>
    </li>
  ));

  const sections = doc.sections.map((s) => (
    <section key={s.id} className="card" id={s.id} aria-labelledby={`${s.id}-h`}>
      <h2 id={`${s.id}-h`} dangerouslySetInnerHTML={{ __html: s.heading }} />
      <div dangerouslySetInnerHTML={{ __html: s.html }} />
    </section>
  ));

  return (
    <div className="legal-page legal-doc min-h-screen flex flex-col">
      <Header />

      {/* key={pathname}: replays the .page-rise arrival on every legal route. */}
      <main key={pathname} id="main-content" tabIndex={-1} className="page-rise flex-1 focus:outline-none">
        <div className="legal-head">
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">TurboTrade</Link>
              <span aria-hidden="true">/</span>
              {slug !== "legal" && (
                <>
                  <Link to="/legal">Legal &amp; Compliance</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
              <span aria-current="page">{doc.label}</span>
            </nav>

            <span className="eyebrow">Legal &amp; disclosures</span>
            <h1 dangerouslySetInnerHTML={{ __html: doc.titleHtml }} />
            <p className="legal-lede" dangerouslySetInnerHTML={{ __html: doc.lede }} />
            <div className="meta">
              {doc.chips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="legal-body" onClick={onBodyClick}>
          <div className="wrap">
            {doc.introHtml && <div dangerouslySetInnerHTML={{ __html: doc.introHtml }} />}

            {doc.toc ? (
              <>
                <details className="toc-m">
                  <summary>Jump to section</summary>
                  <ol>{tocItems}</ol>
                </details>
                <div className="legal-grid">
                  <nav className="toc" aria-label="On this page" ref={tocRef}>
                    <h2>On this page</h2>
                    <ol>{tocItems}</ol>
                  </nav>
                  <article>{sections}</article>
                </div>
              </>
            ) : (
              <article>{sections}</article>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalDoc;
