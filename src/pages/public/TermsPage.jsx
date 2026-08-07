import { Seo } from "../../components/seo/Seo";
import { SiteChrome } from "../../components/layout/SiteChrome";
import { useLivePage } from "../../hooks/usePageData";
import { renderRichText } from "../../components/layout/renderRichText";
import { useI18n } from "../../lib/i18n";
import { localizePage } from "../../lib/pageI18n";

export function TermsPage() {
  const { lang, t } = useI18n();
  const rawPage = useLivePage("terms");
  const p = localizePage(rawPage, lang);
  return (
    <>
      <Seo title={`${p.title || t("foot_terms")} — okkarhys`} description={t("foot_terms")} path="/terms" />
      <SiteChrome>
        <section className="okr__section" style={{ paddingTop: 120 }}>
          <div className="okr__wrap" style={{ maxWidth: 780 }}>
            <span className="okr__eyebrow">{t("foot_legal_label")}</span>
            <h1 className="okr__h2" style={{ marginTop: 20 }}>{p.title || t("foot_terms")}</h1>
            {p.updated && (
              <p style={{ color: "var(--okr-dim)", fontSize: 14, marginTop: 12 }}>
                {t("foot_updated")} {p.updated}
              </p>
            )}
            <div style={{ color: "var(--okr-muted)", fontSize: 16, lineHeight: 1.75, marginTop: 32 }}>
              {renderRichText(p.body)}
            </div>
          </div>
        </section>
      </SiteChrome>
    </>
  );
}
