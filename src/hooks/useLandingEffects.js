import { useEffect } from "react";

/**
 * Landing-page micro-interactions. Kept as a single hook so we set up (and
 * tear down) one delegated pointer listener regardless of how many cards live
 * on the page.
 *
 * Effects:
 *  1. Touch/pointer spotlight — a delegated pointer listener paints
 *     `--okr-mx / --okr-my` on any `.okr__spotlight` ancestor of the pointer,
 *     so the CSS glow can chase the finger. One handler covers cards, posts,
 *     and process cards without per-node listeners.
 *
 * Scroll progress is native CSS now (`animation-timeline: scroll(root)`), so
 * this hook intentionally does not write layout-affecting scroll styles.
 *
 * Bails out entirely when `prefers-reduced-motion: reduce` — no pointer
 * chasing. The shell still renders; it just doesn't animate.
 */
export function useLandingEffects(shellRef) {
  useEffect(() => {
    // Same fallback pattern as useScrollReveal — `.okr` is a singleton so
    // we can just find it if the caller didn't pass one in.
    const shell = shellRef?.current ?? document.querySelector(".okr");
    if (!shell) return undefined;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return undefined;

    // --- Pointer spotlight ---------------------------------------------------
    // We track the nearest `.okr__spotlight` ancestor and paint local coords
    // on it, so the CSS radial-gradient can position itself under the finger.
    let lastTarget = null;
    const clearTarget = () => {
      if (lastTarget) {
        lastTarget.classList.remove("is-touched");
        lastTarget = null;
      }
    };
    const onPointerMove = (event) => {
      const target = event.target?.closest?.(".okr__spotlight");
      if (!target) {
        clearTarget();
        return;
      }
      if (target !== lastTarget) {
        clearTarget();
        lastTarget = target;
        target.classList.add("is-touched");
      }
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--okr-mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--okr-my", `${event.clientY - rect.top}px`);
    };
    const onPointerEnd = () => {
      // Fade the spotlight on lift so it doesn't stick to the last touch point.
      if (lastTarget) lastTarget.classList.remove("is-touched");
    };

    shell.addEventListener("pointermove", onPointerMove, { passive: true });
    shell.addEventListener("pointerdown", onPointerMove, { passive: true });
    shell.addEventListener("pointerup", onPointerEnd, { passive: true });
    shell.addEventListener("pointercancel", onPointerEnd, { passive: true });
    shell.addEventListener("pointerleave", clearTarget, { passive: true });

    return () => {
      shell.removeEventListener("pointermove", onPointerMove);
      shell.removeEventListener("pointerdown", onPointerMove);
      shell.removeEventListener("pointerup", onPointerEnd);
      shell.removeEventListener("pointercancel", onPointerEnd);
      shell.removeEventListener("pointerleave", clearTarget);
      clearTarget();
    };
  }, [shellRef]);
}

/**
 * Track which process card is currently snapped into view on mobile, and
 * report its index via `onChange`. Uses an IntersectionObserver against a
 * scroller ref so it doesn't fire during vertical page scroll. Silently
 * no-ops on desktop widths where the process grid isn't a snap scroller.
 */
export function useSnapActiveIndex(scrollerRef, itemCount, onChange) {
  useEffect(() => {
    const scroller = scrollerRef?.current;
    if (!scroller || itemCount === 0) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    // Snap scrolling only exists at the mobile breakpoint. On desktop the
    // container is a plain grid and every card is fully "visible" against
    // itself as the observer root — running would clobber the intended
    // default active index. Re-attach when the viewport crosses the boundary.
    const mq = window.matchMedia("(max-width: 720px)");
    let observer = null;

    const attach = () => {
      if (!mq.matches) return;
      const items = Array.from(scroller.querySelectorAll("[data-snap-index]"));
      if (!items.length) return;

      let currentIndex = -1;
      observer = new IntersectionObserver(
        (entries) => {
          // Pick the most-visible entry among those crossing 0.6 visibility.
          let best = null;
          entries.forEach((entry) => {
            if (entry.intersectionRatio > (best?.intersectionRatio ?? 0)) {
              best = entry;
            }
          });
          if (!best || best.intersectionRatio < 0.6) return;
          const idx = Number(best.target.dataset.snapIndex);
          if (Number.isFinite(idx) && idx !== currentIndex) {
            currentIndex = idx;
            onChange(idx);
          }
        },
        { root: scroller, threshold: [0.6, 0.9] },
      );
      items.forEach((n) => observer.observe(n));
    };

    const detach = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };

    const onChangeMq = () => {
      detach();
      attach();
    };

    attach();
    mq.addEventListener("change", onChangeMq);

    return () => {
      mq.removeEventListener("change", onChangeMq);
      detach();
    };
  }, [scrollerRef, itemCount, onChange]);
}
