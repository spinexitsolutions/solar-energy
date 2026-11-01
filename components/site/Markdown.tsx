/** Minimal, safe markdown: paragraphs, ## / ### headings, "- " lists, **bold**. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

export default function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className="prose-sun">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;
        if (t.startsWith("### ")) return <h3 key={i} className="mt-8 text-xl font-semibold">{inline(t.slice(4))}</h3>;
        if (t.startsWith("## ")) return <h2 key={i}>{inline(t.slice(3))}</h2>;
        const lines = t.split("\n");
        if (lines.every((l) => /^[-*] /.test(l.trim())))
          return <ul key={i}>{lines.map((l, k) => <li key={k}>{inline(l.trim().slice(2))}</li>)}</ul>;
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}
