import { Link } from "react-router-dom";

/* ══════════════ BROKER PARTNER BAND ══════════════
   The one block on the landing page addressed to somebody other than a retail
   trader. It is dark on purpose: the tonal break tells a retail visitor at a
   glance that this paragraph is not for them, faster than the eyebrow does. It
   also gives the page a closing anchor before the FAQ. */

export default function PartnerBand() {
  return (
    <section className="partner" id="partners" aria-labelledby="partnerTitle">
      <div className="wrap">
        <div className="pt-grid">
          <div>
            {/* a direct question rather than a mono eyebrow: the label's job here
                is to sort readers, and 11px uppercase mono with wide tracking was
                the least readable thing on the page */}
            <p className="pt-ask">Are you a broker?</p>
            <h2 id="partnerTitle">
              Run an algo desk
              <br />
              <span className="hl">without building one.</span>
            </h2>
            <p className="lede">
              Your active clients already expect automation. Building this takes quarters &mdash;
              partnering with us takes weeks.
            </p>
            {/* two paragraphs rather than a line break: the first block wraps to
                three lines at this measure, so a bare break would just end line
                three early and read as an accident */}
            <p className="lede pt-hold">
              Every order still routes through you. Every rupee stays in your client's demat.
            </p>
          </div>

          <div className="pt-card">
            <p className="pt-ways">
              <b>Two ways in.</b> Co-branded, where our platform and compliance carry the
              credibility while you test demand. Or white-label, entirely your brand, scoped to your
              build. Most partners start co-branded.
            </p>
            <Link className="btn btn-y" to="/broker-partner-program">
              Explore the partner program
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            {/* the question above narrows to "broker"; this line quietly widens it
                again so an authorised person or RIA does not rule themselves out */}
            <p className="pt-fine">
              Brokers, authorised persons and registered intermediaries. Reviewed in two working
              days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
