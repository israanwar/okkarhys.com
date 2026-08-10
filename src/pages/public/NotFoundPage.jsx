import { Seo } from "../../components/seo/Seo";
import { useI18n } from "../../lib/i18n";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <>
      <Seo title="404 — okkarhys" description={t("nf_body")} noindex />
              <section className="okr__section" style={{ textAlign: "center" }}>
          <div className="okr__wrap">
            <span className="okr__eyebrow">404</span>
            <h1 className="okr__h2">{t("nf_title")}</h1>
            <p style={{ color: "var(--okr-muted)", marginTop: 20, marginBottom: 32 }}>
              {t("nf_body")}
            </p>
            <a className="okr__btn okr__btn--primary" href="/">{t("nf_action")}</a>
          </div>
        </section>
    </>
  );
}
