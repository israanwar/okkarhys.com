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
      <div className="okr__blog-card-body">
        {category && (
          <Link
            className="okr__blog-card-category"
            to={`/blog/${category.slug}`}
          >
            {category.name}
          </Link>
        )}
        <h3 className="okr__blog-card-title">
          <Link className="okr__blog-card-title-link" to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="okr__blog-card-excerpt">
            {post.excerpt}
          </p>
        )}
        <div className="okr__blog-card-meta">
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
