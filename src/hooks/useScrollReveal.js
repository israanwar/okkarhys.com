import { useEffect } from "react";

/**
 * Attach a shared IntersectionObserver to any element carrying `.okr__reveal`
 * inside the given root ref. When an element enters the viewport it receives
 * `.is-in` and its transition plays. Also honors `prefers-reduced-motion` —
 * reduced-motion viewers just get the final state immediately so nothing is
 * hidden behind an animation they can't see.
 *
 * Cheap: one observer per mount, unobserves each element after it fires so we
 * don't keep watching a page's worth of nodes.
 */
export function useScrollReveal(rootRef, { threshold = 0.14, rootMargin = "0px 0px -8% 0px" } = {}) {
  useEffect(() => {
    // Fall back to the page shell when no explicit root is given — reveal
    // targets typically live somewhere inside `.okr` and callers shouldn't
    // have to thread a ref through SiteChrome just to opt in.
    const root = rootRef?.current ?? document.querySelector(".okr");
    if (!root) return undefined;

    const nodes = root.querySelectorAll(".okr__reveal");
    if (!nodes.length) return undefined;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("is-in"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [rootRef, threshold, rootMargin]);
}
