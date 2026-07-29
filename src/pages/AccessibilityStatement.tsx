import LegalPageLayout from "@/components/LegalPageLayout";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, FileCheck, CheckCircle2, Phone } from "lucide-react";

export default function AccessibilityStatement() {
  return (
    <LegalPageLayout
      title={
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-2">
          Accessibility Statement
        </h1>
      }
      description="Commitment to WCAG 2.2 Level AA, IS 17802 & SEBI Accessibility Guidelines."
    >
      <div className="space-y-6 text-foreground/90 leading-relaxed text-xs sm:text-sm">
        {/* Commitment Badge */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Universal Access Commitment
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              TurboTrade is dedicated to ensuring digital accessibility for people of all abilities. We continuously improve the user experience for everyone and apply relevant accessibility standards across our algorithmic trading platform.
            </p>
          </div>
        </div>

        {/* Regulatory Standards & Compliance */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold font-heading text-foreground flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" /> Standards &amp; Regulatory Framework
          </h2>
          <p>
            Our website and digital interfaces are engineered to conform with the following international and statutory accessibility standards:
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
            {[
              "WCAG 2.2 Level A and Level AA Standards",
              "SEBI Circular SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/111",
              "SEBI Circular SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/131",
              "Rights of Persons with Disabilities (RPwD) Act, 2016",
              "Bureau of Indian Standards IS 17802 Accessibility Guidance",
              "Guidelines for Indian Government Websites (GIGW) Framework",
            ].map((std) => (
              <li
                key={std}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{std}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Features Implemented */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold font-heading text-foreground">
            Accessibility Controls &amp; Built-in Features
          </h2>
          <p>
            The website includes native accessibility enhancements accessible from the top navigation bar toolbar:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground text-sm">
                1. Responsive Text Resizing (WCAG 1.4.4)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Allows scaling text up to 200% without loss of content or functional layout breaks.
              </p>
            </div>

            <div className="rounded-xl border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground text-sm">
                2. High Contrast &amp; Reading Themes (WCAG 1.4.3)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Includes Site Default, High Contrast (pure black text on white canvas), Dark Reading, Warm Sepia, and Monochrome options to reduce visual fatigue.
              </p>
            </div>

            <div className="rounded-xl border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground text-sm">
                3. Distinct Link Underlines &amp; Motion Controls (WCAG 1.4.1 / 2.3.3)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enables high-visibility link underlines and respects system preferences to disable decorative motion and transitions.
              </p>
            </div>

            <div className="rounded-xl border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground text-sm">
                4. Text-to-Speech Audio Reader
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Built-in speech assistant reads highlighted text or main page content aloud with visual outline tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback & Support */}
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="text-base sm:text-lg font-semibold font-heading text-foreground">
            Accessibility Feedback &amp; Support
          </h2>
          <p className="text-xs sm:text-sm">
            We welcome your feedback on the accessibility of TurboTrade. Please let us know if you encounter accessibility barriers:
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Mail className="h-4 w-4 text-primary" /> Email Support
              </div>
              <p className="text-xs text-muted-foreground">
                Send your feedback or accessibility queries directly to our team.
              </p>
              <a
                href="mailto:inquiry@turbotrade.ai"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary underline underline-offset-4"
              >
                inquiry@turbotrade.ai
              </a>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Phone className="h-4 w-4 text-primary" /> Grievance Support
              </div>
              <p className="text-xs text-muted-foreground">
                For investor grievances, please contact our support desk or reach out via our contact page.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  to="/contact"
                  className="text-xs font-semibold text-primary underline underline-offset-4"
                >
                  Contact Page
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 text-xs text-muted-foreground border-t border-border pt-4">
          Last updated &amp; reviewed: July 2026. TurboTrade regularly reviews its digital platforms to ensure ongoing compliance with SEBI and WCAG guidelines.
        </div>
      </div>
    </LegalPageLayout>
  );
}
