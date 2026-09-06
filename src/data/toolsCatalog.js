// Static catalog for /tools — a directory of planned utilities, organized
// by category. Not CMS-driven (unlike services/portfolio): this is a fixed
// list edited by hand, same pattern as serviceCatalog.js.
//
// Shape: each top-level category either has `subcategories` (an array of
// { name, tools[] } — used by File Converter, which is itself grouped by
// media type) or a flat `tools[]` array (used by the other three).

export const TOOLS_CATALOG = [
  {
    slug: "file-converter",
    name: "File Converter",
    subcategories: [
      {
        name: "Audio Converter",
        tools: [
          "MP3 to WAV", "WAV to MP3", "M4A to MP3", "FLAC to MP3", "OGG to MP3",
          "AAC to MP3", "MP3 Compressor", "Audio Normalizer", "Audio Bitrate Converter",
          "Audio Channel Converter (Mono / Stereo)",
        ],
      },
      {
        name: "Video Converter",
        tools: [
          "MP4 to AVI", "AVI to MP4", "MOV to MP4", "MKV to MP4", "WMV to MP4",
          "Video Compressor", "Video Resolution Converter", "Video Frame Rate Converter",
          "Video Codec Converter", "Video Audio Extractor",
        ],
      },
      {
        name: "Image Converter",
        tools: [
          "JPG to PNG", "PNG to JPG", "WebP to JPG", "JPG to WebP", "SVG to PNG",
          "PNG Compressor", "Image Resize", "Image Crop", "Image Format Batch Converter",
          "Background Remover",
        ],
      },
      {
        name: "Document Converter",
        tools: [
          "PDF to Word", "Word to PDF", "PDF to Excel", "Excel to PDF", "PowerPoint to PDF",
          "Text to PDF", "PDF Merge", "PDF Split", "PDF Compressor", "PDF Unlock",
        ],
      },
      {
        name: "Archive Converter",
        tools: [
          "ZIP to RAR", "RAR to ZIP", "7Z to ZIP", "ZIP Extractor", "RAR Extractor",
          "TAR to ZIP", "ZIP Password Remover", "Archive Compressor", "Archive Splitter",
          "Archive Merger",
        ],
      },
      {
        name: "Presentation Converter",
        tools: [
          "PPT to PDF", "PDF to PPT", "PPT to JPG", "PPT to PNG", "PPTX to PPT",
          "PPTX Compressor", "Keynote to PPT", "ODP to PPT", "PPT Split", "PPT Merge",
        ],
      },
      {
        name: "Font Converter",
        tools: [
          "TTF to OTF", "OTF to TTF", "TTF to WOFF", "OTF to WOFF", "WOFF to WOFF2",
          "WOFF2 to WOFF", "EOT to TTF", "Font Previewer", "Font Compressor", "Font Subsetter",
        ],
      },
      {
        name: "Ebook Converter",
        tools: [
          "EPUB to PDF", "PDF to EPUB", "MOBI to EPUB", "EPUB to MOBI", "AZW3 to EPUB",
          "PDF Compressor (Ebook)", "Ebook Metadata Editor", "Ebook Splitter", "Ebook Merger",
          "Ebook Cover Generator",
        ],
      },
    ],
  },
  {
    slug: "website-tools",
    name: "Website Tools",
    tools: [
      "Website Speed Test", "Mobile Friendly Test", "SSL Checker", "Redirect Checker",
      "Meta Tag Preview", "HTTP Header Checker", "Sitemap Generator", "Robots.txt Generator",
      "Open Graph Preview", "Link UTM Builder",
    ],
  },
  {
    slug: "creative-brand-tools",
    name: "Creative & Brand Tools",
    tools: [
      "Color Palette Generator", "Font Pairing Ideas", "Social Media Size Guide",
      "Content Calendar Generator", "WhatsApp Link Generator", "Caption Formatter",
      "Brand Name Generator", "Moodboard Template", "Image Upscaler", "Mockup Generator",
    ],
  },
  {
    slug: "marketing-seo-tools",
    name: "Marketing & SEO Tools",
    tools: [
      "Meta Description Generator", "Title Generator", "Keyword List Generator",
      "Keyword Difficulty Checker", "Broken Link Checker", "Sitemap Checker",
      "Indexability Checker", "SERP Snippet Preview", "Canonical Checker",
      "Schema Markup Generator",
    ],
  },
];

export const TOOLS_TOTAL_COUNT = TOOLS_CATALOG.reduce((sum, cat) => {
  if (cat.subcategories) {
    return sum + cat.subcategories.reduce((s, sc) => s + sc.tools.length, 0);
  }
  return sum + cat.tools.length;
}, 0);
