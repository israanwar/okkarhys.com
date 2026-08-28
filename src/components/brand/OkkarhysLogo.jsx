import { useId } from "react";
import "./OkkarhysLogo.css";

const NOIR_LOGO_STOPS = [
  "#171a1e", "#1d2125", "#252a2f", "#30363d", "#3c434b",
  "#4a525b", "#53616e", "#56636f", "#52565a", "#4b555d",
];

function LogoSymbol({ id = "okr-symbol" }) {
  const instanceId = useId().replace(/:/g, "");
  const gradientId = `${id}-${instanceId}-noir-gradient`;

  return (
    <g id={id}>
      <defs>
        <linearGradient id={gradientId} x1="10" y1="4" x2="68" y2="60" gradientUnits="userSpaceOnUse">
          {NOIR_LOGO_STOPS.map((color, index) => (
            <stop key={color} offset={`${(index / (NOIR_LOGO_STOPS.length - 1)) * 100}%`} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} d="M10 26V17C10 9.82 15.82 4 23 4h10v8H23c-2.76 0-5 2.24-5 5v9h-8Z" />
      <path fill={`url(#${gradientId})`} d="M37 4h10c7.18 0 13 5.82 13 13v10h-8V17c0-2.76-2.24-5-5-5H37V4Z" />
      <path fill={`url(#${gradientId})`} d="M10 30h8v10c0 2.76 2.24 5 5 5h10v8H23c-7.18 0-13-5.82-13-13V30Z" />
      <path fill={`url(#${gradientId})`} d="M52 30h8v10c0 3.55-1.43 6.76-3.75 9.1l-6.03-5.24A4.97 4.97 0 0 0 52 40V30Z" />
      <path fill={`url(#${gradientId})`} d="m34 34 5.45-5.45L57.7 44.52l-5.45 5.45L34 34Z" />
      <path fill={`url(#${gradientId})`} d="M57.7 44.52 68 53.54V60h-4.3L52.25 49.97l5.45-5.45Z" />
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
