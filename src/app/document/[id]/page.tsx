"use client";
import DocxViewer from "@/components/docview/DocView";
import { useSearchParams } from "next/navigation";

export default function MyPage() {
  const searchParams = useSearchParams();
  const link = searchParams?.get("link") ?? "";

  if (!link) return <p>Không có tài liệu để hiển thị.</p>;

  return (
    <div>
      <h1>Preview tài liệu</h1>
      <DocxViewer link={link} />
    </div>
  );
}
