import { useEffect, useRef, useState } from "react";
import { CURTAIN_TALL, CURTAIN_WIDE } from "@/lib/brand";
import { curtainWillShow, markCurtainShown } from "@/components/site/curtainState";

/* ══════════════ THE CURTAIN ══════════════
   The opening effect. A fixed overlay over the hero, rendered outside <main> so
   it is not part of the document outline. It lifts on the first sign of intent
   and then unmounts for good — a curtain that reappears when you scroll back to
   the top is a trap, not an effect.

   It costs zero scroll distance: the hero is already at scroll 0 underneath it,
   so once the curtain lifts the page is completely ordinary. An earlier build
   made the illustration a 118vh sticky track, which inflated the scrollbar and
   sent "back to top" to the picture rather than the hero.

   Three cases where it must not appear at all:
     · the page did not load at the top — a refresh partway down, the back
       button, or a deep link. Covering content somebody deliberately navigated
       to is the worst version of this pattern.
     · a hash in the URL, for the same reason.
     · the visitor asked for reduced motion — it still shows, but without the
       transition, because the content underneath is the point.

   Intent means any of wheel, touch, key or click. A curtain that only answers to
   the mouse wheel strands anyone on a keyboard. The click listener uses capture
   so a click on a nav link lifts the curtain and unlocks scrolling before the
   anchor jump runs. */

type Props = {
  /* Fired once the curtain is gone and the hero is on screen. The hero's
     registration badge uses it to start its sweep — animating it on mount would
     run the whole thing behind the curtain where nobody can see it. */
  onLift?: () => void;
};

export default function Curtain({ onLift }: Props) {
  /* null means "not decided yet" — the first effect decides whether this
     instance should exist at all, and rendering nothing until then avoids a
     one-frame flash of artwork over a page somebody deep-linked into. */
  const [show, setShow] = useState<boolean | null>(null);
  const [up, setUp] = useState(false);
  const liftedRef = useRef(false);
  /* Decide once per instance. Guarded by a ref rather than relying on the effect
     running once: under StrictMode React invokes effects twice, and a second
     evaluation would see the flag this one just set and hide the curtain in dev
     only — the sort of bug that gets diagnosed as "the animation is flaky". */
  const decided = useRef(false);

  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    if (!curtainWillShow()) {
      setShow(false);
      onLift?.();
      return;
    }
    markCurtainShown();
    setShow(true);
  }, [onLift]);

  useEffect(() => {
    if (show !== true) return;

    /* The scroll lock is added and removed by the same effect so the pair stays
       symmetric. Adding it in the decision effect above instead meant a
       StrictMode remount ran this cleanup, unlocked scrolling, and never
       re-locked — leaving a visible curtain over a scrollable page. */
    document.documentElement.classList.add("curtained");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const passive = { passive: true } as const;

    /* The page must land at exactly the top of the hero, so scroll stays LOCKED
       through the whole lift. An earlier version unlocked first and let the
       gesture's momentum carry — on a trackpad a flick coasts for a second or
       more, so the hero had already scrolled halfway off by the time the curtain
       finished. Now the coast is swallowed: we keep listening to wheel and
       touchmove after the lift purely to detect when the user has stopped
       feeding the scroller, and only then release the lock and reset to 0.

       A click is the exception. There is no momentum behind it, and a click on a
       nav link needs scrolling to work immediately for the anchor jump. */
    let lastFeed = 0;
    let liftedAt = 0;
    let raf = 0;
    let settleTimer = 0;

    const feed = () => {
      lastFeed = Date.now();
    };

    const release = () => {
      window.removeEventListener("wheel", feed);
      window.removeEventListener("touchmove", feed);
      window.scrollTo(0, 0); /* belt and braces — land on the hero */
      document.documentElement.classList.remove("curtained");
      setShow(false);
      onLift?.();
    };

    const settle = () => {
      const now = Date.now();
      /* still coasting, and we have not been waiting absurdly long */
      if (now - lastFeed < 150 && now - liftedAt < 1600) {
        raf = requestAnimationFrame(settle);
        return;
      }
      release();
    };

    const lift = (e: Event) => {
      if (liftedRef.current) return;
      liftedRef.current = true;
      liftedAt = lastFeed = Date.now();
      unbind();
      setUp(true);
      if (e.type === "click") {
        release();
        return;
      }
      window.addEventListener("wheel", feed, passive);
      window.addEventListener("touchmove", feed, passive);
      settleTimer = window.setTimeout(settle, reduce ? 0 : 440);
    };

    const bind = () => {
      window.addEventListener("wheel", lift, passive);
      window.addEventListener("touchmove", lift, passive);
      window.addEventListener("scroll", lift, passive);
      window.addEventListener("keydown", lift);
      document.addEventListener("click", lift, true);
    };
    const unbind = () => {
      window.removeEventListener("wheel", lift);
      window.removeEventListener("touchmove", lift);
      window.removeEventListener("scroll", lift);
      window.removeEventListener("keydown", lift);
      document.removeEventListener("click", lift, true);
    };

    bind();
    return () => {
      unbind();
      window.removeEventListener("wheel", feed);
      window.removeEventListener("touchmove", feed);
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      /* If this unmounts for any reason other than the lift — a route change
         mid-gesture — the scroll lock has to come off with it, or the whole app
         is left frozen with no curtain to explain why. */
      document.documentElement.classList.remove("curtained");
    };
  }, [show, onLift]);

  if (show !== true) return null;

  return (
    <div className={`curtain${up ? " up" : ""}`} id="curtain">
      <picture>
        <source
          type="image/webp"
          media="(orientation:portrait) and (max-width:860px)"
          srcSet={CURTAIN_TALL}
          sizes="100vw"
        />
        <source type="image/webp" srcSet={CURTAIN_WIDE.webp} sizes="100vw" />
        <img
          src={CURTAIN_WIDE.fallback}
          alt="A man sitting cross-legged and meditating on a mat in a bright, plant-filled living room while the market is open."
          width={1683}
          height={935}
          /* lowercase, not fetchPriority — React 18 does not recognise the
             camelCase prop and drops it with a console warning. See
             src/types/react-dom-attributes.d.ts. */
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      <p className="curtain-kicker">Luxury is time. Reclaim it.</p>
      <p className="curtain-cap">
        Research-driven automated trading. So you can live beyond the charts.
      </p>
      <div className="curtain-hint" aria-hidden="true">
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
