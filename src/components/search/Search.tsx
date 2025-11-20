"use client";
import { useState } from "react";
import styles from "./Search.module.css";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

type SearchProp = {
  setFilterExam?: (data: any) => void;
  currentPage: number;
  setTotalPage: (data: any) => void;
  setSearchKeyword: (data: any) => void;
  setCurrentPage: (data: any) => void;
}

export default function Search({ setFilterExam, setSearchKeyword, setCurrentPage }: SearchProp) {
  const [searchType, setSearchType] = useState("exams");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <div className={styles.filter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
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
