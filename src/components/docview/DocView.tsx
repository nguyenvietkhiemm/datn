"use client";
import { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";

interface DocxViewerProps {
  link: string; 
}

export default function DocxViewer({ link }: DocxViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    fetch(link)
      .then(res => res.blob())
      .then(blob => renderAsync(blob, viewerRef.current!))
      .catch(err => console.error("Preview error:", err));
  }, [link]);

  return (
    <div
      ref={viewerRef}
      style={{
        height: "80vh",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
      }}
    />
  );
}
