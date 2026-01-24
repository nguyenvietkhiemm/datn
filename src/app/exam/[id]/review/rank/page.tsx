"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./Rank.module.css";
import ReviewExam from "../page";
import { ExamService } from "../../../../../../domain/exam/service";
import { Rank, myRank } from "../../../../../../domain/exam/type";
import RightRank from "@/components/rank/right-rank/page";
import MyRank from "@/components/rank/my-rank/page";
import MainRank from "@/components/rank/main-rank/page";

export default function Ranking() {
  const params = useParams();
  const exam_id = Number(params.id);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ranking, setRanking] = useState<Rank[]>([]);
  const [myRank, setMyRank] = useState<myRank | null>(null);

  const sortRanking = (list: Rank[]) => {
    return [...list].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.time_test - b.time_test;
    });
  };


  useEffect(() => {
    const user_name = localStorage.getItem("user_name") || "";

    async function load() {
      const res = await ExamService.getRanking(exam_id, user_name, currentPage);
      if (res?.data?.ranking) {
        const rawRank = res.data.ranking.rank || [];

        setRanking(sortRanking(rawRank));
        setMyRank(res.data.ranking.my_rank || null);
        setTotalPages(res.data.ranking.total_page);
      }
    }

    load();
  }, [exam_id, currentPage]);

  return (
    <ReviewExam>
      <div className={styles.container}>
        <div className={styles.right_rank}>
          <RightRank />
        </div>
        <div className={styles.conatiner_rank}>
          <MainRank ranking={ranking}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages} />
        </div>
        <div className={styles.container_my_rank}>
          {/* ===== THÀNH TÍCH CỦA BẠN ===== */}
          {myRank && (
            <MyRank myRank={myRank} />
          )}
        </div>
      </div>
    </ReviewExam>
  );
}
