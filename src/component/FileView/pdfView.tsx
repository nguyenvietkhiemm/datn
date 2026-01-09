"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({
    link,
    zoom = 1,
}: {
    link: string;
    zoom?: number;
}) {
    const [numPages, setNumPages] = useState<number>(0);

    return (
        <div
            className="flex flex-col items-center w-full overflow-y-auto"
            style={{
                backgroundColor: "#7f7f7f",
                padding: "40px 0",
                height: "80vh",
            }}
        >
            <Document
                file={link}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(e) => console.error("PDF load error:", e)}
            >
                {Array.from({ length: numPages }, (_, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "white",
                            marginBottom: 24,
                            transform: `scale(${zoom})`,
                            transformOrigin: "top center",
                        }}
                    >
                        <Page
                            pageNumber={index + 1}
                            width={800}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
}