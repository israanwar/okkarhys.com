import { Seo } from "../../components/seo/Seo";
import { AnimatedHeadline } from "../../components/ui/AnimatedHeadline";
import { TOOLS_CATALOG, TOOLS_TOTAL_COUNT } from "../../data/toolsCatalog";

const DESCRIPTION =
  "A directory of free file, website, creative, and marketing tools — coming soon to okkarhys.";

export function ToolsPage() {
  return (
    <>
      <Seo
        title="Tools"
        description={DESCRIPTION}
        path="/tools"
      />
      <section className="okr__section okr__tools-page" style={{ paddingTop: 110, paddingBottom: 70 }}>
        <div className="okr__wrap">
          <header style={{ maxWidth: 860, marginBottom: 54 }}>
            <span className="okr__kicker">// TOOLS</span>
            <AnimatedHeadline
              text="Free Tools"
              className="okr__hero-title"
              highlightLast={1}
              style={{ marginTop: 24, maxWidth: 920 }}
            />
            <p className="okr__hero-sub" style={{ maxWidth: 720 }}>
              {TOOLS_TOTAL_COUNT} planned utilities across file conversion, website checks, creative work, and SEO — coming soon.
            </p>
          </header>

          <div className="okr__tools-groups">
            {TOOLS_CATALOG.map((category) => (
              <ToolCategory key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ToolCategory({ category }) {
  return (
    <section id={category.slug} className="okr__portfolio-section" style={{ scrollMarginTop: 100 }}>
      <div className="okr__portfolio-section-head">
        <div>
          <h2 className="okr__portfolio-heading">{category.name}</h2>
        </div>
        <div className="okr__portfolio-rule" />
      </div>

      {category.subcategories ? (
        <div className="okr__tools-subgroups">
          {category.subcategories.map((sub) => (
            <div key={sub.name} className="okr__tools-subgroup">
              <h3 className="okr__portfolio-group-title">{sub.name}</h3>
              <ToolPills tools={sub.tools} />
            </div>
          ))}
        </div>
      ) : (
        <ToolPills tools={category.tools} />
      )}
    </section>
  );
}

function ToolPills({ tools }) {
  return (
    <div className="okr__portfolio-pills">
      {tools.map((tool) => (
        <span key={tool} className="okr__portfolio-pill">{tool}</span>
      ))}
    </div>
  );
}
