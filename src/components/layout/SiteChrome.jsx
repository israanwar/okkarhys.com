import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  MessageCircle, Github, Instagram, Twitter, Linkedin, Mail, ShoppingBag, Menu, X,
  Home, Fingerprint, Compass, LayoutGrid, ShoppingCart, BookOpen,
} from "lucide-react";
import { useLiveSettings, useLiveProducts, useLiveCart } from "../../hooks/usePageData";
import { useI18n } from "../../lib/i18n";
import { localizeSiteDescription } from "../../lib/pageI18n";
import { LangThemeSwitcher } from "./LangThemeSwitcher";
import { OkkarhysLogo, OkkarhysMark } from "../brand/OkkarhysLogo";
import "../../styles/landing.css";

export function BrandMark() {
  return <OkkarhysMark className="okr__brand-mark" title="okkarhys" />;
}

export function SiteHeader({ settings }) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useLiveCart();
  const products = useLiveProducts();
  const cartCount = cart.rows.reduce((s, r) => s + r.qty, 0);
  const hasProducts = products.length > 0;

  const nav = [
    { label: t("nav_home"), to: "/", route: true, icon: Home },
    { label: t("nav_about"), to: "/about", route: true, icon: Fingerprint },
    { label: t("nav_services"), to: "/services", route: true, icon: Compass },
    { label: t("nav_portfolio"), to: "/portfolio", route: true, icon: LayoutGrid },
    ...(hasProducts ? [{ label: t("nav_store"), to: "/store", route: true, icon: ShoppingCart }] : []),
    { label: t("nav_blog"), to: "/blog", route: true, icon: BookOpen },
    { label: t("nav_contact"), to: "/contact", route: true, icon: Mail },
  ];

  useEffect(() => {
    // Toggle a class on the `.okr` shell so CSS can lock scroll while the
    // full-viewport mobile menu is open.
    const shell = document.querySelector(".okr");
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (menuOpen) {
      shell?.classList.add("is-menu-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      shell?.classList.remove("is-menu-open");
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    }

    return () => {
      shell?.classList.remove("is-menu-open");
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    function onResize() {
      if (window.innerWidth > 900) setMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="okr__header">
        <div className="okr__wrap okr__nav">
          <Link className="okr__brand" to="/" onClick={() => setMenuOpen(false)}>
            <OkkarhysLogo name={settings.site_name || "okkarhys"} />
          </Link>
          <nav className="okr__navlinks" aria-label="Primary">
            {nav.map((item) => (
              item.route ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => `okr__navlink${isActive ? " is-active" : ""}`}
                >
                  {item.label}
                </NavLink>
              ) : (
                <a key={item.label} href={item.to} className="okr__navlink">
                  {item.label}
                </a>
              )
            ))}
          </nav>
          <div className="okr__nav-actions">
            <LangThemeSwitcher />
            {hasProducts && (
              <Link to="/cart" className="okr__cart-link" aria-label={t("cart_aria")}>
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="okr__cart-count">{cartCount}</span>
                )}
              </Link>
            )}
            <button
              className="okr__mobile-menu-btn"
              type="button"
              aria-label={menuOpen ? t("nav_close_menu") : t("nav_open_menu")}
              aria-expanded={menuOpen}
              aria-controls="okr-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>
      {/* Mobile menu is a SIBLING of <header>, not a child. `.okr__header` has
          `contain: layout` + `transform: translate3d(...)`, both of which turn
          the header into a containing block for `position: fixed` descendants —
          which would clip the menu to the 60px header box. Rendering here keeps
          the menu positioned against the viewport. */}
      <div className={`okr__mobile-menu${menuOpen ? " is-open" : ""}`} id="okr-mobile-nav">
        <button
          className="okr__mobile-menu-close"
          type="button"
          aria-label={t("nav_close_menu")}
          onClick={() => setMenuOpen(false)}
        >
          <X size={30} strokeWidth={2.2} />
        </button>
        <div className="okr__mobile-menu-content">
          <span className="okr__mobile-menu-kicker">INDEX</span>
          <nav className="okr__mobile-menu-panel" aria-label="Mobile primary">
            {nav.map((item) => {
              const Icon = item.icon;
              return item.route ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => `okr__mobile-navlink${isActive ? " is-active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={30} strokeWidth={1.9} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <a key={item.label} href={item.to} className="okr__mobile-navlink" onClick={() => setMenuOpen(false)}>
                  <Icon size={30} strokeWidth={1.9} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

export function SiteFooter({ settings }) {
  const { lang, t } = useI18n();
  const description = localizeSiteDescription(settings.description, lang, settings.description_id) || t("site_description");
  return (
    <footer className="okr__footer">
      <div className="okr__wrap">
        <div className="okr__footer-grid">
          <div className="okr__footer-brand-col">
            <div className="okr__foot-brand">
              <OkkarhysLogo name={settings.site_name || "okkarhys"} />
            </div>
            <p className="okr__foot-desc">{description}</p>
            <div className="okr__foot-social">
              {settings.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>}
              {settings.social_github && <a href={settings.social_github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>}
              {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
              {settings.social_twitter && <a href={settings.social_twitter} target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={18} /></a>}
            </div>
          </div>

          <div className="okr__footer-col okr__footer-col--menu">
            <div className="okr__foot-title">{t("foot_menu")}</div>
            <ul className="okr__foot-list">
              <li><Link to="/">{t("nav_home")}</Link></li>
              <li><Link to="/about">{t("nav_about")}</Link></li>
              <li><Link to="/services">{t("nav_services")}</Link></li>
              <li><Link to="/portfolio">{t("nav_portfolio")}</Link></li>
              <li><Link to="/store">{t("nav_store")}</Link></li>
              <li><Link to="/blog">{t("nav_blog")}</Link></li>
              <li><Link to="/contact">{t("nav_contact")}</Link></li>
            </ul>
          </div>

          <div className="okr__footer-col okr__footer-col--legal">
            <div className="okr__foot-title">{t("foot_legal")}</div>
            <ul className="okr__foot-list">
              <li><Link to="/privacy">{t("foot_privacy")}</Link></li>
              <li><Link to="/terms">{t("foot_terms")}</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </ul>
          </div>

          <div className="okr__footer-col okr__footer-col--contact">
            <div className="okr__foot-title">{t("foot_contact")}</div>
            <div className="okr__foot-contact">
              {settings.email && (
                <a className="okr__foot-contact-link" href={`mailto:${settings.email}`}>
                  <Mail size={16} /> {settings.email}
                </a>
              )}
              {settings.whatsapp_number && (
                <a className="okr__foot-contact-link" href={settings.whatsapp_url || `https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} /> {settings.whatsapp_number}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="okr__foot-bottom">
          <span>© {new Date().getFullYear()} {settings.site_name || "Okka Rhys"}. {t("foot_rights")}</span>
        </div>
      </div>
    </footer>
  );
}

function AuroraBackdrop() {
  const canvasRef = useRef(null);
  // Skip the heavy canvas draw loop on laptop-width, mobile, and touch-primary
  // devices. The
  // CSS pseudo-element aurora (.okr__aurora::before/::after) already provides
  // a rich static+animated backdrop; the extra curtains, filaments, and folds
  // aren't worth the scroll jank on mobile GPUs. Kept desktop untouched.
  const [renderCanvas, setRenderCanvas] = useState(() => {
    if (typeof window === "undefined") return true;
    const mq = window.matchMedia("(max-width: 1180px), (hover: none), (pointer: coarse)");
    return !mq.matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(max-width: 1180px), (hover: none), (pointer: coarse)");
    const onChange = (event) => setRenderCanvas(!event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!renderCanvas) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return undefined;

    const state = {
      width: 0,
      height: 0,
      raf: 0,
      lastDraw: 0,
      scrollTimer: 0,
      scrolling: false,
      hidden: document.hidden,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 0.82);
      state.width = Math.max(1, Math.ceil(window.innerWidth * dpr));
      state.height = Math.max(1, Math.ceil(window.innerHeight * dpr));
      canvas.width = state.width;
      canvas.height = state.height;
      draw(performance.now());
    }

    function radial(x, y, radius, stops, alpha = 1) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alpha;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.restore();
    }

    function waveY(p, h, config, t, side = 1) {
      const primary = Math.sin((p * config.frequency + config.phase + t * config.drift) * Math.PI * 2);
      const secondary = Math.sin((p * config.frequency * 0.43 - config.phase * 1.6 + t * config.drift * -0.72) * Math.PI * 2);
      const tertiary = Math.sin((p * 2.7 + config.phase * 0.8 + t * 0.28 * side) * Math.PI * 2);
      return config.base * h + primary * config.amplitude * h + secondary * config.amplitude * h * 0.38 + tertiary * config.amplitude * h * 0.16;
    }

    function curtain(config, t) {
      const w = state.width;
      const h = state.height;
      const xStart = -w * 0.18;
      const span = w * 1.36;
      const steps = 64;
      const topBase = config.base * h - config.depth * h * 0.18;
      const bottomBase = config.base * h + config.depth * h;
      const fill = ctx.createLinearGradient(0, topBase, 0, bottomBase);
      config.stops.forEach(([offset, color]) => fill.addColorStop(offset, color));

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = config.alpha;
      ctx.filter = `blur(${config.blur}px)`;
      ctx.fillStyle = fill;
      ctx.beginPath();

      for (let i = 0; i <= steps; i += 1) {
        const p = i / steps;
        const x = xStart + p * span;
        const y = waveY(p, h, config, t, 1);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      for (let i = steps; i >= 0; i -= 1) {
        const p = i / steps;
        const x = xStart + p * span;
        const y = waveY(p, h, config, t, -1)
          + config.depth * h
          + Math.sin((p * 1.9 + config.phase + t * config.drift * 0.42) * Math.PI * 2) * config.depth * h * 0.18;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();
    }

    function filament(config, t) {
      const w = state.width;
      const h = state.height;
      const stroke = ctx.createLinearGradient(-w * 0.12, 0, w * 1.12, 0);
      config.stops.forEach(([offset, color]) => stroke.addColorStop(offset, color));

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = config.alpha;
      ctx.filter = `blur(${config.blur}px)`;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = config.width * h;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i <= 90; i += 1) {
        const p = i / 90;
        const x = -w * 0.12 + p * w * 1.24;
        const y = waveY(p, h, config, t, 1);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.filter = "none";
      ctx.restore();
    }

    function folds(t) {
      const w = state.width;
      const h = state.height;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = `blur(${Math.max(10, h * 0.016)}px)`;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < 7; i += 1) {
        const p = i / 6;
        const x = -w * 0.04 + p * w * 1.08 + Math.sin(t * (0.8 + i * 0.04) + i * 1.9) * w * 0.04;
        const top = h * (0.02 + Math.sin(i * 1.31 + t * 0.8) * 0.028);
        const bottom = h * (0.46 + Math.sin(i * 0.82 - t * 0.6) * 0.055);
        const stroke = ctx.createLinearGradient(0, top, 0, bottom);

        stroke.addColorStop(0, "rgba(217, 219, 222, 0)");
        stroke.addColorStop(0.2, "rgba(217, 219, 222, 0.08)");
        stroke.addColorStop(0.48, "rgba(119, 125, 133, 0.16)");
        stroke.addColorStop(0.72, "rgba(86, 99, 111, 0.11)");
        stroke.addColorStop(1, "rgba(86, 99, 111, 0)");

        ctx.globalAlpha = 0.2 + (i % 3) * 0.035;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w * (0.038 + (i % 4) * 0.009);
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.bezierCurveTo(
          x + Math.sin(i * 1.7 + t) * w * 0.08,
          h * 0.16,
          x + Math.cos(i * 1.1 - t * 0.7) * w * 0.07,
          h * 0.32,
          x + Math.sin(i * 0.9 + t * 1.2) * w * 0.05,
          bottom,
        );
        ctx.stroke();
      }

      ctx.filter = "none";
      ctx.restore();
    }

    function draw(now) {
      const w = state.width;
      const h = state.height;
      if (!w || !h) return;
      if (state.raf && now - state.lastDraw < 32) {
        state.raf = window.requestAnimationFrame(draw);
        return;
      }
      state.lastDraw = now;

      const t = now * 0.00011;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#111316");
      base.addColorStop(0.42, "#070809");
      base.addColorStop(1, "#000000");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      radial(w * 0.38, h * 0.1, h * 0.74, [
        [0, "rgba(119, 125, 133, 0.38)"],
        [0.48, "rgba(86, 99, 111, 0.16)"],
        [1, "rgba(86, 99, 111, 0)"],
      ], 0.9);
      radial(w * 0.16, h * 0.34, h * 0.58, [
        [0, "rgba(217, 219, 222, 0.14)"],
        [0.46, "rgba(86, 99, 111, 0.095)"],
        [1, "rgba(86, 99, 111, 0)"],
      ], 0.7);
      radial(w * 0.82, h * 0.08, h * 0.58, [
        [0, "rgba(48, 54, 61, 0.16)"],
        [0.54, "rgba(119, 125, 133, 0.07)"],
        [1, "rgba(119, 125, 133, 0)"],
      ], 0.75);

      curtain({
        base: 0.03,
        depth: 0.38,
        amplitude: 0.035,
        frequency: 1.1,
        phase: 0.08,
        drift: 0.62,
        alpha: 0.68,
        blur: 22,
        stops: [
          [0, "rgba(119, 125, 133, 0)"],
          [0.24, "rgba(119, 125, 133, 0.28)"],
          [0.48, "rgba(217, 219, 222, 0.52)"],
          [0.68, "rgba(86, 99, 111, 0.32)"],
          [1, "rgba(86, 99, 111, 0)"],
        ],
      }, t);

      curtain({
        base: 0.1,
        depth: 0.46,
        amplitude: 0.065,
        frequency: 1.56,
        phase: 0.46,
        drift: -0.48,
        alpha: 0.52,
        blur: 32,
        stops: [
          [0, "rgba(48, 54, 61, 0)"],
          [0.22, "rgba(48, 54, 61, 0.12)"],
          [0.42, "rgba(119, 125, 133, 0.28)"],
          [0.62, "rgba(86, 99, 111, 0.25)"],
          [1, "rgba(86, 99, 111, 0)"],
        ],
      }, t);

      curtain({
        base: 0.28,
        depth: 0.4,
        amplitude: 0.08,
        frequency: 1.28,
        phase: 0.72,
        drift: 0.34,
        alpha: 0.3,
        blur: 42,
        stops: [
          [0, "rgba(119, 125, 133, 0)"],
          [0.34, "rgba(86, 99, 111, 0.16)"],
          [0.58, "rgba(119, 125, 133, 0.15)"],
          [1, "rgba(48, 54, 61, 0)"],
        ],
      }, t);

      folds(t);

      filament({
        base: 0.08,
        amplitude: 0.045,
        frequency: 1.2,
        phase: 0.22,
        drift: 0.64,
        width: 0.034,
        alpha: 0.3,
        blur: 16,
        stops: [
          [0, "rgba(217, 219, 222, 0)"],
          [0.24, "rgba(217, 219, 222, 0.24)"],
          [0.5, "rgba(217, 219, 222, 0.42)"],
          [0.76, "rgba(119, 125, 133, 0.18)"],
          [1, "rgba(119, 125, 133, 0)"],
        ],
      }, t);

      filament({
        base: 0.22,
        amplitude: 0.07,
        frequency: 1.62,
        phase: 0.58,
        drift: -0.5,
        width: 0.045,
        alpha: 0.15,
        blur: 20,
        stops: [
          [0, "rgba(86, 99, 111, 0)"],
          [0.22, "rgba(86, 99, 111, 0.16)"],
          [0.48, "rgba(119, 125, 133, 0.22)"],
          [0.72, "rgba(217, 219, 222, 0.1)"],
          [1, "rgba(119, 125, 133, 0)"],
        ],
      }, t);

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      const veil = ctx.createLinearGradient(0, 0, 0, h);
      veil.addColorStop(0, "rgba(0,0,0,0)");
      veil.addColorStop(0.62, "rgba(0,0,0,0.22)");
      veil.addColorStop(1, "rgba(0,0,0,0.92)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      if (!state.reduceMotion && !state.hidden && !state.scrolling) {
        state.raf = window.requestAnimationFrame(draw);
      } else {
        state.raf = 0;
      }
    }

    function start() {
      if (!state.raf && !state.reduceMotion && !state.hidden && !state.scrolling) {
        state.raf = window.requestAnimationFrame(draw);
      }
    }

    function pauseForScroll() {
      state.scrolling = true;
      if (state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
      window.clearTimeout(state.scrollTimer);
      state.scrollTimer = window.setTimeout(() => {
        state.scrolling = false;
        start();
      }, 180);
    }

    function onVisibility() {
      state.hidden = document.hidden;
      if (state.hidden && state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else {
        start();
      }
    }

    function onMotionChange(event) {
      state.reduceMotion = event.matches;
      if (state.reduceMotion && state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else {
        start();
      }
    }

    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", pauseForScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      if (state.raf) window.cancelAnimationFrame(state.raf);
      window.clearTimeout(state.scrollTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", pauseForScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [renderCanvas]);

  return (
    <div className="okr__aurora" aria-hidden="true">
      {renderCanvas && <canvas className="okr__aurora-canvas" ref={canvasRef} />}
      <span className="okr__aurora-grain" />
    </div>
  );
}

export function SiteChrome({ children, settings: providedSettings }) {
  // Selalu baca live settings — override kalau parent kasih.
  const liveSettings = useLiveSettings();
  const settings = providedSettings ?? liveSettings;
  const shellRef = useRef(null);

  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      const shell = shellRef.current;
      if (!shell) return;
      if (!shell.classList.contains("is-scrolling")) {
        shell.classList.add("is-scrolling");
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        shell.classList.remove("is-scrolling");
      }, 160);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="okr" ref={shellRef}>
      <AuroraBackdrop />
      <SiteHeader settings={settings} />
      {children}
      <SiteFooter settings={settings} />
    </div>
  );
}
