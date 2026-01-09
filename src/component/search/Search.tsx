"use client";
import { useState } from "react";
import styles from "./Search.module.css";

type SearchType = "question" | "user" | "exam" | "document";

type SearchProp = {
  searchKeyword: string;
  setSearchKeyword?: (data: string) => void;
  typeSearch: SearchType;
};

const PLACEHOLDER_MAP: Record<SearchType, string> = {
  question: "Tìm theo nội dung câu hỏi...",
  user: "Tìm theo tên hoặc email người dùng...",
  exam: "Tìm theo tên đề thi...",
  document: "TÌm theo tên tài liệu..."
};

export default function Search({
  searchKeyword,
  setSearchKeyword,
  typeSearch,
}: SearchProp) {
  const [keyword, setKeyword] = useState(searchKeyword);

  const handleSearch = () => {
    setSearchKeyword?.(keyword);
  };

  const handleClear = () => {
    setKeyword("");
    setSearchKeyword?.("");
  };

  return (
    <div className={styles.filter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder={PLACEHOLDER_MAP[typeSearch]}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {keyword && (
          <button className={styles.clearBtn} onClick={handleClear}>
            X
          </button>
        )}
      </div>

      <button className={styles.searchBtn} onClick={handleSearch}>
        Tìm kiếm
      </button>
    </div>
  );
}
