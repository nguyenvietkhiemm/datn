"use client";

import FileView from "@/components/docview/FileView";
import { useSearchParams } from "next/navigation";
import styles from "./DocumentView.module.css";

export default function MyPage() {
  const searchParams = useSearchParams();
  const link = searchParams?.get("link") ?? "";

  if (!link) return <p>Không có tài liệu để hiển thị.</p>;

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}> Preview tài liệu</h1>

      <div className={styles.viewerContainer}>
        <FileView link={link} />
      </div>
    </div>
  );
}
