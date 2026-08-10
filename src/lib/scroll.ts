/* ══════════════ SCROLLING ══════════════
   One eased rAF scroll used by the "back to top" button, and the reduced-motion
   test both it and the page-rise animation share.

   Why not `window.scrollTo({behavior:"smooth"})`. Two reasons, and the second is
   the one that was actually breaking:
     · duration is browser-chosen and unspecified — Safari lands in ~250ms,
       Chrome takes closer to 700ms from three screens down, so the button felt
       like a different control per browser.
     · it is cancelled by anything that changes scroll position, including
       `element.focus()`. The focus call for keyboard users ran immediately after
       the scroll request and jumped the viewport, so the animation was thrown
       away every time. That is why this file exists and why every caller now
       focuses with `preventScroll:true`. */

/* Honours both the OS setting and the accessibility toolbar's own switch. The
   toolbar toggles `html.a11y-reduce-motion` and its CSS crushes animation
   durations, but a rAF loop is JavaScript — CSS cannot reach it, so it has to be
   checked here. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.classList.contains("a11y-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* easeInOutCubic. Symmetrical, so a long travel does not feel like it is braking
   for the last third the way an ease-out does over 2000px. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Duration scales with distance instead of being fixed: 420ms from one screen
   down, 900ms from ten, rather than a fixed 600ms that crawls over short
   distances and teleports over long ones. */
function durationFor(distance: number): number {
  return Math.min(900, Math.max(380, 380 + distance * 0.28));
}

/**
 * Eased scroll to the top of the document.
 *
 * Aborts the moment the visitor touches the scroller themselves — a scroll
 * animation that fights a wheel gesture is the worst version of this control.
 */
export function smoothScrollToTop(): void {
  const start = window.scrollY;
  if (start <= 0) return;

  if (prefersReducedMotion()) {
    window.scrollTo(0, 0);
    return;
  }

  const duration = durationFor(start);
  let startedAt = 0;
  let cancelled = false;
  let raf = 0;

  const abort = () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    detach();
  };
  const detach = () => {
    window.removeEventListener("wheel", abort);
    window.removeEventListener("touchstart", abort);
    window.removeEventListener("keydown", abort);
  };
  /* passive, so the listeners never delay the gesture they are watching for */
  const passive = { passive: true } as const;
  window.addEventListener("wheel", abort, passive);
  window.addEventListener("touchstart", abort, passive);
  window.addEventListener("keydown", abort, passive);

  const step = (now: number) => {
    if (cancelled) return;
    if (!startedAt) startedAt = now;
    const t = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, Math.round(start * (1 - ease(t))));
    if (t < 1) {
      raf = requestAnimationFrame(step);
      return;
    }
    detach();
  };
  raf = requestAnimationFrame(step);
}

/**
 * Moves keyboard focus to the top of the page without moving the viewport.
 *
 * `preventScroll` is the whole point: without it the browser scrolls the focused
 * element into view, which both cancels an in-flight animation and defeats the
 * page-rise transition on a route change.
 */
export function focusPageStart(): void {
  const target =
    document.getElementById("main-content") ||
    (document.querySelector("h1") as HTMLElement | null);
  target?.focus({ preventScroll: true });
}
