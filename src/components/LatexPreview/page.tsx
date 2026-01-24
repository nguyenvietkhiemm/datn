"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { splitLatex } from "@/utils/latex";

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
