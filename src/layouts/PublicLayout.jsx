import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SiteChrome } from "../components/layout/SiteChrome";

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
