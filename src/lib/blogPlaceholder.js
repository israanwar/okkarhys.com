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

function wrapTitle(title, maxCharsPerLine = 24, maxLines = 3) {
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
  const base = lines.length <= 1 ? 58 : lines.length === 2 ? 48 : 38;
  const longest = Math.max(1, ...lines.map((line) => line.length));
  const fitted = Math.floor(642 / (longest * 0.58));
  return Math.max(30, Math.min(base, fitted));
}

function titleSvg(lines, seed) {
  const fontSize = fontSizeFor(lines);
  const lineHeight = fontSize * 1.12;
  const startY = 228 - ((lines.length - 1) * lineHeight) / 2;
  const accentIndex = lines.length > 1 ? Math.min(1, lines.length - 1) : 0;
  const accentWidth = Math.min(610, Math.max(210, lines[accentIndex].length * fontSize * 0.52));
  const markerY = startY + accentIndex * lineHeight - fontSize * 0.72;
  const markerFill = seed % 2 ? BRAND.graphiteSoft : BRAND.signalSoft;

  return (
    `<rect x="58" y="${markerY}" width="${accentWidth}" height="${fontSize * 0.82}" rx="3" fill="${markerFill}" opacity="0.86" transform="rotate(-0.7 360 ${markerY})"/>` +
    lines.map((line, index) => (
      `<text x="72" y="${startY + index * lineHeight}" font-family="Plus Jakarta Sans, Arial, system-ui, sans-serif" font-size="${fontSize}" font-weight="${index === accentIndex ? 830 : 800}" fill="${BRAND.ink}" letter-spacing="0">${xmlEsc(line)}</text>`
    )).join("")
  );
}

function categoryLabel(value) {
  return String(value || "Journal").replace(/&/g, "and").toUpperCase();
}

export function generateBlogCover({ title, category = "", slug = "" }) {
  const seed = hashString(`${slug}|${title}|${category}`);
  const lines = wrapTitle(title || "Untitled", seed % 2 ? 23 : 25, 3);
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
    titleSvg(lines, seed) +
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
