import Header from "@/components/Header";
import PartnerHero from "@/components/partner/PartnerHero";
import PartnerModels from "@/components/partner/PartnerModels";
import PartnerProof from "@/components/partner/PartnerProof";
import PartnerFaq from "@/components/partner/PartnerFaq";
import PartnerApply from "@/components/partner/PartnerApply";
import PartnerFooter from "@/components/partner/PartnerFooter";

/* ══════════════ BROKER PARTNER PROGRAM ══════════════
   Addressed to registered intermediaries, not retail traders. No curtain here:
   the opening effect belongs to the home page, and a broker following a link
   from an email wants the pitch, not an illustration to dismiss.

   Section order, and the reasoning:
     hero    the claim, the demand figures, and what stays theirs
     models  the two ways in, co-branded marked as the start
     proof   what they'd be plugging into, then the regulatory reality
     faq     the three objections raised before an internal pitch
     apply   the form, and the two ways to skip it

   `apply` stays last. Every section above it is a reason to fill it in. */

const BrokerPartnerProgram = () => {
  return (
    <div className="site">
      <Header variant="partner" />
      {/* Reached from the footer's Company column and from the landing page's
          partner band, so it gets the same rise-into-place entrance as the legal
          routes. No curtain here — the opening effect belongs to the home page. */}
      <main id="main-content" tabIndex={-1} className="page-rise focus:outline-none">
        <PartnerHero />
        <PartnerModels />
        <PartnerProof />
        <PartnerFaq />
        <PartnerApply />
      </main>
      <PartnerFooter />
    </div>
  );
};

export default BrokerPartnerProgram;
