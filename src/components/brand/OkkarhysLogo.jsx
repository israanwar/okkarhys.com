import "./OkkarhysLogo.css";

const SYMBOL_LIGHT = "/assets/brand/logo-symbol-light.svg?v=20260806-09";

export function OkkarhysMark({ className = "", title = "okkarhys", decorative = false }) {
  return (
    <img
      className={className}
      src={SYMBOL_LIGHT}
      width="32"
      height="32"
      alt={decorative ? "" : `${title} mark`}
      aria-hidden={decorative ? "true" : undefined}
      draggable="false"
    />
  );
}

// Wordmark. Font: Archivo Black (mirip Styrene A / Anthropic).
// Setiap huruf dibungkus span sendiri supaya bisa stagger reveal
// animation (opacity + wiggle) menggantikan efek stroke-draw
// yang dulu dipakai di versi SVG path.
const LETTERS = "OKKARHYS".split("");

export function OkkarhysLogo({ name = "OKKARHYS", className = "" }) {
  return (
    <span className={`okr-logo ${className}`.trim()} aria-label={name}>
      <span className="okr-logo__word" aria-hidden="true">
        {LETTERS.map((ch, i) => (
          <span key={i} className="okr-logo__letter" style={{ "--okr-i": i }}>
            <span className="okr-logo__glyph">{ch}</span>
          </span>
        ))}
        {/* Fragments (entropy) — pixel kecil yang menyebar saat logo disentuh */}
        <svg
          className="okr-logo__overlay"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <g className="okr-logo__current" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path
              className="okr-logo__current-line okr-logo__current-line--main"
              d="M3 25.5 C11 17 18 31 27 21 C36 11 43 29 52 20 C63 10 70 30 80 19 C88 12 94 21 98 16"
              pathLength="100"
              strokeWidth="0.82"
            />
            <path
              className="okr-logo__current-line okr-logo__current-line--low"
              d="M7 31 C19 27 28 34 40 28 C54 21 64 34 78 27 C87 23 93 27 97 24"
              pathLength="100"
              strokeWidth="0.52"
            />
          </g>
          <g className="okr-logo__entropy" fill="currentColor">
            <rect className="okr-logo__fragment okr-logo__fragment--one" x="5" y="10" width="1.6" height="1.6" rx="0.4" />
            <rect className="okr-logo__fragment okr-logo__fragment--two" x="42" y="6" width="1.9" height="1.9" rx="0.45" />
            <rect className="okr-logo__fragment okr-logo__fragment--three" x="68" y="30" width="1.4" height="1.4" rx="0.35" />
            <rect className="okr-logo__fragment okr-logo__fragment--four" x="90" y="34" width="1.2" height="1.2" rx="0.3" />
            <rect className="okr-logo__fragment okr-logo__fragment--five" x="16" y="34" width="1.3" height="1.3" rx="0.35" />
            <rect className="okr-logo__fragment okr-logo__fragment--six" x="28" y="8" width="1.1" height="1.1" rx="0.3" />
            <rect className="okr-logo__fragment okr-logo__fragment--seven" x="53" y="35" width="1.7" height="1.7" rx="0.45" />
            <rect className="okr-logo__fragment okr-logo__fragment--eight" x="78" y="7" width="1.5" height="1.5" rx="0.4" />
            <rect className="okr-logo__fragment okr-logo__fragment--nine" x="12" y="4" width="1.0" height="1.0" rx="0.25" />
            <rect className="okr-logo__fragment okr-logo__fragment--ten" x="36" y="32" width="1.2" height="1.2" rx="0.3" />
            <rect className="okr-logo__fragment okr-logo__fragment--eleven" x="60" y="5" width="1.1" height="1.1" rx="0.3" />
            <rect className="okr-logo__fragment okr-logo__fragment--twelve" x="84" y="27" width="1.6" height="1.6" rx="0.4" />
            <rect className="okr-logo__fragment okr-logo__fragment--thirteen" x="96" y="13" width="1.0" height="1.0" rx="0.25" />
            <rect className="okr-logo__fragment okr-logo__fragment--fourteen" x="47" y="18" width="0.9" height="0.9" rx="0.25" />
          </g>
          {/* Slash — signature diagonal, muncul di atas huruf "O" pertama */}
          <path
            className="okr-logo__slash"
            d="M2 32 L11 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="okr-logo__sr">{name}</span>
    </span>
  );
}
