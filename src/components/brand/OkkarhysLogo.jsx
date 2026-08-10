import "./OkkarhysLogo.css";

function LogoSymbol({ id = "okr-symbol" }) {
  return (
    <g id={id}>
      <path d="M10 26V17C10 9.82 15.82 4 23 4h10v8H23c-2.76 0-5 2.24-5 5v9h-8Z" />
      <path d="M37 4h10c7.18 0 13 5.82 13 13v10h-8V17c0-2.76-2.24-5-5-5H37V4Z" />
      <path d="M10 30h8v10c0 2.76 2.24 5 5 5h10v8H23c-7.18 0-13-5.82-13-13V30Z" />
      <path d="M52 30h8v10c0 3.55-1.43 6.76-3.75 9.1l-6.03-5.24A4.97 4.97 0 0 0 52 40V30Z" />
      <path d="m34 34 5.45-5.45L63 49.2V60L34 34Z" />
      <path className="okr-logo__accent" d="m52.35 49.52 5.34-4.67L68 54.05V60h-6.76l-8.89-10.48Z" />
    </g>
  );
}

export function OkkarhysMark({ className = "", title = "Okkarhys", decorative = false }) {
  return (
    <svg
      className={`okr-mark ${className}`.trim()}
      viewBox="0 0 70 64"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${title} mark`}
      aria-hidden={decorative ? "true" : undefined}
      focusable="false"
    >
      <LogoSymbol />
    </svg>
  );
}

export function OkkarhysLogo({ name = "OKKARHYS", className = "" }) {
  return (
    <span className={`okr-logo ${className}`.trim()} aria-label={name} role="img">
      <svg
        className="okr-logo__svg"
        viewBox="0 0 360 64"
        aria-hidden="true"
        focusable="false"
      >
        <LogoSymbol id="okr-horizontal-symbol" />
        <text className="okr-logo__wordmark" x="88" y="45">
          OKKARHYS
        </text>
      </svg>
    </span>
  );
}
