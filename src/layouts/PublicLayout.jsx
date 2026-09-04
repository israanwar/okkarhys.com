import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SiteChrome } from "../components/layout/SiteChrome";
import "../styles/scroll-performance.css";

/**
 * Layout for every public route.
 *
 * Purpose: keep SiteChrome (header, footer, AuroraBackdrop) mounted across
 * client-side navigation. Previously each page rendered its own
 * `<SiteChrome>` — every route change unmounted the aurora canvas, threw
 * away its 2d context, and re-ran the heavy first draw pass on the next
 * mount. That was the "slow tinted-glass menu transition" the user saw.
 *
 * Now SiteChrome is mounted once at the layout level; page components only
 * return their content and slot into `<Outlet />`. The canvas keeps
 * animating uninterrupted; nav feels instant.
 *
 * `Suspense` wraps the outlet so lazy-loaded route chunks show a subtle
 * loading placeholder instead of a blank flash while the JS is fetched.
 */
function PublicRouteFallback() {
  return (
    <section className="okr__section okr__page-hero">
      <div className="okr__wrap" style={{ color: "var(--okr-muted)" }}>Loading...</div>
    </section>
  );
}

export function PublicLayout() {
  return (
    <SiteChrome>
      <Suspense fallback={<PublicRouteFallback />}>
        <Outlet />
      </Suspense>
    </SiteChrome>
  );
}
