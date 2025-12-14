"use client";
import { useEffect, useState } from "react";
import { ExamService } from "../../../../../../domain/exam/service";
import { Rank, myRank } from "../../../../../../domain/exam/type";
import styles from "./Rank.module.css";
import ReviewExam from "../page";
import { useParams } from "next/navigation";
import { ExamModel } from "../../../../../../domain/exam/model";

export default function Ranking() {
  const params = useParams();
  const exam_id = Number(params.id);
  const [ranking, setRanking] = useState<Rank[]>([]);
  const [myRank, setMyRank] = useState<myRank | null>(null);

  useEffect(() => {
    const user_name = localStorage.getItem("user_name");
    async function load() {
      const result = await ExamService.getRanking(exam_id, String(user_name));

      if (result?.data?.ranking) {
        setRanking(result.data.ranking.rank || []);
        setMyRank(result.data.ranking.my_rank || null);
      }
    }
    load();
  }, [exam_id]);

  return (
    <ReviewExam>
      <div className={styles.container}>
        <h2 className={styles.title}>Bảng xếp hạng</h2>

        {/* Hạng của bạn */}
        {myRank && (
          <div className={styles.myRankBox}>
            <div className={styles.myRankTitle}>Thành tích của bạn</div>

            <div className={styles.myRankRow}>
              <span>Hạng:</span>
              <b>#{myRank.rank}</b>
            </div>

            <div className={styles.myRankRow}>
              <span>Điểm:</span>
              <b>{myRank.score}</b>
            </div>

            <div className={styles.myRankRow}>
              <span>Thời gian:</span>
              <b>{ExamModel.formatTime(myRank.time_test)}</b>
            </div>
          </div>
        )}

        {/* Bảng xếp hạng chung */}
        {ranking.length === 0 && <p className={styles.empty}>Chưa có ai thi bài này</p>}

        <div className={styles.rankList}>
          {ranking.map((item, index) => (
            <div key={index} className={styles.rankItem}>
              <div className={styles.rankNumber}>#{index + 1}</div>

              <div className={styles.rankContent}>
                <div><b>User:</b> {item.user_name}</div>
                <div><b>Score:</b> {item.score}</div>
                <div><b>Time:</b> {ExamModel.formatTime(item.time_test)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ReviewExam>
  );
}
