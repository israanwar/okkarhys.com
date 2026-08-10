const STORE_WATERMARK = "OKKARHYS - STORE";

const PALETTES = {
  google: {
    key: "google",
    label: "GOOGLE SYSTEM",
    bg: "#ffe45e",
    bg2: "#fff8d7",
    ink: "#101720",
    muted: "#44515d",
    line: "#101720",
    panel: "#fffef4",
    accent: "#ff4da6",
    accent2: "#48b9ff",
    chip: "#ffffff",
    chip2: "#77d66d",
    footer: "#16304a",
    glow: "#ffffff",
    isDark: false,
  },
  music: {
    key: "music",
    label: "MUSIC SYSTEM",
    bg: "#ffb7e8",
    bg2: "#e7f1ff",
    ink: "#14101c",
    muted: "#61566f",
    line: "#14101c",
    panel: "#fff9fd",
    accent: "#7b4dff",
    accent2: "#ff4da6",
    chip: "#ffffff",
    chip2: "#ffd7f0",
    footer: "#31214f",
    glow: "#ffffff",
    isDark: false,
  },
  workflow: {
    key: "workflow",
    label: "WORKFLOW KIT",
    bg: "#8ee8ff",
    bg2: "#ecfff7",
    ink: "#10202a",
    muted: "#40515d",
    line: "#10202a",
    panel: "#fbfffb",
    accent: "#ff4da6",
    accent2: "#b9ff5c",
    chip: "#ffffff",
    chip2: "#d9ff74",
    footer: "#193844",
    glow: "#ffffff",
    isDark: false,
  },
  commerce: {
    key: "commerce",
    label: "GROWTH KIT",
    bg: "#ff5aad",
    bg2: "#ffe9f6",
    ink: "#161018",
    muted: "#5c4f5a",
    line: "#161018",
    panel: "#fff7fb",
    accent: "#ffdf4f",
    accent2: "#52d5ff",
    chip: "#ffffff",
    chip2: "#fff087",
    footer: "#32172a",
    glow: "#ffffff",
    isDark: false,
  },
  default: {
    key: "default",
    label: "DIGITAL PRODUCT",
    bg: "#f5f7ff",
    bg2: "#ffdff1",
    ink: "#12131a",
    muted: "#565b68",
    line: "#12131a",
    panel: "#ffffff",
    accent: "#ff4da6",
    accent2: "#55d6ff",
    chip: "#fff2fb",
    chip2: "#d7f5ff",
    footer: "#242634",
    glow: "#ffffff",
    isDark: false,
  },
};

const GOOGLE_WORDS = [
  "google",
  "adsense",
  "ad sense",
  "search engine",
  "search console",
  "analytics",
  "ga4",
  "tag manager",
  "youtube",
  "seo",
  "sem",
];

const MUSIC_WORDS = [
  "music",
  "musik",
  "soundon",
  "tunecore",
  "spotify",
  "apple music",
  "audio",
  "song",
  "lagu",
  "streaming",
  "royalty",
  "artist",
];

const WORKFLOW_WORDS = [
  "workflow",
  "automation",
  "automasi",
  "ai",
  "prompt",
  "notion",
  "excel",
  "dashboard",
  "template",
  "checklist",
  "worksheet",
  "workbook",
  "planner",
  "framework",
  "playbook",
  "sop",
  "productivity",
  "operating",
  "calendar",
  "system",
];

const COMMERCE_WORDS = [
  "ecommerce",
  "e-commerce",
  "marketplace",
  "sales",
  "funnel",
  "launch",
  "ads",
  "marketing",
  "brand",
  "branding",
  "copywriting",
  "content",
  "affiliate",
  "business",
];

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

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function cleanTitle(name) {
  return String(name || "Untitled Product")
    .replace(/^(module|modul)\s*:\s*/i, "")
    .replace(/^bundle\s*:\s*/i, "Bundle ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyProduct(product = {}) {
  const identity = [
    product.slug,
    product.name,
    product.category,
  ].join(" ").toLowerCase();
  const fullText = [
    identity,
    product.description,
  ].join(" ").toLowerCase();

  if (hasAny(fullText, MUSIC_WORDS)) return PALETTES.music;
  if (hasAny(identity, GOOGLE_WORDS)) return PALETTES.google;
  if (hasAny(identity, WORKFLOW_WORDS)) return PALETTES.workflow;
  if (hasAny(identity, COMMERCE_WORDS)) return PALETTES.commerce;
  return PALETTES.default;
}

function wrapTitle(title, maxCharsPerLine = 16, maxLines = 4) {
  const words = String(title || "UNTITLED PRODUCT")
    .toUpperCase()
    .replace(/\s*&\s*/g, " & ")
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
  const base = lines.length <= 1 ? 66 : lines.length === 2 ? 50 : lines.length === 3 ? 42 : 35;
  const longest = Math.max(1, ...lines.map((line) => line.length));
  const maxWidth = lines.length <= 1 ? 570 : 520;
  const charRatio = lines.length <= 1 ? 0.64 : 0.74;
  const fitted = Math.floor(maxWidth / (longest * charRatio));
  return Math.max(30, Math.min(base, fitted));
}

function chipSvg({ x, y, label, bg, ink, rotate = 0 }) {
  const width = Math.max(74, label.length * 10 + 28);
  return (
    `<g transform="rotate(${rotate} ${x + width / 2} ${y + 19})">` +
    `<rect x="${x}" y="${y}" width="${width}" height="38" rx="12" fill="${bg}" stroke="${ink}" stroke-width="3"/>` +
    `<text x="${x + width / 2}" y="${y + 24}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="12" font-weight="900" fill="${ink}" letter-spacing="1.2">${xmlEsc(label)}</text>` +
    `</g>`
  );
}

function titleSvg(lines, palette) {
  const fontSize = fontSizeFor(lines);
  const lineHeight = fontSize * 1.08;
  const startY = 236 - ((lines.length - 1) * lineHeight) / 2;
  const highlightIndex = lines.length > 1 ? Math.min(1, lines.length - 1) : -1;
  const highlight = highlightIndex >= 0
    ? `<rect x="72" y="${startY + highlightIndex * lineHeight - fontSize * 0.72}" width="586" height="${fontSize * 0.84}" rx="3" fill="${palette.accent}" opacity="0.9" transform="rotate(-1.4 365 ${startY + highlightIndex * lineHeight})"/>`
    : "";

  const text = lines.map((line, index) => (
    `<text x="92" y="${startY + index * lineHeight}" font-family="Arial Black, Arial, system-ui, sans-serif" font-size="${fontSize}" font-weight="900" fill="${palette.ink}" letter-spacing="0">${xmlEsc(line)}</text>`
  )).join("");

  return highlight + text;
}

function backgroundSvg(palette, seed) {
  const offset = seed % 34;
  return (
    `<rect width="800" height="600" fill="${palette.bg}"/>` +
    `<rect width="800" height="600" fill="url(#baseBlend)" opacity="0.95"/>` +
    `<path d="M0 104 C174 22 288 50 420 108 C550 166 672 142 800 54 V0 H0 Z" fill="${palette.glow}" opacity="0.54"/>` +
    `<circle cx="${682 - offset}" cy="${502 - offset}" r="236" fill="${palette.accent}" opacity="0.18"/>` +
    `<circle cx="${138 + offset}" cy="116" r="168" fill="${palette.accent2}" opacity="0.26"/>` +
    `<path d="M536 -12 L824 250 L804 310 L472 12 Z" fill="${palette.accent}" opacity="0.72"/>` +
    `<path d="M-34 438 L382 564 L336 632 L-80 504 Z" fill="${palette.accent2}" opacity="0.72"/>` +
    `<g opacity="0.18" stroke="${palette.line}" stroke-width="4" fill="none">` +
    `<path d="M612 350 L820 514"/>` +
    `<path d="M638 308 L846 472"/>` +
    `<path d="M666 266 L874 430"/>` +
    `<circle cx="626" cy="144" r="82"/>` +
    `</g>` +
    `<g opacity="0.08" stroke="${palette.line}" stroke-width="1">` +
    Array.from({ length: 8 }).map((_, i) => `<path d="M${80 + i * 72} 0 V600"/>`).join("") +
    Array.from({ length: 6 }).map((_, i) => `<path d="M0 ${82 + i * 72} H800"/>`).join("") +
    `</g>`
  );
}

function frameSvg(palette) {
  return (
    `<rect x="30" y="28" width="740" height="544" rx="34" fill="${palette.panel}" opacity="0.92" stroke="${palette.line}" stroke-opacity="0.52" stroke-width="3"/>` +
    `<rect x="50" y="46" width="700" height="508" rx="24" fill="none" stroke="${palette.line}" stroke-opacity="0.14" stroke-width="2"/>` +
    `<path d="M58 86 H318" stroke="${palette.line}" stroke-opacity="0.4" stroke-width="3"/>` +
    `<path d="M58 512 H742" stroke="${palette.line}" stroke-opacity="0.24" stroke-width="2"/>`
  );
}

function ornamentSvg(palette, seed) {
  const chips = palette.key === "google"
    ? ["SEARCH", "ADS", "YIELD"]
    : palette.key === "music"
      ? ["AUDIO", "RIGHTS", "RELEASE"]
      : palette.key === "workflow"
        ? ["FLOW", "SYSTEM", "OUTPUT"]
        : palette.key === "commerce"
          ? ["OFFER", "SALES", "GROWTH"]
          : ["LINES", "FORMS", "LIGHT"];
  const rotate = (seed % 7) - 3;
  return (
    chipSvg({ x: 590, y: 52, label: chips[0], bg: palette.chip, ink: palette.ink, rotate }) +
    chipSvg({ x: 76, y: 424, label: chips[1], bg: palette.chip2, ink: palette.ink, rotate: -rotate }) +
    chipSvg({ x: 574, y: 466, label: chips[2], bg: palette.panel, ink: palette.ink, rotate: rotate + 2 }) +
    `<g transform="rotate(-3 410 354)">` +
    `<rect x="52" y="326" width="560" height="52" rx="2" fill="${palette.accent2}" opacity="0.78" stroke="${palette.line}" stroke-opacity="0.5" stroke-width="3"/>` +
    `</g>` +
    `<rect x="600" y="168" width="112" height="112" rx="18" fill="${palette.accent}" opacity="0.16" stroke="${palette.line}" stroke-opacity="0.28" stroke-width="3"/>` +
    `<path d="M704 498 l34 0 l-16 16" fill="none" stroke="${palette.footer}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>`
  );
}

function metaSvg(category, palette) {
  return (
    `<text x="92" y="76" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="800" fill="${palette.muted}" letter-spacing="4">${xmlEsc(String(category || palette.label).toUpperCase())}</text>` +
    `<text x="92" y="542" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="700" fill="${palette.footer}" opacity="0.74" letter-spacing="4">${xmlEsc(STORE_WATERMARK)}</text>`
  );
}

export function generateStoreCover(product = {}) {
  const category = product.category || "Digital Product";
  const title = cleanTitle(product.name);
  const palette = classifyProduct(product);
  const seed = hashString(`${product.slug || ""} ${product.name || ""}`);
  const lines = wrapTitle(title, seed % 3 === 0 ? 15 : 16, 4);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<linearGradient id="baseBlend" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${palette.bg}"/>` +
    `<stop offset="0.58" stop-color="${palette.bg}"/>` +
    `<stop offset="1" stop-color="${palette.bg2}"/>` +
    `</linearGradient>` +
    `</defs>` +
    backgroundSvg(palette, seed) +
    frameSvg(palette) +
    ornamentSvg(palette, seed) +
    metaSvg(category, palette) +
    titleSvg(lines, palette) +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function isGeneratedStoreCover(url) {
  if (!url) return true;
  if (!String(url).startsWith("data:image/svg+xml")) return false;
  try {
    const payload = String(url).split(",").slice(1).join(",");
    const decoded = decodeURIComponent(payload);
    return decoded.includes("OKKARHYS") && decoded.includes("STORE");
  } catch {
    return String(url).includes("OKKARHYS");
  }
}

export function resolveProductCover(product) {
  if (product?.image_url && !isGeneratedStoreCover(product.image_url)) return product.image_url;
  return generateStoreCover(product);
}
