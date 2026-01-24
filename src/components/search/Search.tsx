"use client";
import { useState } from "react";
import styles from "./Search.module.css";

type SearchProp = {
  searchKeyword?: string
  setSearchKeyword: (data: any) => void;
  setFilterCondition: (data: any) => void;
  setCurrentPage: (page: any) => void;
}

export default function Search({ searchKeyword, setSearchKeyword, setFilterCondition, setCurrentPage }: SearchProp) {
  const [keyword, setKeyword] = useState(searchKeyword ?? "");

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
    setFilterCondition("");
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <div className={styles.filter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Bạn muốn tìm kiếm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {/* Nút xoá (chỉ hiện khi có từ khoá) */}
        {keyword && (
          <button className={styles.clearBtn} onClick={handleClear}>
            ❌
          </button>
        )}
      </div>
      {/* Nút tìm kiếm */}
      <button className={styles.searchBtn} onClick={handleSearch}>
        Tìm kiếm
      </button>
    </div>
  );
}
