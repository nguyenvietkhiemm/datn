"use client";
import { useEffect, useState } from "react";
import styles from "./Exam.module.css";
import FilterExam from "@/component/filter/Filter/Filter";
import { useRouter } from "next/navigation";
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

  //  Lấy danh sách bài thi
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

  //xoa
  const handleDelete = async (examId: number) => {
    try {
      await ExamService.deleteExam(examId);
      setExams(exams.filter((e) => e.exam_id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  //chuyen trang thai
  const handleToggleAvailable = async (examId: number, available: boolean) => {
    try {
      await ExamService.toggleExamAvailable(examId, available);

      setExams(prev =>
        prev.map(e =>
          e.exam_id === examId ? { ...e, available } : e
        )
      );
    } catch (error) {
      console.error("Error toggling exam availability:", error);
    }
  };

  const handleChngeSearch = (keyword: string) => {
    setQuery(prev => ({
      ...prev,
      page: 1,
      searchKeyword: keyword,
    }))
  }

  const handleChangeFilter = (filter: any) => {
    setQuery(prev => ({
      ...prev,
      subject_id:
        filter.subject !== "All" ? filter.subject : undefined,
      topic_ids: filter.topics?.length ? filter.topics : undefined,
      status:
        filter.status !== "All" ? filter.status : undefined,
    }))
  }
  //xem chi tiet
  const detailExam = (id: number, exam: Exam) => {
    localStorage.setItem("exam", JSON.stringify(exam));
    router.push(`/admin/exams/detail/${id}`);
  };

  if (loading) return <p className={styles.loading}>Đang tải danh sách bài thi...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý bài thi</h1>
        <div className={styles.actions}>
          <div className={styles.button} onClick={() => router.push("/admin/exams/create")}><button className={styles.addButton}>+ Thêm bài thi</button></div>
          {/* filter search */}
          <div className={styles.filter_search}>
            <FilterExam
              value={filterUI}
              onApply={(filter) => {
                setFilterUI(filter)
                handleChangeFilter(filter)
              }}
            />
            <Search
              searchKeyword={query.searchKeyword}
              setSearchKeyword={handleChngeSearch}
              typeSearch="exam"
            />
          </div>
        </div>
      </div>
      {/* noi hien  bang*/}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bài thi</th>
            <th>Thời gian (phút)</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Chủ đề</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          {exams?.length > 0 ? (
            exams?.map((exam, index) => (
              <tr key={exam.exam_id} onClick={() => detailExam(exam.exam_id, exam)}>
                <td>{index + 1}</td>
                <td>{exam.exam_name}</td>
                <td>{exam.time_limit}</td>
                <td>{new Date(exam.created_at).toLocaleDateString("vi-VN")}</td>
                <td
                  className={exam.available ? styles.active : styles.inactive}
                >
                  {exam.available ? "Hoạt động" : "Không hoạt động"}
                  {exam.available && (
                    <span
                      className={styles.editIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAvailable(exam.exam_id, !exam.available)
                      }
                      }
                    >
                      ✎
                    </span>
                  )}
                </td>
                <td>{exam.title}</td>
                <td>
                  <button
                    className={styles.delBtn}
                    onClick={() => handleDelete(exam.exam_id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Không có bài thi phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={query.page}
        setCurrentPage={(page: number) =>
          setQuery(prev => ({ ...prev, page }))
        }
      />
    </div>
  );
}
