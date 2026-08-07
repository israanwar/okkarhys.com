import { Link } from "react-router-dom";
import { CATEGORY_BY_SLUG, DEFAULT_CATEGORY_SLUG } from "../../data/blogCategories";
import { resolveCover } from "../../lib/blogPlaceholder";
import { useI18n } from "../../lib/i18n";
import { localizeBlogCategory } from "../../lib/blogCategoryI18n";
import { formatPostReadCount, getPostReadCount } from "../../lib/blogMetrics";

// Bulletproof date formatter: empty input or unparseable strings return blank.
// null/undefined atau string non-parseable, return empty string (bukan
// "Invalid Date"). Ini defensive terhadap draft post yang belum publish
// atau data legacy yang miss field.
function fmtDate(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// AUTHOR: sistem masih pakai HARDCODED_ADMIN, jadi untuk sekarang
// resolve author display dari brand. Bisa di-extend ke usersRepo nanti.
const AUTHOR_DISPLAY = "Okka Rhys";

export function PostCard({ post, layout = "grid" }) {
  const { lang, t } = useI18n();
  const rawCategory = CATEGORY_BY_SLUG[post.category] ?? CATEGORY_BY_SLUG[DEFAULT_CATEGORY_SLUG];
  const category = localizeBlogCategory(rawCategory, lang);
  const cover = resolveCover(post, category);
  const author = post.author_name ?? AUTHOR_DISPLAY;
  const readingTime = post.reading_time ?? 1;
  const readCount = getPostReadCount(post);

  const isHorizontal = layout === "horizontal";

  return (
    <article
      className={`okr__blog-card${isHorizontal ? " okr__blog-card--horizontal" : ""}`}
      style={{
        display: isHorizontal ? "grid" : "flex",
        gridTemplateColumns: isHorizontal ? "minmax(220px, 320px) 1fr" : undefined,
        flexDirection: isHorizontal ? undefined : "column",
        gap: isHorizontal ? 24 : 16,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--okr-line, rgba(255,255,255,0.08))",
        background: "var(--okr-card-bg, rgba(255,255,255,0.02))",
        transition: "border-color 160ms ease, transform 160ms ease",
      }}
    >
      <Link
        className="okr__blog-card-cover"
        to={`/blog/${post.slug}`}
        style={{
          display: "block",
          aspectRatio: "16 / 9",
          backgroundImage: `url("${cover}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          textDecoration: "none",
        }}
        aria-label={post.image_alt || post.title}
      />
      <div className="okr__blog-card-body" style={{ padding: isHorizontal ? "18px 18px 18px 0" : "18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {category && (
          <Link
            className="okr__blog-card-category"
            to={`/blog/${category.slug}`}
            style={{
              alignSelf: "flex-start",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--okr-primary-2, #ff9add)",
              textDecoration: "none",
              padding: "3px 9px",
              border: "1px solid rgba(255, 154, 221, 0.22)",
              borderRadius: 999,
            }}
          >
            {category.name}
          </Link>
        )}
        <h3 className="okr__blog-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.005em" }}>
          <Link to={`/blog/${post.slug}`} style={{ color: "var(--okr-text)", textDecoration: "none" }}>
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="okr__blog-card-excerpt" style={{
            margin: 0,
            color: "var(--okr-muted)",
            fontSize: 13,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.excerpt}
          </p>
        )}
        <div className="okr__blog-card-meta" style={{
          marginTop: "auto",
          paddingTop: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 11,
          color: "var(--okr-dim, #6b6f7c)",
          flexWrap: "wrap",
        }}>
          <span>{author}</span>
          <span aria-hidden>·</span>
          <span>{fmtDate(post.published_at ?? post.created_at, lang)}</span>
          <span aria-hidden>·</span>
          <span>{t("blog_min_read", { count: readingTime })}</span>
          <span aria-hidden>·</span>
          <span>{t("blog_read_count", { count: formatPostReadCount(readCount, lang) })}</span>
        </div>
      </div>
    </article>
  );
}
