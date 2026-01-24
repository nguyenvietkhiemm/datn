"use client";

import FileView from "@/components/docview/FileView";
import { useSearchParams } from "next/navigation";
import styles from "./DocumentView.module.css";
import {API_URL} from "../../../../lib/service";

export default function MyPage() {
  const searchParams = useSearchParams();

  const linkParam = searchParams.get("link");
  const link = linkParam
    ? `${API_URL}/${linkParam}`
    : "";

  if (!link) {
    return <p>Không có tài liệu để hiển thị.</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.viewerContainer}>
        <FileView link={link} />
      </div>
    </div>
  );
}
