"use client";

import FileViewer from "@/component/FileView/page";
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
        <FileViewer link={link} />
      </div>
    </div>
  );
}
