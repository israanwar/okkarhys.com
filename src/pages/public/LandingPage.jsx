import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../../components/seo/Seo";
import { AnimatedHeadline } from "../../components/ui/AnimatedHeadline";
import { useLiveSettings, useLiveHomepage, useLivePosts } from "../../hooks/usePageData";
import { useI18n } from "../../lib/i18n";
import { localizeHomepage, localizeSiteDescription } from "../../lib/pageI18n";
import { useLandingEffects, useSnapActiveIndex } from "../../hooks/useLandingEffects";
import { PostCard } from "../../components/blog/PostCard";

const DEFAULT_HERO_SUBTITLES = new Set([
  "web, seo, ai workflow & content strategy for personal brands and businesses.",
  "web, seo, workflow ai, dan strategi konten untuk personal brand dan bisnis.",
  "building smarter digital systems for stronger visibility, efficient operations, and sustainable business growth.",
  "kami membangun sistem digital yang lebih cerdas untuk memperkuat visibilitas, mengefisienkan operasional, dan mendorong pertumbuhan bisnis berkelanjutan.",
]);

function isDefaultHeroSubtitle(value) {
  return DEFAULT_HERO_SUBTITLES.has(String(value ?? "").trim().toLowerCase());
}

export function LandingPage() {
  const { lang, t } = useI18n();
  const settings = useLiveSettings();
  const rawSections = useLiveHomepage();
  const sections = localizeHomepage(rawSections, lang);
  const posts = useLivePosts({ status: "published" }).slice(0, 6);

  const hero = sections.hero ?? {};
  const siteDescription = localizeSiteDescription(settings.description, lang, settings.description_id);
  const heroSubtitle = !hero.subtitle || isDefaultHeroSubtitle(hero.subtitle)
    ? siteDescription
    : hero.subtitle;
  const cta = sections.cta ?? {};
  const process = sections.process ?? { title: "", items: [] };
  const services = sections.services ?? { items: [] };
  const cases = sections.cases ?? { title: t("section_cases_title"), items: [] };
  const processItems = process.items ?? [];
  const [selectedProcessIndex, setSelectedProcessIndex] = useState(1);
  const activeProcessIndex = Math.min(selectedProcessIndex, Math.max(processItems.length - 1, 0));
  const activeProcess = processItems[activeProcessIndex];

  // Offset the second line's stagger so its words continue counting where the
  // first line left off — otherwise both lines animate from --i:0 in parallel.
  const line1WordCount = useMemo(
    () => (hero.title_line1 ? String(hero.title_line1).split(/\s+/).filter(Boolean).length : 0),
    [hero.title_line1],
  );

  // Section reveals now run entirely through CSS `animation-timeline: view()`
  // (see `.okr__reveal` in landing.css) — no IntersectionObserver, no
  // classList mutation, no React re-render conflicts. This hook only keeps the
  // pointer spotlight alive; scroll progress is native CSS.
  useLandingEffects(null);

  // Keep the active process card in sync with whichever card is snap-centered
  // on mobile. Wrapped in useCallback so the observer doesn't re-attach every
  // render.
  const processScrollerRef = useRef(null);
  const handleSnap = useCallback((idx) => setSelectedProcessIndex(idx), []);
  useSnapActiveIndex(processScrollerRef, processItems.length, handleSnap);

  return (
    <>
      <Seo
        title={settings.seo_default_title || settings.site_name || "okkarhys"}
        description={localizeSiteDescription(
          settings.seo_default_description || settings.description,
          lang,
          settings.seo_default_description_id || settings.description_id,
        )}
      />
      {/* Thin fixed progress bar - only painted on mobile via CSS. */}
      <span className="okr__scroll-progress" aria-hidden="true" />
    <div className="okr__home">
          <section className="okr__hero">
            <div className="okr__wrap">
              {hero.kicker && (
                <span className="okr__kicker okr__hero-kicker">{hero.kicker}</span>
              )}
              <AnimatedHeadline
                text={[hero.title_line1, hero.title_line2].filter(Boolean).join(" ")}
                className="okr__hero-title okr__hero-title--stagger"
                highlightFrom={line1WordCount}
              />
              {heroSubtitle && (
                <p className="okr__hero-sub okr__hero-sub--reveal">{heroSubtitle}</p>
              )}
              <div className="okr__hero-cta okr__hero-cta--reveal">
                <Link className="okr__btn okr__btn--primary okr__btn--tactile" to="/services">
                  {hero.cta_secondary_label || t("hero_cta_secondary")}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {services.items?.length > 0 && (
            <section className="okr__section" id="services">
              <div className="okr__wrap">
                <div className="okr__section-topbar okr__reveal">
                  <div className="okr__section-head">
                    <span className="okr__eyebrow">{t("section_services")}</span>
                    <h2 className="okr__h2">{t("section_services_head")}<br />{t("section_services_head_2")}</h2>
                  </div>
                </div>
                <div className="okr__cards okr__cards--services">
                  {services.items.map((s, i) => (
                    <article
                      key={i}
                      className="okr__card okr__service-card okr__spotlight okr__reveal"
                      data-card-index={String(i + 1).padStart(2, "0")}
                      style={{ "--reveal-delay": `${Math.min(i, 5) * 60}ms` }}
                    >
                      <div className="okr__service-card-meta" aria-hidden="true">
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <span>{t("section_services")}</span>
                      </div>
                      <h3 className="okr__card-title">{s.title}</h3>
                      <p className="okr__card-body">{s.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {processItems.length > 0 && (
            <section className="okr__section okr__process-section" id="about">
              <div className="okr__wrap">
                <span className="okr__eyebrow okr__reveal">{t("section_process")}</span>
                <h2 className="okr__h2 okr__reveal">{process.title}</h2>
                <div
                  className="okr__process okr__process--snap"
                  ref={processScrollerRef}
                >
                  {processItems.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      data-snap-index={i}
                      className={`okr__process-card okr__spotlight okr__reveal${i === activeProcessIndex ? " is-active" : ""}`}
                      style={{ "--reveal-delay": `${Math.min(i, 5) * 60}ms` }}
                      onMouseEnter={() => setSelectedProcessIndex(i)}
                      onFocus={() => setSelectedProcessIndex(i)}
                      onClick={() => setSelectedProcessIndex(i)}
                      aria-expanded={i === activeProcessIndex}
                      aria-controls="okr-process-detail"
                    >
                      <div className="okr__step-n">{s.n}</div>
                      <div className="okr__step-title" id={`okr-process-step-${i}`}>{s.title}</div>
                      <p className="okr__step-body">{s.body}</p>
                    </button>
                  ))}
                </div>
                {/* Mobile-only pagination dots — reflect which card is snapped. */}
                <div className="okr__process-dots" aria-hidden="true">
                  {processItems.map((_, i) => (
                    <span
                      key={i}
                      className={`okr__process-dot${i === activeProcessIndex ? " is-active" : ""}`}
                    />
                  ))}
                </div>
                {activeProcess && (
                  <div
                    // `key` swaps every time the active stage changes, forcing
                    // React to remount the panel — that re-runs the CSS mount
                    // animation so the copy fades/slides in on each hover
                    // rather than snapping to new text.
                    key={activeProcessIndex}
                    className="okr__process-detail"
                    id="okr-process-detail"
                    role="region"
                    aria-live="polite"
                    aria-labelledby={`okr-process-step-${activeProcessIndex}`}
                  >
                    <div className="okr__process-detail-copy">
                      <span className="okr__process-detail-kicker">
                        {activeProcess.n} / {t("process_detail_label")}
                      </span>
                      <h3>{activeProcess.title}</h3>
                      <p>{activeProcess.detail || activeProcess.body}</p>
                    </div>
                    {activeProcess.points?.length > 0 && (
                      <div className="okr__process-detail-points">
                        <span>{t("process_points_label")}</span>
                        <ul>
                          {activeProcess.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {posts.length > 0 && (
            <section className="okr__section okr__journal-section" id="journal">
              <div className="okr__wrap">
                <div className="okr__section-topbar okr__reveal">
                  <div className="okr__section-head">
                    <span className="okr__eyebrow">{t("section_journal")}</span>
                    <h2 className="okr__h2">{t("section_journal_title")}</h2>
                  </div>
                  <Link className="okr__link okr__link--glass" to="/blog">
                    {t("section_journal_all")} <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="okr__journal okr__journal--editorial okr__blog-grid--editorial">
                  {posts.map((p, i) => (
                    <PostCard key={p.id} post={p} index={i} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {cases.items?.length > 0 && (
            <section className="okr__section">
              <div className="okr__wrap">
                <h2 className="okr__h2 okr__reveal">{cases.title}</h2>
                <div className="okr__cases">
                  {cases.items.map((c, i) => (
                    <article
                      key={i}
                      className="okr__case okr__spotlight okr__reveal"
                      style={{ "--reveal-delay": `${Math.min(i, 5) * 60}ms` }}
                    >
                      {c.img && <div className="okr__case-img" style={{ backgroundImage: `url("${c.img}")` }} />}
                      <div className="okr__case-body">
                        <div className="okr__case-tags">{c.tags}</div>
                        <h3 className="okr__case-title">{c.title}</h3>
                        <p>{c.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="okr__wrap" id="contact">
            <div className="okr__cta okr__reveal">
              <h3>{cta.title}</h3>
              <p>{cta.subtitle}</p>
            </div>
          </section>
      </div>
    </>
  );
}
