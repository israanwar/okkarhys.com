const BRAND = {
  paper: "#ffffff",
  paperSoft: "#f8fafc",
  ink: "#121722",
  graphite: "#27303d",
  graphiteSoft: "#eef2f6",
  muted: "#69727d",
  dim: "#9ba5af",
  line: "#d8e0e8",
  signal: "#2fb9c8",
  signalSoft: "#e8fbff",
  lime: "#e3f5a8",
  watermark: "OKKARHYS - JOURNAL",
};

function xmlEsc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hashString(value) {
  let hash = 0;
  const input = String(value ?? "");
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Skeleton-style title placeholders. We intentionally do NOT bake the real
// post title into the SVG anymore — the article card already renders the
// title as HTML text below the cover, so putting it inside the artwork
// meant (a) the title was rendered twice and (b) whenever the image
// container's aspect ratio differed from the SVG's native 16:9 (e.g.
// mobile 4:3), `background-size: cover` cropped the left+right edges and
// the first characters of the title were sliced off. Skeleton rects read
// as a designed editorial layout and never clip visibly.
function titlePlaceholderSvg(seed) {
  // Three lines of varying widths, keyed off the seed so each post gets a
  // slightly different "layout" without importing per-post data.
  const rows = [
    { y: 178, width: 604 + (seed % 3) * 24 },
    { y: 220, width: 484 + ((seed >> 2) % 3) * 40 },
    { y: 262, width: seed % 4 === 0 ? 360 : 428 + ((seed >> 3) % 3) * 32 },
  ];
  const accentIndex = seed % 3 === 0 ? 0 : 1;
  const accentFill = seed % 2 ? BRAND.graphiteSoft : BRAND.signalSoft;

  return (
    // The accent block sits behind one of the skeleton rows for the same
    // "highlight bar" energy the old title had.
    `<rect x="60" y="${rows[accentIndex].y - 6}" width="${Math.min(rows[accentIndex].width + 22, 630)}" height="42" rx="4" fill="${accentFill}" opacity="0.82" transform="rotate(-0.6 360 ${rows[accentIndex].y})"/>` +
    rows.map(({ y, width }) => (
      `<rect x="72" y="${y}" width="${width}" height="28" rx="3" fill="${BRAND.ink}" fill-opacity="${seed % 2 ? 0.86 : 0.9}"/>`
    )).join("")
  );
}

function categoryLabel(value) {
  return String(value || "Journal").replace(/&/g, "and").toUpperCase();
}

export function generateBlogCover({ title, category = "", slug = "" }) {
  const seed = hashString(`${slug}|${title}|${category}`);
  const topShift = seed % 34;
  const badge = seed % 2 ? "FIELD NOTE" : "SIGNAL";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${BRAND.paper}"/>` +
    `<stop offset="0.58" stop-color="${BRAND.paper}"/>` +
    `<stop offset="1" stop-color="${BRAND.paperSoft}"/>` +
    `</linearGradient>` +
    `<pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">` +
    `<path d="M34 0H0V34" fill="none" stroke="${BRAND.line}" stroke-opacity="0.38" stroke-width="1"/>` +
    `</pattern>` +
    `</defs>` +
    `<rect width="800" height="450" fill="url(#paper)"/>` +
    `<rect width="800" height="450" fill="url(#grid)" opacity="0.3"/>` +
    `<path d="M0 ${82 + topShift} C158 ${38 + topShift} 260 ${122 + topShift} 418 ${76 + topShift} C552 ${38 + topShift} 646 ${92 + topShift} 800 ${56 + topShift}" fill="none" stroke="${BRAND.signal}" stroke-opacity="0.18" stroke-width="12"/>` +
    `<path d="M-28 396 C132 330 274 414 426 352 C552 300 660 338 842 278" fill="none" stroke="${BRAND.graphite}" stroke-opacity="0.09" stroke-width="20"/>` +
    `<rect x="34" y="28" width="732" height="394" rx="20" fill="#ffffff" fill-opacity="0.86" stroke="${BRAND.line}" stroke-width="1.6"/>` +
    `<path d="M34 104 H766" stroke="${BRAND.line}" stroke-opacity="0.85" stroke-width="2"/>` +
    `<rect x="58" y="52" width="192" height="32" rx="6" fill="${BRAND.ink}"/>` +
    `<text x="154" y="73" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" font-weight="800" fill="${BRAND.signalSoft}" letter-spacing="3">${xmlEsc(categoryLabel(category))}</text>` +
    `<rect x="592" y="52" width="110" height="32" rx="6" fill="${BRAND.graphiteSoft}" stroke="${BRAND.ink}" stroke-opacity="0.14"/>` +
    `<text x="647" y="73" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" font-weight="800" fill="${BRAND.graphite}" letter-spacing="1.8">${xmlEsc(badge)}</text>` +
    `<circle cx="718" cy="68" r="4" fill="${BRAND.signal}" opacity="0.62"/>` +
    `<rect x="72" y="326" width="318" height="24" rx="3" fill="${BRAND.lime}" stroke="${BRAND.ink}" stroke-opacity="0.1" transform="rotate(-1 230 338)"/>` +
    `<rect x="548" y="286" width="126" height="92" rx="10" fill="${BRAND.signalSoft}" opacity="0.62"/>` +
    titlePlaceholderSvg(seed) +
    `<text x="72" y="394" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" font-weight="700" fill="${BRAND.dim}" letter-spacing="3">${xmlEsc(BRAND.watermark)}</text>` +
    `<path d="M710 386 l34 0 l-16 16" fill="none" stroke="${BRAND.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.48"/>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function isGeneratedBlogCover(url) {
  if (!url) return true;
  if (!String(url).startsWith("data:image/svg+xml")) return false;
  try {
    const payload = String(url).split(",").slice(1).join(",");
    const decoded = decodeURIComponent(payload);
    return decoded.includes("OKKARHYS") && (decoded.includes("BLOG") || decoded.includes("JOURNAL"));
  } catch {
    return String(url).includes("OKKARHYS");
  }
}

export function resolveCover(post, category) {
  if (post?.cover_url && !isGeneratedBlogCover(post.cover_url)) return post.cover_url;
  return generateBlogCover({
    title: post?.title ?? "Untitled",
    slug: post?.slug ?? "",
    category: category?.short ?? category?.name ?? "",
  });
}
