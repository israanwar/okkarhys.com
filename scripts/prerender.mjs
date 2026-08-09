// Prerender per-route static HTML (head only) untuk SEO/GEO/AEO.
// Dijalankan otomatis sebagai `postbuild` script setelah vite build.
//
// Strategi (zero-risk):
// - Nggak sentuh <body> — <div id="root"> tetap kosong, React tetap render
//   di client dengan cara yang sama seperti sekarang. Zero hydration
//   mismatch risk karena tidak ada content pre-rendered yang mesti match.
// - Cuma modifikasi <head>: title, meta description, OG, Twitter Card,
//   canonical, dan inject JSON-LD structured data.
// - Output per-route index.html file. Static host (Vercel/Netlify/Nginx)
//   auto-serve folder-based /path/index.html untuk URL /path.
//
// Kalau script ini gagal, dist/ tetap punya index.html SPA fallback yang
// bekerja normal. Rollback = hapus postbuild script + hapus folder.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const { OKKARHYS_BLOG_POSTS_SEED } = await import(
  `file://${projectRoot}/src/data/blogSeedOkkaVoice.js`
);
const { BLOG_CATEGORIES, CATEGORY_BY_SLUG, DEFAULT_CATEGORY_SLUG } = await import(
  `file://${projectRoot}/src/data/blogCategories.js`
);
const structuredData = await import(
  `file://${projectRoot}/src/lib/structuredData.js`
);

const SITE_URL = "https://okkarhys.com";
const SITE_NAME = "OKKARHYS";
const DEFAULT_DESCRIPTION =
  "Web, SEO, AI workflow & content strategy for personal brands and businesses.";

// Settings context untuk schema builders (mirror struktur useLiveSettings).
const settings = {
  site_name: SITE_NAME,
  site_url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
};

const distDir = resolve(projectRoot, "dist");
const templatePath = resolve(distDir, "index.html");

// Read template SEKALI di awal. Kita simpan ke variabel supaya kalau
// overwrite dist/index.html buat homepage prerender, template tetap
// tersedia untuk route lain.
const TEMPLATE = readFileSync(templatePath, "utf8");

// -----------------------------------------------------------------------
// HTML manipulation helpers — surgical string replace, tanpa parser.
// Aman karena template Vite deterministic + kita kontrol structure-nya.
// -----------------------------------------------------------------------

function xmlEsc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setLang(html, lang) {
  return html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${xmlEsc(lang)}"`);
}

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${xmlEsc(title)}</title>`);
}

// Replace atau insert <meta name="X" content="Y" /> (atau property="X").
// Regex support multi-line format Vite (attribute di line berbeda).
function upsertMeta(html, attrName, attrValue, content) {
  const escapedName = attrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedValue = attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `<meta\\s+${escapedName}="${escapedValue}"\\s+content="[^"]*"\\s*/?>`,
    "is"
  );
  const replacement = `<meta ${attrName}="${attrValue}" content="${xmlEsc(content)}" />`;
  if (re.test(html)) return html.replace(re, replacement);
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function setCanonical(html, url) {
  const re = /<link\s+rel="canonical"[^>]*\/?>/is;
  const replacement = `<link rel="canonical" href="${xmlEsc(url)}" />`;
  if (re.test(html)) return html.replace(re, replacement);
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function injectJsonLd(html, schemas) {
  const scripts = schemas
    .filter(Boolean)
    .map(
      ({ name, data }) =>
        `    <script type="application/ld+json" data-schema="${name}">${JSON.stringify(data)}</script>`
    )
    .join("\n");
  return html.replace("</head>", `${scripts}\n  </head>`);
}

// -----------------------------------------------------------------------
// Per-route builder — turn route object jadi final HTML string.
// -----------------------------------------------------------------------

function buildRouteHtml(route) {
  let html = TEMPLATE;

  // Language tag — semua konten lo bahasa Indonesia.
  html = setLang(html, "id-ID");

  // Title format: "Page | OKKARHYS", kecuali homepage cuma "OKKARHYS".
  const pageTitle =
    route.title === SITE_NAME ? SITE_NAME : `${route.title} | ${SITE_NAME}`;
  html = setTitle(html, pageTitle);

  // Canonical URL — hilangkan trailing slash kecuali root.
  const canonical =
    route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  html = setCanonical(html, canonical);

  // Meta tags (update existing atau insert).
  html = upsertMeta(html, "name", "description", route.description);
  html = upsertMeta(html, "property", "og:title", pageTitle);
  html = upsertMeta(html, "property", "og:description", route.description);
  html = upsertMeta(html, "property", "og:url", canonical);
  html = upsertMeta(html, "property", "og:type", route.ogType || "website");
  html = upsertMeta(html, "property", "og:site_name", SITE_NAME);
  html = upsertMeta(html, "name", "twitter:title", pageTitle);
  html = upsertMeta(html, "name", "twitter:description", route.description);
  html = upsertMeta(html, "name", "twitter:card", "summary");

  // Article-specific OG (untuk blog post).
  if (route.article) {
    const { post } = route.article;
    html = upsertMeta(html, "property", "article:published_time", post.published_at || "");
    html = upsertMeta(html, "property", "article:modified_time", post.updated_at || post.published_at || "");
    if (post.tags && post.tags.length > 0) {
      html = upsertMeta(html, "property", "article:tag", post.tags.join(", "));
    }
  }

  // JSON-LD structured data. Idempotent via data-schema attribute:
  // Seo.jsx runtime injection ketemu tag ini, replace bukan duplikat.
  const schemas = [
    { name: "organization", data: structuredData.buildOrganization(settings) },
    { name: "website", data: structuredData.buildWebsite(settings) },
    { name: "person", data: structuredData.buildPerson(settings) },
    { name: "service", data: structuredData.buildProfessionalService(settings) },
    {
      name: "webpage",
      data: structuredData.buildWebPage(route.path, pageTitle, route.description, settings),
    },
    {
      name: "breadcrumb",
      data: structuredData.buildBreadcrumb(route.path, route.currentTitle, settings),
    },
  ];
  if (route.article) {
    schemas.push({
      name: "article",
      data: structuredData.buildArticle(route.article.post, route.article.category, settings),
    });
    if (route.article.post.faqs && route.article.post.faqs.length > 0) {
      schemas.push({
        name: "faq",
        data: structuredData.buildFaqPage(route.article.post.faqs),
      });
    }
  }
  html = injectJsonLd(html, schemas);

  return html;
}

// -----------------------------------------------------------------------
// Route definitions — 10 static + 16 kategori + 21 posts = 47 route.
// Match dengan sitemap.xml.
// -----------------------------------------------------------------------

const routes = [
  {
    path: "/",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    ogType: "website",
  },
  {
    path: "/about",
    title: "Tentang",
    description:
      "Tentang Okkarhys — studio konsultasi digital untuk web development, SEO, AI workflow, dan strategi konten.",
    ogType: "website",
  },
  {
    path: "/services",
    title: "Layanan",
    description:
      "Layanan Okkarhys — audit website, SEO, AI workflow, dan strategi konten untuk personal brand dan bisnis.",
    ogType: "website",
  },
  {
    path: "/portfolio",
    title: "Portfolio",
    description:
      "Portfolio proyek Okkarhys — web development, SEO growth, event, dan brand campaign.",
    ogType: "website",
  },
  {
    path: "/store",
    title: "Store",
    description:
      "Store Okkarhys — template, playbook, dan resource digital untuk personal brand serta bisnis.",
    ogType: "website",
  },
  {
    path: "/blog",
    title: "Blog",
    description:
      "Blog Okkarhys — analisis, opini, case study, dan esai seputar SEO, AI, branding, dan strategi bisnis digital.",
    ogType: "website",
  },
  {
    path: "/sitemap",
    title: "Sitemap",
    description:
      "Peta situs Okkarhys — daftar lengkap halaman dan artikel blog per kategori.",
    ogType: "website",
  },
  {
    path: "/contact",
    title: "Kontak",
    description:
      "Hubungi Okkarhys untuk konsultasi web, SEO, AI workflow, dan strategi digital.",
    ogType: "website",
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Privacy Policy resmi Okkarhys.",
    ogType: "website",
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description: "Terms of Service resmi Okkarhys.",
    ogType: "website",
  },
];

// Kategori pages — filter list per kategori.
BLOG_CATEGORIES.forEach((c) => {
  routes.push({
    path: `/blog/${c.slug}`,
    title: c.name,
    description: c.description,
    currentTitle: c.name,
    ogType: "website",
  });
});

// Blog post pages — dengan Article + FAQPage schema.
const publishedPosts = OKKARHYS_BLOG_POSTS_SEED.filter((p) => p.status === "published");
publishedPosts.forEach((post) => {
  const category =
    CATEGORY_BY_SLUG[post.category] || CATEGORY_BY_SLUG[DEFAULT_CATEGORY_SLUG];
  routes.push({
    path: `/blog/${post.slug}`,
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    currentTitle: post.title,
    ogType: "article",
    article: { post, category },
  });
});

// -----------------------------------------------------------------------
// Execute — generate + write per-route HTML.
// -----------------------------------------------------------------------

let staticCount = 0;
let categoryCount = 0;
let postCount = 0;

routes.forEach((route) => {
  const html = buildRouteHtml(route);
  const outputPath =
    route.path === "/"
      ? resolve(distDir, "index.html")
      : resolve(distDir, route.path.slice(1), "index.html");

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html, "utf8");

  if (route.article) postCount++;
  else if (route.path.startsWith("/blog/")) categoryCount++;
  else staticCount++;
});

console.log(`✓ prerender complete → ${routes.length} HTML files`);
console.log(`  · ${staticCount} static pages`);
console.log(`  · ${categoryCount} blog categories`);
console.log(`  · ${postCount} blog posts`);
