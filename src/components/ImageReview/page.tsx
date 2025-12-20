"use client";

import { useEffect, useState } from "react";
import { FileParserService } from "../../../domain/file-parser/service";

export function ImagePreview({
    filename,
    width = 300,
}: {
    filename: string;
    width?: number;
}) {
    const [url, setUrl] = useState<string | null>(null);
    
    useEffect(() => {
        let mounted = true;

        FileParserService.getImageUrl(filename).then(signedUrl => {
            if (mounted) setUrl(signedUrl);
        });

        return () => {
            mounted = false;
        };
    }, [filename]);

    if (!url) return null;

    return (
        <img
            src={url}
            width={width}
            style={{ height: "auto" }}
            loading="lazy"
        />
    );
}
