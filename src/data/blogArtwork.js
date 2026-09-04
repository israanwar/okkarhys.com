export const BLOG_ARTWORK_THEMES = Object.freeze([
  "#111316", "#171a1e", "#1d2125", "#252a2f", "#30363d", "#3c434b",
  "#202830", "#28323b", "#323e48", "#1e252c", "#263039", "#303b45",
  "#20262c", "#283038", "#323b44", "#1f2022", "#26282a", "#2f3134",
  "#201d19", "#29251f", "#332e27", "#20292e", "#29333a", "#333f47",
]);

export const BLOG_ARTWORK_ICON_NAMES = Object.freeze([
  "ShieldCheck", "Code2", "BarChart3", "FileSearch2", "Globe2", "Megaphone",
  "Palette", "Bot", "Sparkles", "ShoppingBag", "Landmark", "BookOpen",
  "Brain", "Compass", "Users", "Rocket", "BriefcaseBusiness", "Lightbulb",
  "Network", "PenTool", "Scale", "Cpu", "Gem", "Search",
]);

export const BLOG_ARTWORK_COUNT = BLOG_ARTWORK_ICON_NAMES.length;

function normalizeArtworkIndex(index = 0) {
  const safeIndex = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  return safeIndex % BLOG_ARTWORK_COUNT;
}

export function getBlogArtworkDescriptor(index = 0) {
  const normalizedIndex = normalizeArtworkIndex(index);
  return {
    theme: BLOG_ARTWORK_THEMES[normalizedIndex],
    iconName: BLOG_ARTWORK_ICON_NAMES[normalizedIndex],
  };
}

export function getBlogSocialArtworkPath(index = 0) {
  const artworkNumber = String(normalizeArtworkIndex(index) + 1).padStart(2, "0");
  return `/assets/blog/social/artwork-${artworkNumber}.png`;
}
