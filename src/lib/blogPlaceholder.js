const BRAND = {
  bgTop: "#170716",
  bgMid: "#10040d",
  bgBot: "#050103",
  panel: "#24101f",
  panel2: "#34142a",
  accent: "#e044a8",
  accentSoft: "#ff9add",
  cool: "#7db6df",
  ink: "#f4edf3",
  muted: "#c4aabb",
  dim: "#786576",
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

function wrapTitle(title, maxCharsPerLine = 25, maxLines = 3) {
  const words = String(title || "Untitled")
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = (line + " " + word).trim();
    if (next.length > maxCharsPerLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length === maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (words.join(" ").length > lines.join(" ").length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/\.+$/, "")}...`;
  }
  return lines;
}

function fontSizeFor(lines) {
  const base = lines.length <= 1 ? 50 : lines.length === 2 ? 42 : 35;
  const longest = Math.max(1, ...lines.map((line) => line.length));
  const fitted = Math.floor(632 / (longest * 0.58));
  return Math.max(28, Math.min(base, fitted));
}

function titleSvg(lines) {
  const fontSize = fontSizeFor(lines);
  const lineHeight = fontSize * 1.17;
  const startY = 230 - ((lines.length - 1) * lineHeight) / 2;
  return lines.map((line, index) => (
    `<text x="64" y="${startY + index * lineHeight}" font-family="Plus Jakarta Sans, Arial, system-ui, sans-serif" font-size="${fontSize}" font-weight="800" fill="${BRAND.ink}" letter-spacing="-0.7">${xmlEsc(line)}</text>`
  )).join("");
}

function categoryLabel(value) {
  return String(value || "Journal").replace(/&/g, "and").toUpperCase();
}

export function generateBlogCover({ title, category = "", slug = "" }) {
  const seed = hashString(`${slug}|${title}|${category}`);
  const lines = wrapTitle(title || "Untitled", seed % 2 ? 24 : 27, 3);
  const topShift = seed % 38;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<linearGradient id="base" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${BRAND.bgTop}"/>` +
    `<stop offset="0.54" stop-color="${BRAND.bgMid}"/>` +
    `<stop offset="1" stop-color="${BRAND.bgBot}"/>` +
    `</linearGradient>` +
    `<linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#ffffff" stop-opacity="0.105"/>` +
    `<stop offset="0.45" stop-color="#ffffff" stop-opacity="0.03"/>` +
    `<stop offset="1" stop-color="${BRAND.accent}" stop-opacity="0.07"/>` +
    `</linearGradient>` +
    `<radialGradient id="aurora" cx="0.5" cy="0" r="0.82">` +
    `<stop offset="0" stop-color="${BRAND.accentSoft}" stop-opacity="0.18"/>` +
    `<stop offset="0.38" stop-color="${BRAND.accent}" stop-opacity="0.1"/>` +
    `<stop offset="1" stop-color="${BRAND.accent}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `<radialGradient id="cool" cx="0.1" cy="0.9" r="0.62">` +
    `<stop offset="0" stop-color="${BRAND.cool}" stop-opacity="0.1"/>` +
    `<stop offset="1" stop-color="${BRAND.cool}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `<pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">` +
    `<path d="M34 0H0V34" fill="none" stroke="#fff" stroke-opacity="0.035" stroke-width="1"/>` +
    `</pattern>` +
    `<filter id="grain" x="-10%" y="-10%" width="120%" height="120%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="0"/>` +
    `<feComponentTransfer><feFuncA type="table" tableValues="0 0.032"/></feComponentTransfer>` +
    `</filter>` +
    `</defs>` +
    `<rect width="800" height="450" fill="url(#base)"/>` +
    `<rect width="800" height="450" fill="url(#aurora)"/>` +
    `<rect width="800" height="450" fill="url(#cool)"/>` +
    `<rect width="800" height="450" fill="url(#grid)" opacity="0.86"/>` +
    `<rect width="800" height="450" fill="#fff" filter="url(#grain)" opacity="0.78"/>` +
    `<path d="M0 ${90 + topShift} C148 ${45 + topShift} 240 ${130 + topShift} 394 ${82 + topShift} C526 ${40 + topShift} 638 ${90 + topShift} 800 ${54 + topShift}" fill="none" stroke="${BRAND.accentSoft}" stroke-opacity="0.13" stroke-width="24"/>` +
    `<path d="M0 ${116 + topShift} C158 ${72 + topShift} 254 ${156 + topShift} 408 ${108 + topShift} C540 ${66 + topShift} 652 ${116 + topShift} 800 ${82 + topShift}" fill="none" stroke="${BRAND.cool}" stroke-opacity="0.07" stroke-width="18"/>` +
    `<rect x="30" y="30" width="740" height="390" rx="28" fill="${BRAND.panel}" fill-opacity="0.4" stroke="#fff" stroke-opacity="0.12" stroke-width="1.2"/>` +
    `<rect x="31" y="31" width="738" height="388" rx="27" fill="url(#panel)" opacity="0.75"/>` +
    `<path d="M58 86 H316" stroke="${BRAND.accentSoft}" stroke-opacity="0.28" stroke-width="1.2"/>` +
    `<path d="M58 382 H742" stroke="${BRAND.accent}" stroke-opacity="0.12" stroke-width="1.2"/>` +
    `<rect x="506" y="270" width="206" height="56" rx="3" fill="${BRAND.panel2}" fill-opacity="0.62" stroke="${BRAND.accentSoft}" stroke-opacity="0.13"/>` +
    `<rect x="530" y="292" width="140" height="7" rx="3.5" fill="${BRAND.accentSoft}" fill-opacity="0.36"/>` +
    `<circle cx="708" cy="72" r="4" fill="${BRAND.accentSoft}" fill-opacity="0.9"/>` +
    `<circle cx="708" cy="72" r="18" fill="${BRAND.accent}" fill-opacity="0.12"/>` +
    `<circle cx="650" cy="110" r="62" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="2"/>` +
    `<text x="58" y="70" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="700" fill="${BRAND.muted}" letter-spacing="4">${xmlEsc(categoryLabel(category))}</text>` +
    titleSvg(lines) +
    `<text x="58" y="402" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" font-weight="600" fill="${BRAND.dim}" letter-spacing="3">${xmlEsc(BRAND.watermark)}</text>` +
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
