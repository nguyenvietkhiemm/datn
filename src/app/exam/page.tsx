"use client";
import React, { useEffect, useState } from "react";
import styles from "./ExamList.module.css";
import { useRouter } from "next/navigation";
import Filter from "@/components/filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setExams } from "@/store/slices/examSlice";
import Pagination from "@/components/pagination/Pagination";
import Search from "@/components/search/Search";
import { Users, CalendarCheck } from "lucide-react";
import { Exam } from "../../../domain/exam/type"
import { ExamService } from "../../../domain/exam/service";

export default function ExamList() {
  const router = useRouter();
  const exams = useSelector((state: RootState) => state.exam.exams);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterCondition, setFilterCondition] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchExamList = async () => {
      const data = await ExamService.getList(currentPage, filterCondition, searchKeyword);

      if (data?.data?.exams) {
        dispatch(setExams(data.data.exams));
        setTotalPages(data.data.totalPages);
      }
    };

    fetchExamList();
  }, [currentPage, filterCondition, searchKeyword])

  const handleReviewExam = async (exam_id: number, exam: Exam) => {
    localStorage.setItem("exam", JSON.stringify(exam))
    router.push(`/exam/${exam_id}/review/rank`)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Danh sách đề thi thử</h1>

      <div className={styles.filter_search}>
        <Filter
          setFilterCondition={setFilterCondition}
          setSearchKeyword={setSearchKeyword}
        />

        <Search
          setSearchKeyword={setSearchKeyword}
          setFilterCondition={setFilterCondition}
        />
      </div>

      <div className={styles.grid}>
        {exams?.map((exam, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleReviewExam(exam.exam_id, exam)}
          >
            <div className={styles.left_area}>
              <div className={styles.header}>
                <h2 className={styles.examName}>{exam.exam_name}</h2>
                <p className={styles.desc}>
                  {exam.description}
                </p>
                <div className={styles.top_user}>
                  {exam.top3 && exam.top3.length > 0 && (
                    exam.top3.map((u, idx) => (
                      <div key={idx} className={styles.top_item}>
                        <span
                          className={`${styles.rank_badge} ${styles[`rank_${idx}`]}`}
                        >
                          {idx + 1}
                        </span>

                        <span className={styles.user_name}>
                          {u?.user_name || "Ẩn danh"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.info}>
                <div className={styles.time}>
                  <span>
                    ⏱ Thời gian làm bài: {exam.time_limit} phút
                  </span>
                </div>
                <div className={styles.tags}>
                  <span className={styles.tag}>{exam.topic_name}</span>
                </div>
              </div>
            </div>

            <div className={styles.right_area}>
              <p className={styles.stats}>
                <Users size={16} />
                <span> {exam.contestant_count} người đã tham gia</span>
              </p>

              <div className={styles.date}>
                <div className={styles.dateRow}>
                  <CalendarCheck size={16} />
                  <span>Kết thúc: {exam.end_time
                    ? new Date(exam.end_time).toLocaleString("vi-VN")
                    : "Chưa có"}</span>
                </div>

                <div className={styles.dateRow}>
                  <CalendarCheck size={16} />
                  <span>Bắt đầu: {exam.start_time
                    ? new Date(exam.start_time).toLocaleString("vi-VN")
                    : "Chưa có"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {exams?.length === 0 ? (
        <p className={styles.empty}>Không có đề thi cho chủ đề này.</p>
      ) : (
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}
