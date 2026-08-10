import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Curtain from "@/components/site/Curtain";
import { curtainWillShow } from "@/components/site/curtainState";
import HeroStage from "@/components/sections/HeroStage";
import Discipline from "@/components/sections/Discipline";
import Strategies from "@/components/sections/Strategies";
import Pricing from "@/components/sections/Pricing";
import PartnerBand from "@/components/sections/PartnerBand";
import Faq from "@/components/sections/Faq";

/* Section order is the argument, not a layout choice:
     hero        the claim, the product still, the three steps
     discipline  what actually happens while you're away
     strategies  pick a style, then what you know before switching it on
     pricing     one price per strategy, no profit share
     partners    the one band not addressed to a retail trader
     faq         the objections, answered candidly

   Moving `partners` above `pricing` puts a B2B pitch between a retail visitor
   and the price. Moving `faq` above `pricing` answers objections nobody has yet. */

const Index = () => {
  /* Exactly one entrance runs. On a first page load that is the curtain; on a
     return from a footer link (Contact, the legal pages, the partner program) the
     curtain is spent, so the content rises instead. Read once at mount and held
     in state — recomputing it per render would flip to `rise` the instant the
     curtain marked itself consumed, mid-animation. */
  const [opening] = useState(curtainWillShow);

  /* The curtain owns the opening and hands off with onLift, which is what starts
     the hero badge's gold sweep — see the comment in Curtain.tsx for why that
     cannot fire on mount. With no curtain there is nothing to hand off from, so
     the badge starts lit; otherwise a visitor returning to the home page would
     never see the sweep at all. */
  const [lifted, setLifted] = useState(!opening);
  const onLift = useCallback(() => setLifted(true), []);

  /* Arriving from another route via a section link. Header pushes the target in
     location.state rather than in the URL because React Router does not scroll to
     a hash on navigation, and a bare `/#pricing` would land at the top with a
     misleading address bar. */
  const location = useLocation();
  const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
  useEffect(() => {
    if (!scrollTo) return;
    /* One frame, so the sections below the fold have laid out and the target has
       a real offset to scroll to. */
    const id = requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [scrollTo]);

  return (
    <div className="site">
      {/* outside <main> so the overlay is not part of the document outline */}
      {opening && <Curtain onLift={onLift} />}
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className={`${opening ? "" : "page-rise "}focus:outline-none`}
      >
        <HeroStage shine={lifted} />
        <Discipline />
        <Strategies />
        <Pricing />
        <PartnerBand />
        <Faq />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
