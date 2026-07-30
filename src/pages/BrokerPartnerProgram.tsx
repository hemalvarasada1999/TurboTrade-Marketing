import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Default or fallback Google Sheet Webhook URL from environment variables
const getWebhookUrl = (): string => {
  const envUrl = import.meta.env.VITE_GOOGLE_SHEET_URL || import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim();
  }
  const deploymentId = import.meta.env.VITE_GOOGLE_SHEET_DEPLOYMENT_ID;
  if (deploymentId && deploymentId.trim() !== "") {
    return `https://script.google.com/macros/s/${deploymentId.trim()}/exec`;
  }
  return "";
};

const DEFAULT_WEBHOOK_URL = getWebhookUrl();

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

const BrokerPartnerProgram: React.FC = () => {
  const [webhookUrl] = useState<string>(DEFAULT_WEBHOOK_URL);

  const [formData, setFormData] = useState({
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
  const [showEmailHint, setShowEmailHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEmailBlur = () => {
    const v = formData.email.trim().toLowerCase();
    const dom = v.split("@")[1] || "";
    setShowEmailHint(FREE_MAIL.includes(dom));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
    setFormError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let ok = true;

    if (!formData.name.trim()) {
      newErrors.name = true;
      ok = false;
    }
    if (!formData.firm.trim()) {
      newErrors.firm = true;
      ok = false;
    }

    const cleanEmail = formData.email.trim();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      newErrors.email = true;
      ok = false;
    }

    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, "");
    if (!cleanPhone || !PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone = true;
      ok = false;
    }

    if (!formData.regtype) {
      newErrors.regtype = true;
      ok = false;
    }

    if (!formData.clients) {
      newErrors.clients = true;
      ok = false;
    }

    if (!formData.models) {
      newErrors.models = true;
      ok = false;
    }

    if (!formData.consent) {
      newErrors.consent = true;
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const generateRefCode = () => {
    return "TT-P-" + Date.now().toString(36).toUpperCase().slice(-6);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setFormError("Please fix the highlighted fields below.");
      const firstBad = document.querySelector('[aria-invalid="true"]') || document.querySelector(".err.on");
      if (firstBad) {
        firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const refCode = generateRefCode();
    const payload = {
      name: formData.name.trim(),
      firm: formData.firm.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      regType: formData.regtype,
      clients: formData.clients,
      model: formData.models,
      notes: formData.notes.trim(),
      consent: formData.consent,
      ref: refCode,
      pageUrl: window.location.href,
      referrer: document.referrer || null,
      submittedAt: new Date().toISOString(),
    };

    try {
      if (webhookUrl && webhookUrl.trim() !== "") {
        await fetch(webhookUrl.trim(), {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        });
      } else {
        console.log("[TurboTrade Partner Lead] Submitted Payload (Demo Mode):", payload);
      }

      setSubmittedRef(refCode);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmittedRef(refCode);
      toast.success("Application submitted successfully!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="broker-partner-page">
      <style>{`
        /* =========================================================================
           TurboTrade.ai — Broker Partner Program Theme Styles
           ========================================================================= */
        .broker-partner-page {
          --bg:#ffffff;
          --muted:#f8fafc;
          --muted-2:#f1f5f9;
          --navy:#0f1729;
          --gold:#efbd3e;
          --goldenrod:#cf9117;
          --gold-wash:#fdf6e3;
          --slate:#65758b;
          --slate-light:#94a3b8;
          --border:#e6eaf0;
          --border-soft:#f0f2f5;
          --danger:#e63946;
          --radius:.5rem;
          --radius-lg:.75rem;
          --slab:'Roboto Slab',Georgia,serif;
          --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;
          --maxw:1140px;
          --shadow-sm:0 1px 2px rgba(15,23,41,.04),0 1px 3px rgba(15,23,41,.06);
          --shadow:0 4px 6px -1px rgba(15,23,41,.05),0 10px 24px -8px rgba(15,23,41,.10);
          --shadow-lg:0 20px 50px -18px rgba(15,23,41,.18);
          background: var(--bg);
          color: var(--navy);
          font-family: var(--sans);
          font-size: 16px;
          line-height: 1.6;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .broker-partner-page .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
        .broker-partner-page a { color: inherit; text-decoration: none; }
        .broker-partner-page em { font-style: normal; }

        .broker-partner-page h1,
        .broker-partner-page h2,
        .broker-partner-page h3,
        .broker-partner-page h4 { font-family: var(--slab); color: var(--navy); font-weight: 700; letter-spacing: -.025em; line-height: 1.1; }
        .broker-partner-page h1 { font-size: clamp(2.2rem,5.2vw,4.1rem); letter-spacing: -.028em; }
        .broker-partner-page h2 { font-size: clamp(1.6rem,3.4vw,2.5rem); }
        .broker-partner-page h3 { font-size: 1.18rem; letter-spacing: -.015em; }
        .broker-partner-page h4 { font-size: .98rem; letter-spacing: -.01em; }
        .broker-partner-page p { color: var(--slate); }
        .broker-partner-page .eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: .22em; text-transform: uppercase; color: var(--goldenrod); }
        .broker-partner-page .lead { font-size: clamp(1rem,1.45vw,1.1rem); color: var(--slate); line-height: 1.65; }
        .broker-partner-page .strike { color: var(--slate); text-decoration: line-through; text-decoration-thickness: .06em; }
        .broker-partner-page .gold-t { color: var(--goldenrod); }

        .broker-partner-page .sec-head { text-align: center; max-width: 700px; margin: 0 auto 40px; }
        .broker-partner-page .sec-head .eyebrow { display: block; margin-bottom: 14px; }
        .broker-partner-page .sec-head h2 { margin-bottom: 14px; }
        .broker-partner-page .sec-head .lead { margin: 0 auto; max-width: 58ch; }
        .broker-partner-page section { padding: 68px 0; position: relative; }
        .broker-partner-page .sec-muted { background: var(--muted); border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); }

        /* buttons */
        .broker-partner-page .btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; font-weight: 700; font-size: 15px; padding: 14px 26px; border-radius: var(--radius); border: 1px solid transparent; cursor: pointer; transition: transform .18s,box-shadow .18s,background .18s,border-color .18s; }
        .broker-partner-page .btn-1 { background: var(--gold); color: var(--navy); }
        .broker-partner-page .btn-1:hover { background: #e8b12b; transform: translateY(-2px); box-shadow: 0 12px 28px -10px rgba(207,145,23,.55); }
        .broker-partner-page .btn-2 { background: #fff; color: var(--navy); border-color: var(--border); }
        .broker-partner-page .btn-2:hover { border-color: var(--gold); background: var(--gold-wash); }

        /* hero */
        .broker-partner-page .hero { padding: 64px 0 72px; }
        .broker-partner-page .hero-grid { display: grid; grid-template-columns: 1.06fr .94fr; gap: 56px; align-items: center; }
        .broker-partner-page .hero h1 { margin: 18px 0 22px; }
        .broker-partner-page .hero h1 span { display: block; }
        .broker-partner-page .hero .lead { max-width: 52ch; }
        .broker-partner-page .cta-row { display: flex; flex-wrap: wrap; gap: 13px; margin: 28px 0 26px; }
        .broker-partner-page .trust { display: flex; flex-wrap: wrap; gap: 8px; }
        .broker-partner-page .chip { font-family: var(--mono); font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase; color: var(--navy); background: #fff; border: 1px solid var(--border); border-radius: 100px; padding: 6px 13px; display: inline-flex; align-items: center; gap: 7px; }
        .broker-partner-page .chip i { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex: none; }

        /* demand signal panel */
        .broker-partner-page .signal { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; }
        .broker-partner-page .signal-top { background: var(--navy); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
        .broker-partner-page .signal-top .t { font-family: var(--mono); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
        .broker-partner-page .signal-top .s { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; color: var(--slate-light); }
        .broker-partner-page .signal-body { padding: 26px 24px 22px; }
        .broker-partner-page .srow { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 8px; }
        .broker-partner-page .srow .yr { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; color: var(--slate); text-transform: uppercase; }
        .broker-partner-page .srow .fig { font-family: var(--slab); font-weight: 700; color: var(--navy); letter-spacing: -.03em; line-height: 1; }
        .broker-partner-page .srow.a .fig { font-size: 1.5rem; color: var(--slate); }
        .broker-partner-page .srow.b .fig { font-size: 2.9rem; color: var(--goldenrod); }
        .broker-partner-page .track { height: 8px; background: var(--muted-2); border-radius: 100px; overflow: hidden; margin-bottom: 22px; }
        .broker-partner-page .track i { display: block; height: 100%; border-radius: 100px; background: var(--gold); }
        .broker-partner-page .track.thin i { width: 7%; }
        .broker-partner-page .track i.full { width: 100%; }
        .broker-partner-page .sdelta {
          display: flex; align-items: baseline; gap: 10px; padding: 14px 16px; background: var(--gold-wash);
          border: 1px solid rgba(207,145,23,.22); border-radius: var(--radius); margin-bottom: 16px;
        }
        .broker-partner-page .sdelta b { font-family: var(--slab); font-size: 1.5rem; font-weight: 700; color: var(--goldenrod); letter-spacing: -.03em; line-height: 1; }
        .broker-partner-page .sdelta span { font-size: .85rem; color: var(--slate); line-height: 1.45; }
        .broker-partner-page .snote { font-size: .82rem; color: var(--slate-light); line-height: 1.55; }
        .broker-partner-page .signal-foot { padding: 16px 20px; background: var(--navy); font-family: var(--slab); font-size: 13.5px; font-weight: 600; color: #fff; line-height: 1.5; }
        .broker-partner-page .signal-foot em { color: var(--gold); font-weight: 700; }

        /* recommended option emphasis */
        .broker-partner-page .model.feat { border-top-width: 4px; border-top-color: var(--goldenrod); box-shadow: var(--shadow); }
        .broker-partner-page .rec {
          display: inline-block; font-family: var(--sans); font-weight: 700; font-size: 9.5px; letter-spacing: .09em;
          text-transform: uppercase; background: var(--gold); color: var(--navy); border-radius: 4px;
          padding: 3px 8px; margin-left: 9px; vertical-align: middle;
        }

        /* conflict (navy) */
        .broker-partner-page .conflict { background: var(--navy); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); }
        .broker-partner-page .conflict-top { padding: 36px 38px 28px; border-bottom: 1px solid rgba(255,255,255,.09); }
        .broker-partner-page .conflict-top .eyebrow { display: block; margin-bottom: 13px; color: var(--gold); }
        .broker-partner-page .conflict-q { font-family: var(--slab); font-size: clamp(1.4rem,2.9vw,2.1rem); font-weight: 700; color: #fff; letter-spacing: -.025em; line-height: 1.18; margin-bottom: 16px; }
        .broker-partner-page .conflict-a { font-size: 1.04rem; color: #c9d2e0; line-height: 1.66; max-width: 68ch; }
        .broker-partner-page .conflict-a b { color: var(--gold); font-weight: 600; }
        .broker-partner-page .cgrid { display: grid; grid-template-columns: repeat(2,1fr); }
        .broker-partner-page .cg { padding: 22px 38px; border-right: 1px solid rgba(255,255,255,.09); border-bottom: 1px solid rgba(255,255,255,.09); }
        .broker-partner-page .cg:nth-child(2n) { border-right: none; }
        .broker-partner-page .cg:nth-last-child(-n+2) { border-bottom: none; }
        .broker-partner-page .cg h4 { color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .broker-partner-page .cg p { font-size: .88rem; color: #a8b4c6; line-height: 1.6; }
        .broker-partner-page .tick { width: 18px; height: 18px; border-radius: 50%; flex: none; display: grid; place-items: center; background: var(--gold); color: var(--navy); font-size: 10px; font-weight: 800; font-family: var(--sans); }
        .broker-partner-page .conflict-foot { padding: 22px 38px; background: rgba(255,255,255,.04); border-top: 1px solid rgba(255,255,255,.09); font-size: .95rem; color: #c9d2e0; }
        .broker-partner-page .conflict-foot b { color: #fff; font-weight: 600; }

        /* models — two options */
        .broker-partner-page .models { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
        .broker-partner-page .model { display: flex; flex-direction: column; background: #fff; border: 1px solid var(--border-soft); border-top: 3px solid var(--gold); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform .22s,box-shadow .22s; }
        .broker-partner-page .model:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
        .broker-partner-page .model-top { padding: 26px 26px 0; }
        .broker-partner-page .model-id { font-family: var(--mono); font-size: 11px; letter-spacing: .18em; color: var(--slate-light); margin-bottom: 11px; }
        .broker-partner-page .model h3 { font-size: 1.28rem; margin-bottom: 11px; }
        .broker-partner-page .model-meta { display: inline-block; font-family: var(--mono); font-size: 10.5px; letter-spacing: .11em; text-transform: uppercase; color: var(--goldenrod); background: var(--gold-wash); border: 1px solid rgba(207,145,23,.22); border-radius: 5px; padding: 5px 10px; margin-bottom: 16px; }
        .broker-partner-page .model p { font-size: .93rem; line-height: 1.68; padding: 0 26px 18px; }
        .broker-partner-page .model-best { margin-top: auto; padding: 16px 26px; background: var(--muted); border-top: 1px solid var(--border-soft); font-size: .85rem; color: var(--slate); line-height: 1.6; }
        .broker-partner-page .model-best b { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--navy); margin-bottom: 6px; }
        .broker-partner-page .models-foot { text-align: center; margin-top: 24px; font-size: .93rem; color: var(--slate); }

        /* compact proof list */
        .broker-partner-page .proof { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius); overflow: hidden; max-width: 960px; margin: 0 auto; }
        .broker-partner-page .pi { background: #fff; padding: 20px 24px; display: flex; gap: 13px; align-items: baseline; }
        .broker-partner-page .pi i { font-family: var(--mono); font-style: normal; font-size: 10.5px; letter-spacing: .1em; color: var(--goldenrod); flex: none; padding-top: 2px; }
        .broker-partner-page .pi b { font-family: var(--slab); font-weight: 600; color: var(--navy); font-size: .95rem; display: block; margin-bottom: 3px; }
        .broker-partner-page .pi span { font-size: .86rem; color: var(--slate); line-height: 1.55; }

        /* regulatory slim band */
        .broker-partner-page .reg { background: #fff; border: 1px solid var(--border-soft); border-left: 3px solid var(--gold); border-radius: var(--radius); padding: 26px 30px; box-shadow: var(--shadow-sm); max-width: 820px; margin: 0 auto; }
        .broker-partner-page .reg p { line-height: 1.72; font-size: .96rem; }
        .broker-partner-page .reg p+p { margin-top: 12px; }
        .broker-partner-page .reg b { color: var(--navy); font-weight: 600; }

        /* faq */
        .broker-partner-page .faq { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid var(--border-soft); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); }
        .broker-partner-page details { border-bottom: 1px solid var(--border-soft); }
        .broker-partner-page details:last-child { border-bottom: none; }
        .broker-partner-page summary { padding: 19px 26px; cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 18px; align-items: center; font-family: var(--slab); font-weight: 600; font-size: .97rem; color: var(--navy); transition: background .18s,color .18s; }
        .broker-partner-page summary::-webkit-details-marker { display: none; }
        .broker-partner-page summary:hover { background: var(--muted); color: var(--goldenrod); }
        .broker-partner-page summary::after { content: '+'; font-family: var(--mono); font-size: 1.2rem; color: var(--goldenrod); flex: none; transition: transform .22s; }
        .broker-partner-page details[open] summary { color: var(--goldenrod); background: var(--muted); }
        .broker-partner-page details[open] summary::after { transform: rotate(45deg); }
        .broker-partner-page .faq-a { padding: 2px 26px 20px; font-size: .91rem; color: var(--slate); line-height: 1.72; }

        /* form */
        .broker-partner-page .form-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 52px; align-items: start; }
        .broker-partner-page .form-aside .eyebrow { display: block; margin-bottom: 14px; }
        .broker-partner-page .form-aside h2 { margin-bottom: 14px; }
        .broker-partner-page .form-aside .lead { font-size: .98rem; margin-bottom: 24px; }
        .broker-partner-page .aside-list { display: grid; gap: 12px; }
        .broker-partner-page .aside-item { display: flex; gap: 12px; font-size: .88rem; color: var(--slate); line-height: 1.55; }
        .broker-partner-page .aside-item .tick { margin-top: 2px; }

        /* alternative contact paths beside the form */
        .broker-partner-page .alt { margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--border); }
        .broker-partner-page .alt .lbl { font-family: var(--mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--slate-light); display: block; margin-bottom: 14px; }
        .broker-partner-page .cal {
          display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
          background: var(--navy); color: #fff; font-weight: 700; font-size: 14.5px; padding: 14px 20px;
          border-radius: var(--radius); transition: background .18s,transform .18s,box-shadow .18s;
        }
        .broker-partner-page .cal:hover { background: #1c2740; transform: translateY(-2px); box-shadow: 0 12px 26px -12px rgba(15,23,41,.5); }
        .broker-partner-page .cal svg { flex: none; }
        .broker-partner-page .cal-note { font-size: .8rem; color: var(--slate-light); text-align: center; margin-top: 9px; line-height: 1.5; }
        .broker-partner-page .reach { display: grid; gap: 10px; margin-top: 22px; }
        .broker-partner-page .reach a { display: flex; align-items: center; gap: 11px; font-size: .9rem; color: var(--navy); transition: color .18s; }
        .broker-partner-page .reach a:hover { color: var(--goldenrod); }
        .broker-partner-page .reach .ic {
          width: 30px; height: 30px; border-radius: 50%; flex: none; display: grid; place-items: center;
          background: var(--gold-wash); border: 1px solid rgba(207,145,23,.22); color: var(--goldenrod);
        }
        .broker-partner-page .reach .ic svg { display: block; }
        .broker-partner-page .reach .who { font-family: var(--mono); font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--slate-light); display: block; margin-bottom: 1px; }
        .broker-partner-page form { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 30px; box-shadow: var(--shadow-lg); }
        .broker-partner-page .f-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .broker-partner-page .f { margin-bottom: 16px; }
        .broker-partner-page label { display: block; font-family: var(--mono); font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--navy); margin-bottom: 8px; }
        .broker-partner-page label .req { color: var(--goldenrod); margin-left: 3px; }
        .broker-partner-page input[type=text],
        .broker-partner-page input[type=email],
        .broker-partner-page input[type=tel],
        .broker-partner-page select,
        .broker-partner-page textarea { width: 100%; background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 14px; color: var(--navy); font-family: var(--sans); font-size: .94rem; transition: border-color .18s,box-shadow .18s; appearance: none; }
        .broker-partner-page select { background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%2365758b' d='M6 8 0 0h12z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }
        .broker-partner-page textarea { resize: vertical; min-height: 76px; line-height: 1.6; }
        .broker-partner-page input::placeholder,
        .broker-partner-page textarea::placeholder { color: var(--slate-light); }
        .broker-partner-page input:focus,
        .broker-partner-page select:focus,
        .broker-partner-page textarea:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(239,189,62,.22); }
        .broker-partner-page input[aria-invalid=true],
        .broker-partner-page select[aria-invalid=true] { border-color: var(--danger); }
        .broker-partner-page .err { display: none; font-family: var(--mono); font-size: 10.5px; color: var(--danger); margin-top: 6px; letter-spacing: .03em; }
        .broker-partner-page .err.on { display: block; }
        .broker-partner-page .hint { display: none; font-family: var(--mono); font-size: 10px; color: var(--goldenrod); margin-top: 6px; letter-spacing: .03em; }
        .broker-partner-page .hint.on { display: block; }
        .broker-partner-page .checks { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 9px; }
        .broker-partner-page .chk { display: flex; gap: 10px; align-items: flex-start; background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 13px; cursor: pointer; font-size: .85rem; color: var(--slate); line-height: 1.4; transition: border-color .18s,background .18s,color .18s; }
        .broker-partner-page .chk:hover { border-color: var(--gold); }
        .broker-partner-page .chk input,
        .broker-partner-page .consent input { appearance: none; width: 17px; height: 17px; flex: none; margin-top: 1px; border: 1px solid var(--border); border-radius: 4px; background: #fff; cursor: pointer; position: relative; transition: .18s; }
        .broker-partner-page .chk input:checked,
        .broker-partner-page .consent input:checked { background: var(--gold); border-color: var(--gold); }
        .broker-partner-page .chk input:checked::after,
        .broker-partner-page .consent input:checked::after { content: '✓'; position: absolute; inset: 0; display: grid; place-items: center; color: var(--navy); font-size: 11px; font-weight: 800; }
        /* single-select: round affordance so it reads as "pick one" */
        .broker-partner-page .chk input[type=radio] { border-radius: 50%; }
        .broker-partner-page .chk input[type=radio]:checked::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: var(--navy); }
        .broker-partner-page .chk:has(input:checked) { border-color: var(--gold); background: var(--gold-wash); color: var(--navy); }
        .broker-partner-page .consent { display: flex; gap: 12px; align-items: flex-start; font-size: .86rem; color: var(--slate); line-height: 1.5; margin: 4px 0 6px; }
        .broker-partner-page .submit { width: 100%; padding: 15px; font-size: 15px; }
        .broker-partner-page .submit:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
        .broker-partner-page .sub-note { font-family: var(--mono); font-size: 10px; color: var(--slate-light); letter-spacing: .1em; text-transform: uppercase; text-align: center; margin-top: 13px; }
        .broker-partner-page .form-err { display: none; background: #fdf0f1; border: 1px solid #f5c6cb; border-radius: var(--radius); padding: 12px 14px; font-size: .87rem; color: #a4232f; margin-bottom: 18px; }
        .broker-partner-page .form-err.on { display: block; }
        .broker-partner-page .success { display: none; text-align: center; padding: 52px 30px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); }
        .broker-partner-page .success.on { display: block; }
        .broker-partner-page .success .ring { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; background: var(--gold); display: grid; place-items: center; color: var(--navy); font-size: 27px; font-weight: 800; animation: pop .45s cubic-bezier(.2,1.5,.4,1); }
        @keyframes pop { 0% { transform: scale(.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .broker-partner-page .success h3 { font-size: 1.5rem; margin-bottom: 12px; }
        .broker-partner-page .success p { font-size: .94rem; max-width: 44ch; margin: 0 auto; line-height: 1.7; }
        .broker-partner-page .success .ref { display: inline-block; font-family: var(--mono); font-size: 11px; color: var(--slate); margin-top: 20px; letter-spacing: .14em; border: 1px dashed var(--border); border-radius: var(--radius); padding: 9px 14px; }

        @media (max-width:1020px){
          .broker-partner-page .hero-grid,
          .broker-partner-page .form-grid { grid-template-columns: 1fr; gap: 44px; }
          .broker-partner-page .models,
          .broker-partner-page .proof { grid-template-columns: 1fr; }
          .broker-partner-page section { padding: 56px 0; }
          .broker-partner-page .conflict-top,
          .broker-partner-page .cg,
          .broker-partner-page .conflict-foot { padding-left: 26px; padding-right: 26px; }
          .broker-partner-page .conflict-top { padding-top: 30px; }
        }
        @media (max-width:640px){
          .broker-partner-page .wrap { padding: 0 18px; }
          .broker-partner-page .cgrid { grid-template-columns: 1fr; }
          .broker-partner-page .cg { border-right: none!important; }
          .broker-partner-page .cg:nth-last-child(2) { border-bottom: 1px solid rgba(255,255,255,.09); }
          .broker-partner-page .f-row,
          .broker-partner-page .checks { grid-template-columns: 1fr; }
          .broker-partner-page form { padding: 22px 18px; }
          .broker-partner-page .reg { padding: 22px 20px; }
          .broker-partner-page .btn { width: 100%; }
          .broker-partner-page .brand-tag { display: none; }
        }
      `}</style>

      <Header />

      {/* ============================== HERO ============================== */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">For SEBI-Registered Brokers &amp; Authorised Persons</span>
              <h1>
                <span className="gold-t">Launch Algo Trading.</span>
                <span className="strike">Build an Algo Desk.</span>
              </h1>
              <p className="lead">
                Your clients are switching brokers to get automation. Offer it under{" "}
                <em style={{ color: "var(--navy)", fontWeight: 600 }}>your own brand</em> — SEBI-registered strategies,
                exchange-compliant execution, institutional risk controls. No quant team. No client ever leaves your books.
              </p>
              <div className="cta-row">
                <a href="#apply" className="btn btn-1">
                  Apply to the Partner Program
                </a>
                <a href="#models" className="btn btn-2">
                  See the two models
                </a>
              </div>
              <div className="trust">
                <span className="chip">
                  <i></i>SEBI-Registered Research Analyst
                </span>
                <span className="chip">
                  <i></i>Exchange Empanelled
                </span>
                <span className="chip">
                  <i></i>Funds Stay in Client Demat
                </span>
              </div>
            </div>

            <div className="signal">
              <div className="signal-top">
                <span className="t">Demand for Retail Algo</span>
                <span className="s">INDIVIDUAL F&amp;O TRADERS · INDIA</span>
              </div>
              <div className="signal-body">
                <div className="srow a">
                  <span className="yr">FY19</span>
                  <span className="fig">7 lakh</span>
                </div>
                <div className="track thin">
                  <i></i>
                </div>

                <div className="srow b">
                  <span className="yr">FY25</span>
                  <span className="fig">~1 crore</span>
                </div>
                <div className="track">
                  <i className="full"></i>
                </div>

                <div className="sdelta">
                  <b>+1,200%</b>
                  <span>growth in six years. Algo tooling went from niche to table stakes in the same window.</span>
                </div>
                <p className="snote">
                  Your most active clients already expect automation as standard. If you don't offer it, they get it elsewhere
                  — from a broker who does.
                </p>
              </div>
              <div className="signal-foot">
                The demand is already here. Building for it takes quarters — <em>plugging into it takes weeks</em>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== CHANNEL CONFLICT ============================== */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="conflict">
            <div className="conflict-top">
              <span className="eyebrow">What Stays Yours</span>
              <div className="conflict-q">Your capital. Your order flow. Your brokerage.</div>
              <p className="conflict-a">
                We're a technology and strategy provider, not a trading destination.{" "}
                <b>Nothing in this partnership moves money or reroutes a single order.</b>
              </p>
            </div>
            <div className="cgrid">
              <div className="cg">
                <h4>
                  <span className="tick">✓</span>We never touch capital
                </h4>
                <p>
                  Funds and securities stay in the client's demat account with you. No custody, no pool account, no money
                  movement.
                </p>
              </div>
              <div className="cg">
                <h4>
                  <span className="tick">✓</span>Every order routes through you
                </h4>
                <p>
                  We generate signals and manage execution logic. Order flow, brokerage and the exchange relationship stay
                  yours.
                </p>
              </div>
            </div>
            <div className="conflict-foot">
              <b>We make money when your clients trade more on your platform.</b> Our upside and yours point in the same direction.
            </div>
          </div>
        </div>
      </section>

      {/* ============================== TWO MODELS ============================== */}
      <section id="models" className="sec-muted">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Two Ways In</span>
            <h2>Start Co-Branded. Go White-Label When the Numbers Justify It.</h2>
          </div>
          <div className="models">
            <div className="model feat">
              <div className="model-top">
                <div className="model-id">
                  OPTION_01 <span className="rec">Most partners start here</span>
                </div>
                <h3>Co-Branded</h3>
                <span className="model-meta">Fastest Launch · Revenue Share</span>
              </div>
              <p>
                We supply the strategies, you distribute them to your client base. TurboTrade stays visible as the research and
                execution provider, so our SEBI RA registration does the credibility work for you. Lightest integration, quickest
                proof of demand.
              </p>
              <div className="model-best">
                <b>Best For</b>Finding out whether your clients pay for automation before you invest in anything.
              </div>
            </div>
            <div className="model">
              <div className="model-top">
                <div className="model-id">OPTION_02</div>
                <h3>White-Label</h3>
                <span className="model-meta">Your Brand End-to-End · Revenue Share</span>
              </div>
              <p>
                A complete algo storefront inside your app or terminal — your brand, your pricing. Clients browse, subscribe,
                authorise and monitor without ever seeing our name. We run the engine, the research and the strategy roadmap. You own
                the client and the P&amp;L line.
              </p>
              <div className="model-best">
                <b>Best For</b>Making automation a reason people choose you, not a feature you merely have.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== PROOF ============================== */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Already Running in Production</span>
            <h2>What You'd Be Plugging Into.</h2>
          </div>
          <div className="proof">
            <div className="pi">
              <i>01</i>
              <span>
                <b>An in-house quant research desk</b>Our team continuously builds, tests and retires strategies as volatility and market
                regimes shift — so your clients aren't left running a model that only worked in a market that's gone.
              </span>
            </div>
            <div className="pi">
              <i>02</i>
              <span>
                <b>Institutional risk controls</b>Position sizing, per-client exposure caps, and kill switches that act at the engine
                level.
              </span>
            </div>
            <div className="pi">
              <i>03</i>
              <span>
                <b>Systematic SL/TP on every strategy</b>Pre-defined exits executed mechanically. No discretion, no dispute afterwards.
              </span>
            </div>
            <div className="pi">
              <i>04</i>
              <span>
                <b>Compliance and security by design</b>Built around SEBI's algo framework from the ground up rather than retrofitted
                before an inspection — order tagging, audit trails and AES-256 key handling are structural, not add-ons.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== REGULATORY ============================== */}
      <section className="sec-muted">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">The Regulatory Reality</span>
            <h2>SEBI Put Brokers at the Centre of Retail Algo.</h2>
          </div>
          <div className="reg">
            <p>
              Algos routed through you, registered with the exchange, uniquely tagged and auditable.{" "}
              <b>You carry that obligation either way</b> — the only question is whether you carry it for a third-party vendor's
              product or for your own revenue line.
            </p>
            <p>
              We built for that structure rather than around it. TurboTrade operates as a{" "}
              <b>SEBI-Registered Research Analyst</b> and an <b>exchange-empanelled algo provider</b>. Bring your compliance officer to
              the first call.
            </p>
          </div>
        </div>
      </section>

      {/* ============================== FAQ ============================== */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Straight Answers</span>
            <h2>The Objections, Handled.</h2>
          </div>
          <div className="faq">
            <details open>
              <summary>What if a strategy loses money for my clients?</summary>
              <div className="faq-a">
                Some will, in some periods — anyone claiming otherwise is selling you something. Every strategy ships with a risk
                label, disclosed drawdown characteristics, systematic stop-losses and per-client exposure caps, and client-facing
                risk disclosures come as part of the onboarding pack. We'd rather lose your deal than win it by pretending
                automation removes risk.
              </div>
            </details>
            <details>
              <summary>How long does integration take, and what does it cost?</summary>
              <div className="faq-a">
                Co-branded launches in weeks — the gateway is built and the engines are live. White-label depends on how much of your
                front end we're skinning. Both are revenue share; white-label carries an implementation fee that scales with the
                build. Exact numbers come on the call once we know your client count.
              </div>
            </details>
            <details>
              <summary>Are the strategies disclosed?</summary>
              <div className="faq-a">
                The engines are blackbox — logic isn't disclosed at strategy level. Risk parameters, instrument universe, expected
                holding period, drawdown behaviour and full execution logs are. Your compliance team gets what it needs to supervise;
                the IP stays with us.
              </div>
            </details>
            <details>
              <summary>We're a small brokerage. Are we too small?</summary>
              <div className="faq-a">
                Co-branded exists precisely for brokers who shouldn't be committing capital to this yet. Tell us your active client
                count and we'll be straight about whether the economics work — including if the answer is "not yet."
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ============================== FORM ============================== */}
      <section id="apply">
        <div className="wrap">
          <div className="form-grid">
            <div className="form-aside">
              <span className="eyebrow">Partner Application</span>
              <h2>Apply to the Partner Program</h2>
              <p className="lead">
                Reviewed within two working days. We onboard a limited number of brokers each quarter so pilots get real engineering
                attention — if the fit isn't there, we'll say so rather than park you in a pipeline.
              </p>
              <div className="aside-list">
                <div className="aside-item">
                  <span className="tick">✓</span>
                  <span>A real reply from a human, not an autoresponder sequence.</span>
                </div>
                <div className="aside-item">
                  <span className="tick">✓</span>
                  <span>Exploratory by design — an introduction, not an agreement.</span>
                </div>
                <div className="aside-item">
                  <span className="tick">✓</span>
                  <span>Your details stay with us. No reseller lists, no data sharing.</span>
                </div>
              </div>

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
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
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
                <div className="success on" id="success">
                  <div className="ring">✓</div>
                  <h3>Application received.</h3>
                  <p>
                    You'll hear from our partnerships team within two working days. If your timeline is tighter, reply to the
                    confirmation email and say so — we'll move.
                  </p>
                  <div className="ref" id="refCode">
                    REF {submittedRef}
                  </div>
                  <div style={{ marginTop: "24px" }}>
                    <button
                      type="button"
                      className="btn btn-2"
                      onClick={() => {
                        setSubmittedRef(null);
                        setFormData({
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
                        setErrors({});
                      }}
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form id="partnerForm" onSubmit={handleSubmit} noValidate>
                  <div className={`form-err ${formError ? "on" : ""}`} id="formErr">
                    {formError || "Please fix the highlighted fields below."}
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
                        value={formData.name}
                        onChange={handleInputChange}
                        aria-invalid={errors.name ? "true" : "false"}
                      />
                      <div className={`err ${errors.name ? "on" : ""}`} data-for="name">
                        Please enter your name.
                      </div>
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
                        value={formData.firm}
                        onChange={handleInputChange}
                        aria-invalid={errors.firm ? "true" : "false"}
                      />
                      <div className={`err ${errors.firm ? "on" : ""}`} data-for="firm">
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
                        placeholder="partner@example.com"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleEmailBlur}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      <div className={`err ${errors.email ? "on" : ""}`} data-for="email">
                        Please enter a valid email address.
                      </div>
                      <div className={`hint ${showEmailHint ? "on" : ""}`} id="emailHint">
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
                        placeholder="9876543210"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        aria-invalid={errors.phone ? "true" : "false"}
                      />
                      <div className={`err ${errors.phone ? "on" : ""}`} data-for="phone">
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
                        value={formData.regtype}
                        onChange={handleInputChange}
                        aria-invalid={errors.regtype ? "true" : "false"}
                      >
                        <option value="">Select…</option>
                        <option>Stock Broker (NSE / BSE)</option>
                        <option>Authorised Person / Sub-broker</option>
                        <option>Registered Investment Adviser (RIA)</option>
                        <option>Research Analyst (RA)</option>
                        <option>Portfolio Manager (PMS)</option>
                        <option>Not yet registered</option>
                      </select>
                      <div className={`err ${errors.regtype ? "on" : ""}`} data-for="regtype">
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
                        value={formData.clients}
                        onChange={handleInputChange}
                        aria-invalid={errors.clients ? "true" : "false"}
                      >
                        <option value="">Select…</option>
                        <option>Under 1,000</option>
                        <option>1,000 – 10,000</option>
                        <option>10,000 – 50,000</option>
                        <option>50,000 – 2 lakh</option>
                        <option>Over 2 lakh</option>
                      </select>
                      <div className={`err ${errors.clients ? "on" : ""}`} data-for="clients">
                        Please select a range.
                      </div>
                    </div>
                  </div>

                  <div className="f">
                    <label>
                      Which option interests you?<span className="req">*</span>
                    </label>
                    <div className="checks">
                      {["Co-Branded", "White-Label", "Help me decide"].map((opt) => (
                        <label key={opt} className="chk">
                          <input
                            type="radio"
                            name="models"
                            value={opt}
                            checked={formData.models === opt}
                            onChange={handleInputChange}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    <div className={`err ${errors.models ? "on" : ""}`} data-for="models">
                      Please select one option.
                    </div>
                  </div>

                  <div className="f">
                    <label htmlFor="notes">Anything specific we should know</label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Client profile, instruments you focus on, timeline, compliance questions…"
                      value={formData.notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <label className="consent">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                    />
                    <span>
                      I agree to be contacted about the TurboTrade Partner Program.<span className="req">*</span>
                    </span>
                  </label>
                  <div
                    className={`err ${errors.consent ? "on" : ""}`}
                    data-for="consent"
                    style={{ marginTop: "-2px", marginBottom: "14px" }}
                  >
                    Please confirm to continue.
                  </div>

                  <button type="submit" className="btn btn-1 submit" id="submitBtn" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                  </button>
                  <div className="sub-note">No spam · No drip sequence · One human reply</div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrokerPartnerProgram;
