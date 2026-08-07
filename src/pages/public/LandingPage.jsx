import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../../components/seo/Seo";
import { SiteChrome } from "../../components/layout/SiteChrome";
import { useLiveSettings, useLiveHomepage, useLivePosts } from "../../hooks/usePageData";
import { useI18n } from "../../lib/i18n";
import { localizeHomepage, localizeSiteDescription } from "../../lib/pageI18n";
import { resolveCover } from "../../lib/blogPlaceholder";

const DEFAULT_HERO_SUBTITLES = new Set([
  "web, seo, ai workflow & content strategy for personal brands and businesses.",
  "web, seo, workflow ai, dan strategi konten untuk personal brand dan bisnis.",
]);

function isDefaultHeroSubtitle(value) {
  return DEFAULT_HERO_SUBTITLES.has(String(value ?? "").trim().toLowerCase());
}

export function LandingPage() {
  const { lang, t } = useI18n();
  const settings = useLiveSettings();
  const rawSections = useLiveHomepage();
  const sections = localizeHomepage(rawSections, lang);
  const posts = useLivePosts({ status: "published" }).slice(0, 3);

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
  const [selectedProcessIndex, setSelectedProcessIndex] = useState(0);
  const activeProcessIndex = Math.min(selectedProcessIndex, Math.max(processItems.length - 1, 0));
  const activeProcess = processItems[activeProcessIndex];

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
      <SiteChrome settings={settings}>
        <section className="okr__hero">
          <div className="okr__wrap">
            {hero.kicker && <span className="okr__kicker">{hero.kicker}</span>}
            <h1 className="okr__hero-title">
              {hero.title_line1}{" "}
              <span className="grad">{hero.title_line2}</span>
            </h1>
            {heroSubtitle && <p className="okr__hero-sub">{heroSubtitle}</p>}
            <div className="okr__hero-cta">
              <Link className="okr__btn okr__btn--primary" to="/services">
                {hero.cta_secondary_label || t("hero_cta_secondary")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {services.items?.length > 0 && (
          <section className="okr__section" id="services">
            <div className="okr__wrap">
              <div className="okr__section-topbar">
                <div className="okr__section-head">
                  <span className="okr__eyebrow">{t("section_services")}</span>
                  <h2 className="okr__h2">{t("section_services_head")}<br />{t("section_services_head_2")}</h2>
                </div>
              </div>
              <div className="okr__cards">
                {services.items.map((s, i) => (
                  <article key={i} className="okr__card">
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
              <span className="okr__eyebrow">{t("section_process")}</span>
              <h2 className="okr__h2">{process.title}</h2>
              <div className="okr__process">
                {processItems.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`okr__process-card${i === activeProcessIndex ? " is-active" : ""}`}
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
              {activeProcess && (
                <div
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
              <div className="okr__section-topbar">
                <div className="okr__section-head">
                  <span className="okr__eyebrow">{t("section_journal")}</span>
                  <h2 className="okr__h2">{t("section_journal_title")}</h2>
                </div>
                <Link className="okr__link okr__link--glass" to="/blog">
                  {t("section_journal_all")} <ArrowRight size={15} />
                </Link>
              </div>
              <div className="okr__journal">
                {posts.map((p) => (
                  <Link key={p.id} className="okr__post" to={`/blog/${p.slug}`}>
                    <div className="okr__post-img" style={{ backgroundImage: `url("${resolveCover(p)}")` }} />
                    <div className="okr__post-body">
                      <div className="okr__post-tags">{(p.tags ?? []).join(" · ").toUpperCase()}</div>
                      <h3 className="okr__post-title">{p.title}</h3>
                      <p className="okr__post-excerpt">{p.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {cases.items?.length > 0 && (
          <section className="okr__section">
            <div className="okr__wrap">
              <h2 className="okr__h2">{cases.title}</h2>
              <div className="okr__cases">
                {cases.items.map((c, i) => (
                  <article key={i} className="okr__case">
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
          <div className="okr__cta">
            <h3>{cta.title}</h3>
            <p>{cta.subtitle}</p>
          </div>
        </section>
      </SiteChrome>
    </>
  );
}
