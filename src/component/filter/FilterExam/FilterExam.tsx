"use client";

import React, { useState } from "react";
import styles from "./FilterExam.module.css";

type Exam = {
  exam_id: number;
  exam_name: string;
  created_at: string;
  time_limit: number;
  topic_id: number;
  available: boolean;
};

interface FilterExamProps {
  exams: Exam[];
  setFilterExam: React.Dispatch<React.SetStateAction<Exam[]>>;
}

export default function FilterExam({ exams, setFilterExam }: FilterExamProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // ✅ Hàm xử lý lọc
  const handleFilter = (newStatus: string, newSearch?: string) => {
    const searchTerm = (newSearch ?? search).toLowerCase();
    const isAvailable =
      newStatus === "true" ? true : newStatus === "false" ? false : null;

    const filtered = exams.filter((e) => {
      const matchesSearch = e.exam_name.toLowerCase().includes(searchTerm);
      const matchesStatus =
        isAvailable === null ? true : e.available === isAvailable;
      return matchesSearch && matchesStatus;
    });

    setFilterExam(filtered);
  };

  // ✅ Khi thay đổi trạng thái
  const handleStatusChange = (value: string) => {
    setStatus(value);
    handleFilter(value);
  };

  // ✅ Khi nhập tìm kiếm
  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleFilter(status, value);
  };

  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Tìm kiếm bài thi..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className={styles.searchInput}
      />

      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={styles.select}
      >
        <option value="all">Tất cả</option>
        <option value="true">Hoạt động</option>
        <option value="false">Không hoạt động</option>
      </select>
    </div>
  );
}
