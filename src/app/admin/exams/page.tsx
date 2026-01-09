"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./Exam.module.css";
import FilterExam from "@/component/filter/Filter/Filter";
import Search from "@/component/search/Search";
import Pagination from "@/component/pagination/Pagination";

import type { Exam, ExamQuery } from "@/domain/admin/exams/type";
import { ExamService } from "@/domain/admin/exams/service";

export default function Exam() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [query, setQuery] = useState<ExamQuery>({
    page: 1,
    searchKeyword: "",
  });

  const [filterUI, setFilterUI] = useState({
    subject: "All" as number | "All",
    topic: "All" as number | "All",
    status: "All" as string,
  });

  const router = useRouter();

  // Fetch danh sách bài thi
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const data = await ExamService.fetchExams(query);
        setExams(data.exams);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [query]);

  // Xóa bài thi
  const handleDelete = async (examId: number) => {
    try {
      await ExamService.deleteExam(examId);
      setExams(exams.filter((e) => e.exam_id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  // Chuyển trạng thái hoạt động
  const handleToggleAvailable = async (examId: number, available: boolean) => {
    try {
      await ExamService.toggleExamAvailable(examId, available);
      setExams((prev) =>
        prev.map((e) =>
          e.exam_id === examId ? { ...e, available } : e
        )
      );
    } catch (error) {
      console.error("Error toggling exam availability:", error);
    }
  };

  // Search
  const handleChangeSearch = (keyword: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      searchKeyword: keyword,
    }));
  };

  // Filter
  const handleChangeFilter = (filter: any) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      subject_id: filter.subject !== "All" ? filter.subject : undefined,
      topic_ids: filter.topic !== "All" ? filter.topic : undefined,
      status: filter.status !== "All" ? filter.status : undefined,
    }));
  };

  // Xem chi tiết bài thi
  const detailExam = (id: number, exam: Exam) => {
    localStorage.setItem("exam", JSON.stringify(exam));
    router.push(`/admin/exams/detail/${id}`);
  };

  // Loading state
  if (loading)
    return <p className={styles.loading}>Đang tải danh sách bài thi...</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>QUẢN LÝ CUỘC THI</h1>
        <div className={styles.actions}>
          <div className={styles.button}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/admin/exams/create")}
            >
              + Thêm bài thi
            </button>
          </div>

          {/* Filter + Search */}
          <div className={styles.filter_search}>
            <FilterExam
              value={filterUI}
              onApply={(filter) => {
                setFilterUI(filter);
                handleChangeFilter(filter);
              }}
            />
            <Search
              searchKeyword={query.searchKeyword}
              setSearchKeyword={handleChangeSearch}
              typeSearch="exam"
            />
          </div>
        </div>
      </div>

      {/* Table danh sách bài thi */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bài thi</th>
            <th>Thời gian (phút)</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Chủ đề</th>
            <th>Xoá</th>
          </tr>
        </thead>

        <tbody>
          {exams.length > 0 ? (
            exams.map((exam, index) => (
              <tr key={exam.exam_id}>
                <td>{index + 1}</td>
                <td
                  className={styles.detailBtn}
                  onClick={() => detailExam(exam.exam_id, exam)}
                >
                  {exam.exam_name}
                </td>
                <td>{exam.time_limit}</td>
                {/* Hiển thị time_start và time_end */}
                <td>
                  {exam.start_time
                    ? new Date(exam.start_time).toLocaleString("vi-VN")
                    : "-"}
                </td>
                <td>
                  {exam.end_time
                    ? new Date(exam.end_time).toLocaleString("vi-VN")
                    : "-"}
                </td>
                <td>{new Date(exam.created_at).toLocaleDateString("vi-VN")}</td>
                <td className={exam.available ? styles.active : styles.inactive}>
                  {exam.available ? "Hoạt động" : "Không hoạt động"}
                  <span
                    className={styles.editIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAvailable(exam.exam_id, !exam.available);
                    }}
                  >
                    ✎
                  </span>
                </td>
                <td>{exam.topic_name}</td>
                <td>
                  <button
                    className={styles.delBtn}
                    onClick={() => handleDelete(exam.exam_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className={styles.empty}>
                Không có bài thi phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>


      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={query.page}
        setCurrentPage={(page: number) =>
          setQuery((prev) => ({ ...prev, page }))
        }
      />
    </div>
  );
}
