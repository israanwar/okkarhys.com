// Structured-data builders — pure functions yang return JSON-LD object
// siap di-stringify. Dipakai di src/components/seo/Seo.jsx dan
// scripts/generate-sitemap.mjs (indirectly). Tidak menyentuh DOM.
//
// Kenapa struktur ini penting:
// - SEO: rich result eligibility di Google (breadcrumb, article snippet).
// - GEO: AI crawler (GPTBot, ClaudeBot, PerplexityBot) pakai schema.org
//   untuk memahami entity + relationship di halaman.
// - AEO: BreadcrumbList + Article schema meningkatkan chance halaman
//   muncul di "People also ask" / featured snippet.

import { site as SITE } from "../data/site.js";

// Ambil canonical base URL (support settings override kalau nanti ada
// custom domain). Fallback ke site.url dari data/site.js.
function siteUrl(settings) {
  return (settings?.site_url || SITE.url).replace(/\/+$/, "");
}

// Absolute-ize path (leading /).
function absoluteUrl(path, settings) {
  if (!path) return siteUrl(settings);
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl(settings)}${clean}`;
}

// ==================================================================
// Organization — dipasang global di semua halaman. Bikin brand terlihat
// sebagai entity di Google Knowledge Graph + AI systems.
// ==================================================================
export function buildOrganization(settings) {
  const url = siteUrl(settings);
  const name = settings?.site_name || SITE.name;
  const description = settings?.description || SITE.description;

  const sameAs = [
    settings?.social_linkedin,
    settings?.social_github,
    settings?.social_instagram,
    settings?.social_twitter,
  ].filter(Boolean);

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name,
    url,
    description,
    logo: {
      "@type": "ImageObject",
      url: `${url}/assets/brand/favicon.svg`,
    },
  };

  if (sameAs.length > 0) org.sameAs = sameAs;
  if (settings?.email) org.email = settings.email;
  if (settings?.whatsapp_number) {
    org.telephone = settings.whatsapp_number;
  }

  return org;
}

// ==================================================================
// WebSite + SearchAction — bikin sitelinks searchbox eligible di Google.
// Blog search di /blog?q= dipakai sebagai search endpoint.
// ==================================================================
export function buildWebsite(settings) {
  const url = siteUrl(settings);
  const name = settings?.site_name || SITE.name;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
    inLanguage: "id-ID",
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ==================================================================
// BreadcrumbList — derived dari pathname. Simple heuristic:
// /blog/[slug] → Home > Blog > [pageTitle]
// /blog → Home > Blog
// /about → Home > About
// pageTitle di-inject kalau kita punya (blog detail, category).
// ==================================================================
const PATH_LABELS = {
  blog: "Blog",
  about: "Tentang",
  services: "Layanan",
  portfolio: "Portfolio",
  store: "Store",
  contact: "Kontak",
  sitemap: "Sitemap",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

export function buildBreadcrumb(pathname, currentTitle, settings) {
  const url = siteUrl(settings);
  const segments = (pathname || "/").split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Beranda",
      item: `${url}/`,
    },
  ];

  let cumulative = "";
  segments.forEach((seg, idx) => {
    cumulative += `/${seg}`;
    const isLast = idx === segments.length - 1;
    // Pakai currentTitle untuk segmen terakhir kalau di-provide.
    const name = isLast && currentTitle
      ? currentTitle
      : (PATH_LABELS[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    items.push({
      "@type": "ListItem",
      position: idx + 2,
      name,
      item: `${url}${cumulative}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// ==================================================================
// Article / BlogPosting — schema untuk blog post detail.
// Menyertakan author, publisher, datePublished, dateModified,
// image, articleSection (kategori), wordCount (approx dari reading time).
// ==================================================================
export function buildArticle(post, category, settings) {
  const url = siteUrl(settings);
  const canonicalPath = post.canonical_path || `/blog/${post.slug}`;
  const canonical = absoluteUrl(canonicalPath, settings);

  // Author display — sistem ini masih single-author. Kalau nanti multi,
  // resolve via usersRepo.
  const authorName = post.author_name || "Okka Rhys";

  // Cover image — pakai cover_url kalau ada, else absolute favicon
  // (biar Article schema tetap valid dengan image field). Ideally
  // admin upload real cover; ini fallback.
  const imageUrl = post.cover_url
    ? absoluteUrl(post.cover_url, settings)
    : `${url}/assets/brand/favicon.svg`;

  // Approximate word count dari reading_time (200 wpm).
  const wordCount = post.reading_time ? post.reading_time * 200 : undefined;

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    headline: post.title,
    description: post.meta_description || post.excerpt,
    inLanguage: "id-ID",
    url: canonical,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${url}/about`,
    },
    publisher: { "@id": `${url}/#organization` },
    keywords: [post.focus_keyword, ...(post.tags || [])].filter(Boolean).join(", "),
  };

  if (category?.name) {
    article.articleSection = category.name;
  }
  if (wordCount) {
    article.wordCount = wordCount;
  }

  return article;
}

// ==================================================================
// FAQPage — untuk section "Pertanyaan yang sering muncul" di artikel.
// Bikin post eligible untuk "People also ask" & featured snippet di Google.
// AI answer engine (GPTBot, ClaudeBot, PerplexityBot) juga pakai FAQ schema
// buat direct-answer extraction.
//
// Input: array [{ question, answer }]. Kembalikan null kalau kosong
// supaya Seo.jsx bisa clear schema tag tanpa error.
// ==================================================================
export function buildFaqPage(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
