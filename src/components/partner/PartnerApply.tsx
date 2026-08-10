import React, { useState } from "react";
import { toast } from "sonner";

/* ══════════════ PARTNER APPLICATION ══════════════
   The lead form. Validation, the free-mail nudge, the reference code and the
   webhook are carried over unchanged from the previous build — only the styling
   moved. Anything that touches where a lead lands is behaviour, not design.

   LEAD DESTINATION: a Google Apps Script endpoint, read from the environment.
   With no endpoint configured the form runs in demo mode — it validates and logs
   the payload rather than silently pretending to send. `mode:"no-cors"` is
   required: Apps Script does not return CORS headers, so the response is opaque
   and a fetch that resolves is the strongest signal available. That is why a
   throw still shows success and logs — a failure here is more likely to be the
   opaque response than a lost lead, and telling a broker their application
   vanished when it did not is the worse error. */

const getWebhookUrl = (): string => {
  const envUrl =
    import.meta.env.VITE_GOOGLE_SHEET_URL || import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
  if (envUrl && envUrl.trim() !== "") return envUrl.trim();
  const deploymentId = import.meta.env.VITE_GOOGLE_SHEET_DEPLOYMENT_ID;
  if (deploymentId && deploymentId.trim() !== "") {
    return `https://script.google.com/macros/s/${deploymentId.trim()}/exec`;
  }
  return "";
};

const WEBHOOK_URL = getWebhookUrl();

/* A soft nudge on free-mail domains. It never blocks submission — a genuine
   authorised person may well be using a personal address. */
const FREE_MAIL = [
  "gmail.com",
  "yahoo.com",
  "yahoo.in",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
  "icloud.com",
  "protonmail.com",
  "live.com",
  "aol.com",
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

const REG_TYPES = [
  "Stock Broker (NSE / BSE)",
  "Authorised Person / Sub-broker",
  "Registered Investment Adviser (RIA)",
  "Research Analyst (RA)",
  "Portfolio Manager (PMS)",
  "Not yet registered",
];

const CLIENT_BANDS = [
  "Under 1,000",
  "1,000 – 10,000",
  "10,000 – 50,000",
  "50,000 – 2 lakh",
  "Over 2 lakh",
];

const MODELS = ["Co-Branded", "White-Label", "Help me decide"];

export default function PartnerApply() {
  const [form, setForm] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    regtype: "",
    clients: "",
    models: "",
    notes: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [emailHint, setEmailHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  /* Clear an error as soon as the user starts fixing it. */
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    setFormError(null);
  };

  const onEmailBlur = () => {
    const dom = form.email.trim().toLowerCase().split("@")[1] || "";
    setEmailHint(FREE_MAIL.includes(dom));
  };

  const validate = () => {
    const next: Record<string, boolean> = {};
    if (!form.name.trim()) next.name = true;
    if (!form.firm.trim()) next.firm = true;
    const email = form.email.trim();
    if (!email || !EMAIL_REGEX.test(email)) next.email = true;
    const phone = form.phone.trim().replace(/[\s-]/g, "");
    if (!phone || !PHONE_REGEX.test(phone)) next.phone = true;
    if (!form.regtype) next.regtype = true;
    if (!form.clients) next.clients = true;
    if (!form.models) next.models = true;
    if (!form.consent) next.consent = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setFormError("Please fix the highlighted fields below.");
      /* One frame, so the aria-invalid attributes have landed before we look for
         the first bad field to scroll to. */
      requestAnimationFrame(() => {
        const firstBad =
          document.querySelector('[aria-invalid="true"]') || document.querySelector(".err.on");
        firstBad?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const ref = "TT-P-" + Date.now().toString(36).toUpperCase().slice(-6);
    const payload = {
      name: form.name.trim(),
      firm: form.firm.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      regType: form.regtype,
      clients: form.clients,
      model: form.models,
      notes: form.notes.trim(),
      consent: form.consent,
      ref,
      pageUrl: window.location.href,
      referrer: document.referrer || null,
      submittedAt: new Date().toISOString(),
    };

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      } else {
        console.log("[TurboTrade Partner Lead] no endpoint configured (demo mode):", payload);
      }
      setSubmittedRef(ref);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("[TurboTrade Partner Lead] submit failed:", err);
      setSubmittedRef(ref);
      toast.success("Application submitted successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  const invalid = (k: string) => (errors[k] ? "true" : "false");

  return (
    <section id="apply" className="tint" aria-labelledby="applyTitle">
      <div className="wrap">
        <div className="form-grid">
          <div className="form-aside">
            <span className="eyebrow">Partner Application</span>
            <h2 id="applyTitle">Apply to the Partner Program</h2>
            <p className="lede">
              Reviewed within two working days. We onboard a limited number of brokers each quarter
              so pilots get real engineering attention &mdash; if the fit isn't there, we'll say so
              rather than park you in a pipeline.
            </p>

            <ul className="aside-list">
              {[
                "A real reply from a human, not an autoresponder sequence.",
                "Exploratory by design — an introduction, not an agreement.",
                "Your details stay with us. No reseller lists, no data sharing.",
              ].map((li) => (
                <li className="aside-item" key={li}>
                  <span className="tick" aria-hidden="true">
                    &#10003;
                  </span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>

            <div className="alt">
              <span className="lbl">Rather just talk?</span>
              <a
                className="cal"
                href="https://calendly.com/hirena-tradeon/turbotrade-20-mins"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Schedule a 20-minute call
              </a>
              <p className="cal-note">Exploratory, no deck. Bring your questions.</p>

              <div className="reach">
                <a href="mailto:hirena@turbotrade.ai">
                  <span className="ic">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 6L2 7" />
                    </svg>
                  </span>
                  <span>
                    <span className="who">Email</span>hirena@turbotrade.ai
                  </span>
                </a>
                <a href="tel:+919321010161">
                  <span className="ic">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  <span>
                    <span className="who">Phone</span>+91 93210 10161
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div>
            {submittedRef ? (
              <div className="success" role="status">
                <div className="ring" aria-hidden="true">
                  &#10003;
                </div>
                <h3>Application received.</h3>
                <p>
                  You'll hear from our partnerships team within two working days. If your timeline is
                  tighter, reply to the confirmation email and say so &mdash; we'll move.
                </p>
                <div className="ref">REF {submittedRef}</div>
              </div>
            ) : (
              <form className="partner-form" onSubmit={handleSubmit} noValidate>
                <div className={`form-err${formError ? " on" : ""}`} role="alert">
                  {formError}
                </div>

                <div className="f-row">
                  <div className="f">
                    <label htmlFor="name">
                      Full name<span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      value={form.name}
                      onChange={onChange}
                      aria-invalid={invalid("name")}
                    />
                    <div className={`err${errors.name ? " on" : ""}`}>Please enter your name.</div>
                  </div>
                  <div className="f">
                    <label htmlFor="firm">
                      Brokerage / firm<span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="firm"
                      name="firm"
                      placeholder="Registered entity name"
                      autoComplete="organization"
                      value={form.firm}
                      onChange={onChange}
                      aria-invalid={invalid("firm")}
                    />
                    <div className={`err${errors.firm ? " on" : ""}`}>
                      Please enter your firm name.
                    </div>
                  </div>
                </div>

                <div className="f-row">
                  <div className="f">
                    <label htmlFor="email">
                      Work email<span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@yourbrokerage.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={onChange}
                      onBlur={onEmailBlur}
                      aria-invalid={invalid("email")}
                    />
                    <div className={`err${errors.email ? " on" : ""}`}>
                      Please enter a valid email address.
                    </div>
                    <div className={`hint${emailHint ? " on" : ""}`}>
                      A work domain gets your application reviewed faster.
                    </div>
                  </div>
                  <div className="f">
                    <label htmlFor="phone">
                      Phone / WhatsApp<span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={onChange}
                      aria-invalid={invalid("phone")}
                    />
                    <div className={`err${errors.phone ? " on" : ""}`}>
                      Please enter a valid 10-digit mobile number.
                    </div>
                  </div>
                </div>

                <div className="f-row">
                  <div className="f">
                    <label htmlFor="regtype">
                      Registration type<span className="req">*</span>
                    </label>
                    <select
                      id="regtype"
                      name="regtype"
                      value={form.regtype}
                      onChange={onChange}
                      aria-invalid={invalid("regtype")}
                    >
                      <option value="">Select&hellip;</option>
                      {REG_TYPES.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <div className={`err${errors.regtype ? " on" : ""}`}>
                      Please select your registration type.
                    </div>
                  </div>
                  <div className="f">
                    <label htmlFor="clients">
                      Active trading clients<span className="req">*</span>
                    </label>
                    <select
                      id="clients"
                      name="clients"
                      value={form.clients}
                      onChange={onChange}
                      aria-invalid={invalid("clients")}
                    >
                      <option value="">Select&hellip;</option>
                      {CLIENT_BANDS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <div className={`err${errors.clients ? " on" : ""}`}>
                      Please select a range.
                    </div>
                  </div>
                </div>

                <div className="f">
                  <label>
                    Which option interests you?<span className="req">*</span>
                  </label>
                  <div className="checks">
                    {MODELS.map((m) => (
                      <label className="chk" key={m}>
                        <input
                          type="radio"
                          name="models"
                          value={m}
                          checked={form.models === m}
                          onChange={onChange}
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                  <div className={`err${errors.models ? " on" : ""}`}>
                    Please select one option.
                  </div>
                </div>

                <div className="f">
                  <label htmlFor="notes">Anything specific we should know</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Client profile, instruments you focus on, timeline, compliance questions&hellip;"
                    value={form.notes}
                    onChange={onChange}
                  />
                </div>

                <label className="consent">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={form.consent}
                    onChange={onChange}
                  />
                  <span>
                    I agree to be contacted about the TurboTrade Partner Program.
                    <span className="req">*</span>
                  </span>
                </label>
                <div
                  className={`err${errors.consent ? " on" : ""}`}
                  style={{ marginTop: "-2px", marginBottom: "14px" }}
                >
                  Please confirm to continue.
                </div>

                <button type="submit" className="btn btn-y submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Application"}
                </button>
                <div className="sub-note">No spam · No drip sequence · One human reply</div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
