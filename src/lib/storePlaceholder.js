const STORE_WATERMARK = "OKKARHYS - STORE";

const PALETTES = {
  google: {
    key: "google",
    label: "GOOGLE SYSTEM",
    bg: "#efd557",
    bg2: "#e4bf47",
    ink: "#12263a",
    muted: "#39495a",
    line: "#12263a",
    panel: "#fff4b7",
    accent: "#e9578e",
    accent2: "#70b7e5",
    chip: "#f8e782",
    chip2: "#f15b91",
    footer: "#26394b",
    glow: "#fff2a6",
    isDark: false,
  },
  music: {
    key: "music",
    label: "MUSIC SYSTEM",
    bg: "#170613",
    bg2: "#28142a",
    ink: "#f7ecf6",
    muted: "#c4aeba",
    line: "#f7ecf6",
    panel: "#221126",
    accent: "#6c4cff",
    accent2: "#d84b91",
    chip: "#2c1833",
    chip2: "#5a3364",
    footer: "#bda8b9",
    glow: "#a45cff",
    isDark: true,
  },
  workflow: {
    key: "workflow",
    label: "WORKFLOW KIT",
    bg: "#77b8df",
    bg2: "#e8e5d7",
    ink: "#13273b",
    muted: "#30475a",
    line: "#13273b",
    panel: "#f7f3e9",
    accent: "#e95892",
    accent2: "#efd45b",
    chip: "#dfeef7",
    chip2: "#efd45b",
    footer: "#23394b",
    glow: "#f8f2cf",
    isDark: false,
  },
  commerce: {
    key: "commerce",
    label: "GROWTH KIT",
    bg: "#e6538c",
    bg2: "#b83a72",
    ink: "#12263a",
    muted: "#27384a",
    line: "#12263a",
    panel: "#f89bc1",
    accent: "#f2d75a",
    accent2: "#75bae7",
    chip: "#f7d6e5",
    chip2: "#f2d75a",
    footer: "#16293d",
    glow: "#ffabc9",
    isDark: false,
  },
  default: {
    key: "default",
    label: "DIGITAL PRODUCT",
    bg: "#3a102b",
    bg2: "#15050f",
    ink: "#f8eef6",
    muted: "#ccb4c3",
    line: "#f8eef6",
    panel: "#55203f",
    accent: "#e45496",
    accent2: "#7bb6df",
    chip: "#4a1b39",
    chip2: "#74405f",
    footer: "#c9afc0",
    glow: "#e45496",
    isDark: true,
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
  const base = lines.length <= 1 ? 78 : lines.length === 2 ? 64 : lines.length === 3 ? 54 : 46;
  const longest = Math.max(1, ...lines.map((line) => line.length));
  const maxWidth = lines.length <= 1 ? 630 : 540;
  const charRatio = lines.length <= 1 ? 0.62 : 0.76;
  const fitted = Math.floor(maxWidth / (longest * charRatio));
  return Math.max(36, Math.min(base, fitted));
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
  const lineHeight = fontSize * 0.92;
  const startY = 234 - ((lines.length - 1) * lineHeight) / 2;
  const highlightIndex = lines.length > 1 ? Math.min(1, lines.length - 1) : -1;
  const highlight = highlightIndex >= 0
    ? `<rect x="45" y="${startY + highlightIndex * lineHeight - fontSize * 0.78}" width="650" height="${fontSize * 0.9}" rx="2" fill="${palette.accent}" opacity="${palette.isDark ? "0.38" : "0.92"}" transform="rotate(-1.6 370 ${startY + highlightIndex * lineHeight})"/>`
    : "";

  const text = lines.map((line, index) => (
    `<text x="60" y="${startY + index * lineHeight}" font-family="Arial Black, Arial, system-ui, sans-serif" font-size="${fontSize}" font-weight="900" fill="${palette.ink}" letter-spacing="-2">${xmlEsc(line)}</text>`
  )).join("");

  return highlight + text;
}

function backgroundSvg(palette, seed) {
  const opacity = palette.isDark ? "0.08" : "0.18";
  const lineOpacity = palette.isDark ? "0.16" : "0.22";
  const offset = seed % 34;
  return (
    `<rect width="800" height="600" fill="${palette.bg}"/>` +
    `<rect width="800" height="600" fill="url(#baseBlend)" opacity="0.95"/>` +
    `<circle cx="${680 - offset}" cy="${520 - offset}" r="240" fill="${palette.accent}" opacity="${opacity}"/>` +
    `<circle cx="${116 + offset}" cy="92" r="180" fill="${palette.glow}" opacity="${palette.isDark ? "0.08" : "0.16"}"/>` +
    `<g opacity="${lineOpacity}" stroke="${palette.line}" stroke-width="5" fill="none">` +
    `<path d="M612 356 L820 520"/>` +
    `<path d="M638 314 L846 478"/>` +
    `<path d="M666 272 L874 436"/>` +
    `<rect x="-74" y="480" width="420" height="72" rx="0" transform="rotate(-8 136 516)"/>` +
    `<circle cx="626" cy="144" r="82"/>` +
    `</g>` +
    `<g opacity="${palette.isDark ? "0.06" : "0.11"}" stroke="${palette.line}" stroke-width="1">` +
    Array.from({ length: 8 }).map((_, i) => `<path d="M${80 + i * 72} 0 V600"/>`).join("") +
    Array.from({ length: 6 }).map((_, i) => `<path d="M0 ${82 + i * 72} H800"/>`).join("") +
    `</g>`
  );
}

function frameSvg(palette) {
  const strokeOpacity = palette.isDark ? "0.24" : "0.5";
  const panelOpacity = palette.isDark ? "0.18" : "0.28";
  return (
    `<rect x="28" y="28" width="744" height="544" rx="34" fill="${palette.panel}" opacity="${panelOpacity}" stroke="${palette.line}" stroke-opacity="${strokeOpacity}" stroke-width="3"/>` +
    `<path d="M58 86 H318" stroke="${palette.line}" stroke-opacity="${palette.isDark ? "0.26" : "0.4"}" stroke-width="3"/>` +
    `<path d="M58 512 H742" stroke="${palette.line}" stroke-opacity="${palette.isDark ? "0.18" : "0.32"}" stroke-width="2"/>`
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
    `<g transform="rotate(-3 410 354)" opacity="${palette.isDark ? "0.9" : "1"}">` +
    `<rect x="52" y="326" width="560" height="52" rx="2" fill="${palette.accent2}" opacity="${palette.isDark ? "0.22" : "0.84"}" stroke="${palette.line}" stroke-opacity="${palette.isDark ? "0.18" : "0.6"}" stroke-width="3"/>` +
    `</g>` +
    `<path d="M704 498 l34 0 l-16 16" fill="none" stroke="${palette.footer}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>`
  );
}

function metaSvg(category, palette) {
  return (
    `<text x="58" y="72" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="13" font-weight="800" fill="${palette.muted}" letter-spacing="5">${xmlEsc(String(category || palette.label).toUpperCase())}</text>` +
    `<text x="58" y="542" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="700" fill="${palette.footer}" opacity="0.74" letter-spacing="4">${xmlEsc(STORE_WATERMARK)}</text>`
  );
}

export function generateStoreCover(product = {}) {
  const category = product.category || "Digital Product";
  const title = cleanTitle(product.name);
  const palette = classifyProduct(product);
  const seed = hashString(`${product.slug || ""} ${product.name || ""}`);
  const lines = wrapTitle(title, seed % 3 === 0 ? 14 : 15, 4);
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
