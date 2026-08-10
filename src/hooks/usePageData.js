import { useEffect, useRef, useState } from "react";
import {
  pagesRepo, settingsRepo, homepageRepo, productsRepo,
  servicesRepo, postsRepo, cartRepo,
} from "../lib/localStore";
import {
  pagesData, settingsData, homepageData, productsData,
  servicesData, postsData,
} from "../lib/supabaseData";
import { ensureRemoteChangeBridge } from "../lib/supabaseClient";
import { applyProductPriceDiscount, applyProductPriceDiscounts } from "../lib/productPricing";
import { normalizePortfolioProjects } from "../lib/portfolioProjects";

// Universal auto-refresh hook — updates on local writes, storage changes from
// other tabs, visibility return, or window focus. Avoid polling: rerendering a
// long product grid during scroll is expensive and visibly janky.
function useLiveState(readFn, fallbackFn, deps = []) {
  const [state, setState] = useState(() => ({ value: fallbackFn(), loading: true, error: null }));
  const requestId = useRef(0);
  useEffect(() => {
    let alive = true;
    let frame = 0;
    ensureRemoteChangeBridge();
    const refresh = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(async () => {
        frame = 0;
        const id = ++requestId.current;
        setState((current) => ({ ...current, loading: true, error: null }));
        try {
          const next = await readFn();
          if (alive && id === requestId.current) setState({ value: next, loading: false, error: null });
        } catch (error) {
          console.warn("[okkarhys:live-data]", error?.message ?? error);
          if (alive && id === requestId.current) {
            setState((current) => ({ ...current, loading: false, error }));
          }
        }
      });
    };
    const onVis = () => { if (!document.hidden) refresh(); };
    refresh();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("okr:local-store-change", refresh);
    window.addEventListener("okr:remote-store-change", refresh);
    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("okr:local-store-change", refresh);
      window.removeEventListener("okr:remote-store-change", refresh);
    };
  }, deps);
  return state;
}

function useLive(readFn, fallbackFn, deps = []) {
  return useLiveState(readFn, fallbackFn, deps).value;
}

// Pages (about, contact, portfolio, privacy, terms)
export function useLivePage(key) {
  return useLive(
    () => pagesData.get(key),
    () => key === "portfolio" ? normalizePortfolioProjects(pagesRepo.get(key)) : pagesRepo.get(key) ?? {},
    [key],
  ) ?? {};
}

// Global site settings
export function useLiveSettings() { return useLive(() => settingsData.get(), () => settingsRepo.get() ?? {}, []) ?? {}; }

// Homepage sections (hero, cta, process, services list, cases list)
export function useLiveHomepage() { return useLive(() => homepageData.getAll(), () => homepageRepo.getAll() ?? {}, []) ?? {}; }

// Store products
export function useLiveProducts(filter) {
  const status = filter?.status;
  const rows = useLive(
    () => productsData.list(status ? { status } : undefined),
    () => applyProductPriceDiscounts(productsRepo.list(status ? { status } : undefined)),
    [status]
  );
  return Array.isArray(rows) ? rows : [];
}
export function useLiveProduct(slug) {
  return useLive(() => productsData.getBySlug(slug), () => applyProductPriceDiscount(productsRepo.getBySlug(slug)), [slug]);
}
export function useLiveProductState(slug) {
  return useLiveState(() => productsData.getBySlug(slug), () => applyProductPriceDiscount(productsRepo.getBySlug(slug)), [slug]);
}

// Services
export function useLiveServices(filter) {
  const status = filter?.status;
  const rows = useLive(
    () => servicesData.list(status ? { status } : undefined),
    () => servicesRepo.list(status ? { status } : undefined),
    [status]
  );
  return Array.isArray(rows) ? rows : [];
}
export function useLiveService(slug) {
  return useLive(() => servicesData.getBySlug(slug), () => servicesRepo.getBySlug(slug), [slug]);
}
export function useLiveServiceState(slug) {
  return useLiveState(() => servicesData.getBySlug(slug), () => servicesRepo.getBySlug(slug), [slug]);
}

// Blog posts
export function useLivePosts(filter) {
  const status = filter?.status;
  const rows = useLive(
    () => postsData.list(status ? { status } : undefined),
    () => postsRepo.list(status ? { status } : undefined),
    [status]
  );
  return Array.isArray(rows) ? rows : [];
}
export function useLivePost(slug) {
  return useLive(() => postsData.getBySlug(slug), () => postsRepo.getBySlug(slug), [slug]);
}
export function useLivePostState(slug) {
  return useLiveState(() => postsData.getBySlug(slug), () => postsRepo.getBySlug(slug), [slug]);
}

// Cart — pakai listener bawaan cartRepo (lebih responsif dari polling)
export function useLiveCart() {
  const [detail, setDetail] = useState(() => cartRepo.detail());
  useEffect(() => {
    const off = cartRepo.onChange(() => setDetail(cartRepo.detail()));
    return off;
  }, []);
  return detail;
}
