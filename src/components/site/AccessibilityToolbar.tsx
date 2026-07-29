import { useEffect, useRef, useState } from "react";
import {
  Accessibility,
  Minus,
  Plus,
  X,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export type Theme = "default" | "contrast" | "dark" | "warm" | "grayscale";

export type Settings = {
  scale: number; // percentage: 90, 100, 110, 125, 150, 175, 200
  theme: Theme;
  underlineLinks: boolean;
  reduceMotion: boolean;
  textToSpeech: boolean;
};

const SCALES = [90, 100, 110, 125, 150, 175, 200];
export const STORAGE_KEY = "turbotrade:a11y:v1";

const getDefaults = (): Settings => {
  const systemPrefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const savedTheme =
    typeof window !== "undefined"
      ? (window.localStorage.getItem("turbotrade-theme") as Theme | null)
      : null;

  return {
    scale: 100,
    theme: savedTheme === "dark" ? "dark" : "default",
    underlineLinks: false,
    reduceMotion: systemPrefersReducedMotion,
    textToSpeech: false,
  };
};

function loadSettings(): Settings {
  const defaults = getDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

function applySettingsDOM(s: Settings) {
  const root = document.documentElement;
  root.style.setProperty("--a11y-scale", String(s.scale / 100));

  root.classList.toggle("a11y-theme-contrast", s.theme === "contrast");
  root.classList.toggle("a11y-theme-dark", s.theme === "dark");
  root.classList.toggle("a11y-theme-warm", s.theme === "warm");
  root.classList.toggle("a11y-theme-grayscale", s.theme === "grayscale");
  root.classList.toggle("a11y-underline-links", s.underlineLinks);
  root.classList.toggle("a11y-reduce-motion", s.reduceMotion);

  if (s.theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    try {
      localStorage.setItem("turbotrade-theme", "dark");
    } catch {
      /* ignore */
    }
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    try {
      localStorage.setItem("turbotrade-theme", "light");
    } catch {
      /* ignore */
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("turbotrade-theme-changed"));
  }
}

export function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [currentReadingText, setCurrentReadingText] = useState<string>("");
  const [readingSource, setReadingSource] = useState<string>("");
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  const [settings, setSettings] = useState<Settings>(() =>
    typeof window === "undefined" ? getDefaults() : loadSettings(),
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    applySettingsDOM(s);
    mounted.current = true;

    const handleSync = () => {
      const updated = loadSettings();
      setSettings(updated);
    };

    window.addEventListener("turbotrade-a11y-sync", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("turbotrade-a11y-sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    applySettingsDOM(settings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const update = (patch: Partial<Settings>, message?: string) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    if (message) {
      setLiveAnnouncement(message);
    }
  };

  const scaleIndex = Math.max(0, SCALES.indexOf(settings.scale));
  const canDecrease = scaleIndex > 0;
  const canIncrease = scaleIndex < SCALES.length - 1;

  const stepScale = (dir: -1 | 1) => {
    const next =
      SCALES[Math.min(SCALES.length - 1, Math.max(0, scaleIndex + dir))];
    update({ scale: next }, `Text size set to ${next} percent.`);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setCurrentReadingText("");
    setReadingSource("");
  };

  const resetAll = () => {
    stopSpeaking();
    const defaults = getDefaults();
    setSettings(defaults);
    setLiveAnnouncement("Accessibility preferences reset to system defaults.");
  };

  const handleSpeechToggle = (enable: boolean) => {
    update(
      { textToSpeech: enable },
      enable ? "Audio reader enabled." : "Audio reader disabled.",
    );
    if (!enable) {
      stopSpeaking();
    }
  };

  const speakPageSummary = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (speaking) {
      stopSpeaking();
      return;
    }

    const selectionText = window.getSelection()?.toString().trim();
    let rawText = "";
    let sourceLabel = "";
    let targetEl: HTMLElement | null = null;
    let highlightTarget: HTMLElement | null = null;

    if (selectionText && selectionText.length > 0) {
      rawText = selectionText;
      sourceLabel = "Highlighted Selection";
    } else {
      const mainEl = (document.querySelector("main") ||
        document.getElementById("main-content")) as HTMLElement | null;
      targetEl = mainEl || document.body;

      highlightTarget = (targetEl.querySelector("h1, h2") ||
        targetEl) as HTMLElement;

      const clone = targetEl.cloneNode(true) as HTMLElement;
      clone
        .querySelectorAll(
          "header, nav, [aria-hidden='true'], .skip-link, [role='status']",
        )
        .forEach((el) => el.remove());

      rawText = clone.innerText;
      sourceLabel = document.title
        ? document.title.split("|")[0].trim()
        : "Main Page Content";
    }

    const cleanedText = rawText.replace(/\s+/g, " ").trim().slice(0, 1000);
    if (!cleanedText) return;

    const scrollNode = highlightTarget || targetEl;
    if (scrollNode) {
      scrollNode.scrollIntoView({ behavior: "smooth", block: "center" });
      scrollNode.classList.add("a11y-reading-highlight");
      setTimeout(() => {
        scrollNode?.classList.remove("a11y-reading-highlight");
      }, 4000);
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = stopSpeaking;
    utterance.onerror = stopSpeaking;

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setReadingSource(sourceLabel);
    setCurrentReadingText(cleanedText);
  };

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            triggerRef.current?.focus();
          }
        }}
      >
        <SheetTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open accessibility preferences"
            aria-expanded={open}
            aria-controls="a11y-preferences-sheet"
            title="Accessibility preferences"
            className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 sm:px-3 text-xs sm:text-[13px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
          >
            <Accessibility
              className="h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="hidden md:inline">Accessibility</span>
          </button>
        </SheetTrigger>

        <SheetContent
          id="a11y-preferences-sheet"
          side="right"
          className="w-full sm:max-w-[420px] p-0 bg-background border-l border-border flex flex-col gap-0 [&>button.absolute]:hidden z-[100]"
        >
          <div className="sr-only">
            <SheetTitle>Accessibility preferences</SheetTitle>
            <SheetDescription>
              Adjust text size, reading themes, link underlines, reduced motion, and audio reader preferences for WCAG 2.2 AA and SEBI compliance.
            </SheetDescription>
          </div>

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-border flex items-start justify-between gap-4 bg-muted/30">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Accessibility className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold font-heading text-foreground leading-tight">
                  Accessibility Options
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  WCAG 2.2 Level AA &amp; SEBI compliant preferences.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close accessibility preferences"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {/* Text scaling */}
            <section
              aria-labelledby="a11y-text-size-heading"
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    id="a11y-text-size-heading"
                    className="text-sm font-semibold text-foreground"
                  >
                    Text Size (WCAG 1.4.4)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Scale text up to 200% without layout loss
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    update({ scale: 100 }, "Text size reset to 100%.")
                  }
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5 font-medium cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease text size"
                  disabled={!canDecrease}
                  onClick={() => stepScale(-1)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border bg-background text-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer transition-colors"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <div
                  role="status"
                  aria-live="polite"
                  aria-label={`Current text size ${settings.scale} percent`}
                  className="h-10 flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-muted font-mono font-semibold text-sm text-foreground tabular-nums"
                >
                  {settings.scale}%
                </div>
                <button
                  type="button"
                  aria-label="Increase text size"
                  disabled={!canIncrease}
                  onClick={() => stepScale(1)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border bg-background text-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </section>

            {/* Reading Themes */}
            <section
              aria-labelledby="a11y-themes-heading"
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <h3
                id="a11y-themes-heading"
                className="text-sm font-semibold text-foreground mb-1"
              >
                Reading Themes (WCAG 1.4.3)
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Select high contrast or reading palette
              </p>
              <div
                role="radiogroup"
                aria-labelledby="a11y-themes-heading"
                className="grid grid-cols-2 gap-2"
              >
                <ThemeCard
                  id="default"
                  label="Site Default"
                  selected={settings.theme === "default"}
                  onSelect={() =>
                    update({ theme: "default" }, "Theme set to Site Default.")
                  }
                  swatch={{ bg: "#ffffff", fg: "#0f172a", accent: "#f2bc2b" }}
                />
                <ThemeCard
                  id="contrast"
                  label="High Contrast"
                  selected={settings.theme === "contrast"}
                  onSelect={() =>
                    update({ theme: "contrast" }, "Theme set to High Contrast.")
                  }
                  swatch={{ bg: "#ffffff", fg: "#000000", accent: "#0b132b" }}
                />
                <ThemeCard
                  id="dark"
                  label="Dark Reading"
                  selected={settings.theme === "dark"}
                  onSelect={() =>
                    update({ theme: "dark" }, "Theme set to Dark Reading.")
                  }
                  swatch={{ bg: "#0f172a", fg: "#f8fafc", accent: "#f2bc2b" }}
                />
                <ThemeCard
                  id="warm"
                  label="Warm Sepia"
                  selected={settings.theme === "warm"}
                  onSelect={() =>
                    update({ theme: "warm" }, "Theme set to Warm Sepia.")
                  }
                  swatch={{ bg: "#f5ecd8", fg: "#3a2a17", accent: "#8a4a1a" }}
                />
                <ThemeCard
                  id="grayscale"
                  label="Monochrome"
                  selected={settings.theme === "grayscale"}
                  onSelect={() =>
                    update(
                      { theme: "grayscale" },
                      "Theme set to Monochrome Grayscale.",
                    )
                  }
                  swatch={{ bg: "#e2e2e2", fg: "#1f1f1f", accent: "#555555" }}
                />
              </div>
            </section>

            {/* Display & Navigation Controls */}
            <section
              aria-labelledby="a11y-display-nav-heading"
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <h3
                id="a11y-display-nav-heading"
                className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-primary" />
                Display &amp; Navigation Controls
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Enhance visual indicators &amp; motion settings
              </p>
              <ul className="divide-y divide-border -my-2">
                <SwitchRow
                  label="Underline clickable links"
                  description="Adds distinct underlines to all links for visual scanning."
                  checked={settings.underlineLinks}
                  onChange={(v) =>
                    update(
                      { underlineLinks: v },
                      v
                        ? "Link underlines enabled."
                        : "Link underlines disabled.",
                    )
                  }
                />
                <SwitchRow
                  label="Reduce motion"
                  description="Minimizes transitions, background motion &amp; animations."
                  checked={settings.reduceMotion}
                  onChange={(v) =>
                    update(
                      { reduceMotion: v },
                      v
                        ? "Reduced motion enabled."
                        : "Reduced motion disabled.",
                    )
                  }
                />
              </ul>
            </section>

            {/* Audio Reader Text-to-Speech Feature */}
            <section
              aria-labelledby="a11y-tts-heading"
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <h3
                id="a11y-tts-heading"
                className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4 text-primary" />
                Text-to-Speech Audio Reader
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Listen to main page content or selected text read aloud.
              </p>
              <div className="space-y-3">
                <SwitchRow
                  label="Enable Audio Assistant"
                  description="Enables text-to-speech audio reader controls."
                  checked={settings.textToSpeech}
                  onChange={handleSpeechToggle}
                />
                {settings.textToSpeech && (
                  <div className="pt-2 border-t border-border flex items-center gap-2">
                    <button
                      type="button"
                      onClick={speakPageSummary}
                      className="flex-1 h-9 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-3 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {speaking ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5" /> Stop Reading
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5" /> Read Page Content
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/20 space-y-3">
            <button
              type="button"
              onClick={resetAll}
              className="w-full h-10 inline-flex items-center justify-center rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer transition-colors"
            >
              Reset all preferences
            </button>
            <p className="text-[11px] text-muted-foreground text-center leading-normal">
              Preferences stored locally in compliance with SEBI Accessibility Guidelines (IS 17802 / RPwD Act 2016).
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Audio Reader Pill */}
      {speaking && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 rounded-full border border-primary/30 bg-background/95 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 max-w-[90vw] sm:max-w-xl"
        >
          <div className="flex items-center gap-1.5 text-primary shrink-0">
            <Volume2 className="h-4 w-4 animate-pulse text-primary" />
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-1 bg-primary rounded-full animate-[bounce_1s_infinite_100ms] h-2.5" />
              <span className="w-1 bg-primary rounded-full animate-[bounce_1s_infinite_300ms] h-3.5" />
              <span className="w-1 bg-primary rounded-full animate-[bounce_1s_infinite_200ms] h-2" />
            </span>
          </div>

          <div className="min-w-0 flex-1 text-xs">
            <div className="font-semibold text-foreground truncate">
              Reading: {readingSource}
            </div>
            <p className="text-muted-foreground italic truncate text-[11px]">
              "{currentReadingText}"
            </p>
          </div>

          <button
            type="button"
            onClick={stopSpeaking}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer shrink-0"
          >
            <VolumeX className="h-3.5 w-3.5" /> Stop
          </button>
        </div>
      )}
    </>
  );
}

function ThemeCard({
  id,
  label,
  selected,
  onSelect,
  swatch,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  swatch: { bg: string; fg: string; accent: string };
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative text-left rounded-xl border p-2.5 bg-background transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        selected
          ? "border-primary ring-1 ring-primary bg-primary/5"
          : "border-border hover:border-foreground/30"
      }`}
    >
      <div
        aria-hidden="true"
        className="a11y-swatch h-10 w-full rounded-lg mb-2 flex items-center px-2 gap-1.5 border border-black/10 shadow-inner overflow-hidden"
        style={{ background: swatch.bg }}
      >
        <span
          className="text-xs font-bold font-serif"
          style={{ color: swatch.fg }}
        >
          Aa
        </span>
        <span
          className="h-1 flex-1 rounded-full"
          style={{ background: swatch.fg, opacity: 0.2 }}
        />
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: swatch.accent }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {selected && (
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
            <Check className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </button>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="py-3 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-foreground">{label}</div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 mt-0.5 h-5 sm:h-6 w-9 sm:w-11 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          checked ? "bg-primary" : "bg-muted border border-border"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4 sm:translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </li>
  );
}
