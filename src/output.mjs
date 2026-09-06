/** Highlight source text, then convert timestamps without changing generated markup. */
export function renderOutput(text, { unit, epoch }, highlighter) {
  const html = highlighter.highlight(text, {
    language: "json",
    ignoreIllegals: true,
  }).value;
  const scale = unit === "seconds" ? 1000 : 1;
  const minimum = Math.floor(new Date(epoch).getTime() / scale);

  // Only scan text. Tags and escaped characters belong to the highlighter.
  return html.replace(/(<[^>]*>|&(?:#\d+|#x[\da-f]+|\w+);)|(\d+)/gi, (match, markup, number) => {
    if (markup || Number(number) < minimum || Number.isNaN(minimum)) {
      return match;
    }
    const date = new Date(Math.floor(Number(number) * scale));
    if (Number.isNaN(date.getTime())) {
      return match;
    }
    const formatted = date.toLocaleDateString("en") + " " + date.toLocaleTimeString("en");
    return `<span class="inverse">${formatted}</span>`;
  });
}
