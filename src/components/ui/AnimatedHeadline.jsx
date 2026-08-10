export function AnimatedHeadline({
  as: Tag = "h1",
  text,
  className = "okr__h2",
  highlightFrom,
  highlightLast,
  highlightRatio = 0.48,
  ...props
}) {
  if (!text) return null;

  const chunks = String(text).split(/(\s+)/);
  const wordTotal = chunks.filter((chunk) => chunk && !/^\s+$/.test(chunk)).length;
  const highlightStart = getHighlightStart({
    highlightFrom,
    highlightLast,
    highlightRatio,
    wordTotal,
  });
  let wordIndex = -1;

  return (
    <Tag className={`okr__headline okr__headline--stagger ${className}`} {...props}>
      {chunks.map((chunk, index) => {
        if (/^\s+$/.test(chunk)) return chunk;

        wordIndex += 1;
        return (
          <span
            key={`${chunk}-${index}`}
            className={`okr__word${wordIndex >= highlightStart ? " is-grad" : ""}`}
            style={{ "--i": wordIndex }}
          >
            {chunk}
          </span>
        );
      })}
    </Tag>
  );
}

function getHighlightStart({ highlightFrom, highlightLast, highlightRatio, wordTotal }) {
  if (wordTotal <= 1) return 0;

  if (Number.isFinite(highlightFrom)) {
    return Math.max(0, Math.min(highlightFrom, wordTotal - 1));
  }

  if (Number.isFinite(highlightLast)) {
    return Math.max(0, wordTotal - highlightLast);
  }

  return Math.max(1, Math.floor(wordTotal * highlightRatio));
}
