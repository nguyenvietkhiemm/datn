"use client";

import { useEffect, useState } from "react";
import { FileParserService } from "../../../domain/file-parser/service";

export function ImagePreview({
  filename,
  width = 100,
}: {
  filename: string;
  width?: number;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    FileParserService.getImageUrl(filename).then((signedUrl) => {
      if (mounted) setUrl(signedUrl);
    });

    return () => {
      mounted = false;
    };
  }, [filename]);

  if (!url) return null;

  return (
    <div
      style={{
        width,
        height: width,            // KHÓA BOX
        overflow: "hidden",       // CHẶN TRÀN
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",    // optional
      }}
    >
      <img
        src={url}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",   // QUAN TRỌNG
        }}
        loading="lazy"
        alt=""
      />
    </div>
  );
}

