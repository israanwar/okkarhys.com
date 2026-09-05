import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { I18nProvider } from "./lib/i18n";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./styles/globals.css";

const rootEl = document.getElementById("root");

// `dist/*/index.html` prerenders real markup inside #root for crawlers
// (see scripts/prerender.mjs) — createRoot is not hydration, so it isn't
// guaranteed to replace that content atomically. Clearing it ourselves,
// right before mounting, removes any window where the old (short) and
// new (full-height) trees could coexist — which is what let the browser's
// scroll anchoring pick a stale anchor and jump the page to the bottom on
// first load. Belt-and-suspenders with the `overflow-anchor: none` in
// globals.css.
if (rootEl) rootEl.textContent = "";

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
