"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function splitLatex(text: string) {
  const regex = /\$(.+?)\$/g;
  const parts: Array<{ type: "text" | "latex"; value: string }> = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: "latex",
      value: match[1],
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return parts;
}

export function LatexPreview({ text }: { text: string }) {
  if (!text) return null;

  const parts = splitLatex(text);

  return (
    <div
      style={{
        marginTop: 8,
        padding: 8,
        border: "1px dashed #ccc",
        background: "#fafafa",
        borderRadius: 4,
      }}
    >
      {parts.map((p, i) =>
        p.type === "latex" ? (
          <InlineMath key={i} math={p.value} />
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </div>
  );
}
