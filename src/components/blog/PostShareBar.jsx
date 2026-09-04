import { useState } from "react";
import "./PostShareBar.css";
import { site } from "../../data/site";

const COPY = {
  id: {
    eyebrow: "Sebarkan ide ini",
    title: "Bagikan artikel ini.",
    description: "Pilih tempat percakapannya ingin diteruskan.",
    copied: "Tautan artikel disalin.",
    instagram: "Tautan disalin. Buka Instagram lalu tempelkan di cerita, DM, atau bio.",
    messenger: "Tautan disalin. Buka Messenger lalu tempelkan di percakapan.",
  },
  en: {
    eyebrow: "Pass the idea on",
    title: "Share this article.",
    description: "Choose where the conversation continues.",
    copied: "Article link copied.",
    instagram: "Link copied. Open Instagram and paste it into a story, DM, or bio.",
    messenger: "Link copied. Open Messenger and paste it into a conversation.",
  },
};

function SocialLogo({ network }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" };

  switch (network) {
    case "whatsapp":
      return <svg {...common}><path d="M12.04 2.2a9.8 9.8 0 0 0-8.34 14.96L2.2 21.8l4.77-1.47A9.8 9.8 0 1 0 12.04 2.2Zm0 17.84a8.03 8.03 0 0 1-4.09-1.12l-.29-.17-2.83.87.92-2.73-.19-.29a8.04 8.04 0 1 1 6.54 3.64Zm4.41-6.03c-.24-.12-1.42-.7-1.64-.77-.22-.08-.38-.12-.54.12-.16.23-.62.77-.76.93-.14.16-.28.18-.52.06a6.55 6.55 0 0 1-1.92-1.18 7.23 7.23 0 0 1-1.34-1.67c-.14-.24 0-.37.11-.49.11-.11.24-.28.35-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.65.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>;
    case "facebook":
      return <svg {...common}><path d="M13.8 21v-8h2.7l.4-3.12h-3.1V7.9c0-.9.25-1.52 1.57-1.52H17V3.6c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.87 1.4-3.87 3.98v2.42H8.2V13h2.61v8h2.99Z" /></svg>;
    case "linkedin":
      return <svg {...common}><path d="M5.13 8.18A1.83 1.83 0 1 0 5.13 4.5a1.83 1.83 0 0 0 0 3.68ZM3.56 9.62h3.15v10.12H3.56V9.62Zm5.12 0h3.02V11h.04c.42-.8 1.45-1.65 2.98-1.65 3.19 0 3.78 2.1 3.78 4.83v5.56h-3.15v-4.93c0-1.18-.02-2.69-1.64-2.69-1.64 0-1.9 1.28-1.9 2.61v5.01H8.68V9.62Z" /></svg>;
    case "x":
      return <svg {...common}><path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" /></svg>;
    case "telegram":
      return <svg {...common}><path d="m21.4 3.1-3.02 17.06c-.23 1.2-.83 1.5-1.67.94l-4.61-3.4-2.23 2.15c-.25.25-.46.46-.94.46l.33-4.7 8.56-7.73c.37-.33-.08-.52-.58-.19L6.66 14.35 2.1 12.92c-.99-.31-1.01-.99.21-1.47L20.14 4.57c.83-.31 1.56.19 1.26 1.47Z" /></svg>;
    case "threads":
      return <svg {...common}><path d="M12.02 3.1c-4.7 0-7.77 3.1-7.77 8.04 0 4.45 2.45 7.76 6.81 8.22 2.03.22 3.92-.3 4.91-1.52.8-.97 1.09-2.27.84-3.44-.3-1.36-1.55-2.37-3.45-2.56-1.95-.2-3.3.64-3.55 2.03-.18.99.37 1.8 1.37 2.08.86.25 1.82.02 2.2-.79.26-.55.16-1.2-.33-1.55-.38-.28-.9-.32-1.2-.03-.2.2-.18.48.02.65.19.16.49.12.57.35.08.25-.22.52-.52.48-.43-.05-.67-.42-.55-.86.16-.61.9-.92 1.66-.83 1.02.12 1.65.62 1.79 1.29.17.79-.11 1.6-.63 2.2-.69.78-1.91 1.1-3.25.96-3.15-.34-4.97-2.73-4.97-6.25 0-3.86 2.29-6.1 5.8-6.1 3.03 0 4.74 1.6 5.13 4.22.12.79-.24 1.2-.66 1.28-.47.09-.83-.22-.96-.76-.4-1.73-1.62-2.65-3.5-2.65-2.15 0-3.63 1.39-3.63 3.56 0 2.14 1.44 3.54 3.52 3.54.97 0 1.83-.31 2.42-.9l.88.77c-.8.92-1.94 1.4-3.33 1.4-2.83 0-4.85-1.94-4.85-4.81 0-2.9 2.07-4.86 4.92-4.86 2.46 0 4.1 1.3 4.64 3.63.3 1.32 1.25 2.14 2.49 1.9 1.3-.25 2.05-1.53 1.79-3.25C20.35 5.24 16.94 3.1 12.02 3.1Z" /></svg>;
    case "instagram":
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.35" cy="6.65" r="1.05" /></svg>;
    case "pinterest":
      return <svg {...common}><path d="M12 2a10 10 0 0 0-3.64 19.31c-.05-1.64 0-3.62.38-5.15l.9-3.82s-.23-.47-.23-1.17c0-1.1.64-1.92 1.43-1.92.67 0 1 .5 1 1.1 0 .67-.43 1.68-.65 2.61-.19.78.39 1.42 1.16 1.42 1.4 0 2.47-1.47 2.47-3.6 0-1.88-1.35-3.2-3.28-3.2-2.24 0-3.55 1.68-3.55 3.42 0 .68.26 1.4.59 1.8.06.07.07.14.05.22l-.22.89c-.04.14-.13.17-.29.1-1.08-.5-1.76-2.04-1.76-3.28 0-2.67 1.94-5.12 5.6-5.12 2.94 0 5.23 2.1 5.23 4.9 0 2.92-1.84 5.27-4.4 5.27-.86 0-1.67-.45-1.95-.98l-.53 2.02c-.19.74-.72 1.67-1.07 2.23A10 10 0 1 0 12 2Z" /></svg>;
    case "line":
      return <svg {...common}><path d="M20.3 11.1c0-4.05-3.7-7.35-8.25-7.35S3.8 7.05 3.8 11.1c0 3.63 2.94 6.68 6.92 7.25.27.06.64.18.73.4.08.2.05.51.03.71l-.12.68c-.04.2-.18.78.72.43.9-.38 4.86-2.86 6.63-4.9 1.22-1.34 1.6-2.7 1.6-4.57Z" /><text x="6.2" y="13.4" fill="currentColor" stroke="var(--okr-share-line, #12151a)" strokeWidth=".3" fontFamily="Arial, sans-serif" fontSize="5.1" fontWeight="800">LINE</text></svg>;
    case "messenger":
      return <svg {...common}><path d="M12 3.3c-4.8 0-8.7 3.62-8.7 8.08 0 2.54 1.27 4.8 3.26 6.28v3.04l2.93-1.62c.78.22 1.62.34 2.51.34 4.8 0 8.7-3.62 8.7-8.08S16.8 3.3 12 3.3Zm.86 10.88-2.22-2.37-4.35 2.4 4.78-5.07 2.27 2.37 4.3-2.4-4.78 5.07Z" /></svg>;
    case "email":
      return <svg {...common}><path d="M3.4 5.35h17.2v13.3H3.4V5.35Zm1.52 1.5 7.08 5.36 7.08-5.36H4.92Zm14.18 10.3V8.74L12 14.13 4.9 8.74v8.41h14.2Z" /></svg>;
    default:
      return <svg {...common}><path d="M9.6 14.4a3.5 3.5 0 0 0 4.95.05l3.2-3.2a3.5 3.5 0 0 0-4.95-4.95l-1.84 1.84 1.18 1.18 1.84-1.84a1.83 1.83 0 1 1 2.59 2.59l-3.2 3.2a1.83 1.83 0 0 1-2.59 0l-1.18 1.13Zm4.8-4.8a3.5 3.5 0 0 0-4.95-.05l-3.2 3.2a3.5 3.5 0 1 0 4.95 4.95l1.84-1.84-1.18-1.18-1.84 1.84a1.83 1.83 0 1 1-2.59-2.59l3.2-3.2a1.83 1.83 0 0 1 2.59 0l1.18-1.13Z" /></svg>;
  }
}

function makeShareUrl(path) {
  return new URL(path || "/blog", site.url).toString();
}

async function copyToClipboard(value) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard fallback failed");
}

export function PostShareBar({ post, canonicalPath, lang = "en", compact = false }) {
  const [notice, setNotice] = useState("");
  const copy = COPY[lang] ?? COPY.en;
  const url = makeShareUrl(canonicalPath || `/blog/${post.slug}`);
  const title = post.title || site.name;
  const message = `${title} — ${site.name}`;
  const messageWithUrl = `${message}\n${url}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message);

  const links = [
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(messageWithUrl)}` },
    { id: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { id: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { id: "x", label: "X", href: `https://x.com/intent/post?text=${encodedMessage}&url=${encodedUrl}` },
    { id: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}` },
    { id: "threads", label: "Threads", href: `https://www.threads.net/intent/post?text=${encodeURIComponent(messageWithUrl)}` },
    { id: "pinterest", label: "Pinterest", href: `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedMessage}` },
    { id: "line", label: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}` },
    { id: "email", label: "Email", href: `mailto:?subject=${encodedMessage}&body=${encodeURIComponent(messageWithUrl)}`, mail: true },
  ];

  async function handleCopy(network) {
    try {
      await copyToClipboard(url);
      setNotice(network === "instagram" ? copy.instagram : network === "messenger" ? copy.messenger : copy.copied);
    } catch {
      setNotice(lang === "id" ? "Tautan tidak dapat disalin. Salin URL dari browser." : "The link could not be copied. Copy the URL from your browser.");
    }
  }

  function handleHandoff(network) {
    const destination = network === "instagram" ? "https://www.instagram.com/" : "https://www.messenger.com/";
    window.open(destination, "_blank", "noopener,noreferrer");
    void handleCopy(network);
  }

  return (
    <section className={`okr__post-share${compact ? " okr__post-share--compact" : ""}`} aria-labelledby="post-share-title">
      <div className="okr__post-share-intro">
        <p className="okr__post-share-eyebrow">// {copy.eyebrow}</p>
        <h2 id="post-share-title">{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div className="okr__post-share-actions" aria-label={copy.title}>
        {links.map((item) => (
          <a
            className={`okr__post-share-button okr__post-share-button--${item.id}`}
            href={item.href}
            key={item.id}
            target={item.mail ? undefined : "_blank"}
            rel={item.mail ? undefined : "noopener noreferrer"}
            aria-label={`${lang === "id" ? "Bagikan ke" : "Share on"} ${item.label}`}
          >
            <SocialLogo network={item.id} />
            <span>{item.label}</span>
          </a>
        ))}
        <button
          type="button"
          className="okr__post-share-button okr__post-share-button--instagram"
          onClick={() => handleHandoff("instagram")}
          aria-label={`${lang === "id" ? "Salin tautan dan buka" : "Copy link and open"} Instagram`}
        >
          <SocialLogo network="instagram" />
          <span>Instagram</span>
        </button>
        <button
          type="button"
          className="okr__post-share-button okr__post-share-button--messenger"
          onClick={() => handleHandoff("messenger")}
          aria-label={`${lang === "id" ? "Salin tautan dan buka" : "Copy link and open"} Messenger`}
        >
          <SocialLogo network="messenger" />
          <span>Messenger</span>
        </button>
        <button
          type="button"
          className="okr__post-share-button okr__post-share-button--copy"
          onClick={() => handleCopy("copy")}
          aria-label={lang === "id" ? "Salin tautan artikel" : "Copy article link"}
        >
          <SocialLogo network="copy" />
          <span>{lang === "id" ? "Salin tautan" : "Copy link"}</span>
        </button>
      </div>
      <p className="okr__post-share-notice" aria-live="polite">{notice}</p>
    </section>
  );
}
