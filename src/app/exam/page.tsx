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
import Image from "next/image";
import { formatVNDateTime } from "../../../lib/model";

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
    localStorage.setItem("exam", JSON.stringify({
      exam_id: exam.exam_id,
      time_limit: exam.time_limit,
      exam_name: exam.exam_name,
      subject_type: exam.subject_type
    }))
    router.push(`/exam/${exam_id}/review/rank`)
  }

  const isExpired = (endTime?: string | null) => {
    if (!endTime) return false;

    const endUTC = Date.parse(endTime);
    const nowUTC = Date.now();
    console.log({ endUTC, nowUTC });


    return endUTC < nowUTC;
  };

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
            className={`${styles.card} ${isExpired(exam.end_time) ? styles.expiredCard : ""
              }`}
            onClick={() => handleReviewExam(exam.exam_id, exam)}
          >
            {isExpired(exam.end_time) && (
              <div className={styles.expiredBadge}>
                HẾT HẠN
              </div>
            )}
            <div className={styles.left_area}>
              <div className={styles.header}>
                <h2 className={styles.examName}>{exam.exam_name}</h2>
                <p className={styles.desc}>
                  {exam.description}
                </p>
              </div>

              <div className={styles.top_user}>
                {exam.top3?.map((u, idx) => {
                  const rankIcons = [
                    "/IconRank1.svg",
                    "/IconRank2.svg",
                    "/IconRank3.svg",
                  ];

                  return (
                    <div key={idx} className={styles.top_item}>
                      <div className={`${styles.avatar_wrap} ${styles[`rank_${idx}`]}`}>
                        <div className={styles.avatar}>
                          <img src="/avatar.svg" alt="avatar" />
                        </div>

                        <div className={styles.user_rank}>
                          <div className={styles.user_name}>
                            {u?.user_name || "Ẩn danh"}
                          </div>
                          {/* <div className={styles.rank_icon}>
                              <Image
                                src={rankIcons[idx]}
                                alt={`Rank ${idx + 1}`}
                                width={50}
                                height={50}
                              />
                            </div> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.info}>
                <div className={styles.tags}>
                  <span className={styles.tag}>
                    <span>{exam.subject_name} - </span>
                    <span>{exam.topic_name}</span>
                  </span>
                </div>
                <div className={styles.time}>
                  <span>
                    ⏱: {exam.time_limit} phút
                  </span>
                </div>
                <div className={styles.stats}>
                  <Users size={16} />
                  <span> {exam.contestant_count} người </span>
                </div>
              </div>
            </div>
            <div className={styles.right_area}>

              <div className={styles.date}>
                <CalendarCheck size={16} />
                <div className={styles.dateRow}>
                  <span>{exam.start_time
                    ? formatVNDateTime(exam.start_time)
                    : "Chưa có"}</span>
                </div>
                <div className={styles.dateRow}>
                  <span> - {exam.end_time
                    ? formatVNDateTime(exam.end_time)
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
