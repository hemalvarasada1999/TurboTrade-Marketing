import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/brand";

/* ══════════════ GET STARTED ══════════════
   The closing band, after the FAQ: one ask for new visitors, one for people
   who already have an account. Built from shared classes only. */

export default function GetStarted() {
  return (
    <section className="tint" id="get-started">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Get started</span>
          <h2>Set it up once. Then let it run.</h2>
          <p className="lede">
            Create your account, go through every strategy and its numbers, and switch one on when
            you are ready. Already with us? Log in and pick up where you left off.
          </p>
        </div>
        <div className="hero-cta gs-cta">
          <a className="btn btn-y" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            Create account
          </a>
          <a className="btn btn-o" href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
            Log in
          </a>
        </div>
      </div>
    </section>
  );
}
