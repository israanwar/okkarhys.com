import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) target.scrollIntoView({ block: "start", behavior: "auto" });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <AppRoutes />
    </div>
  );
}
