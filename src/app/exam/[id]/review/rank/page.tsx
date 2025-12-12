"use client";
import { useEffect, useState } from "react";
import { ExamService } from "../../../../../../domain/exam/service";
import { Rank, RankProp, myRank } from "../../../../../../domain/exam/type";
import styles from "./Rank.module.css";
import ReviewExam from "../page";
import { useParams } from "next/navigation";

export default function Ranking() {
  const params = useParams();
  const exam_id = Number(params.id);
  const [ranking, setRanking] = useState<Rank[]>([]);
  const [myRank, setMyRank] = useState<myRank | null>(null);
  const user_name = localStorage.getItem("user_name");

  useEffect(() => {
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
            <div className={styles.myRankTitle}>Hạng của bạn: #{myRank.rank}</div>
            <div>Điểm: <b>{myRank.final_score}</b></div>
          </div>
        )}

        {/* Bảng xếp hạng chung */}
        {ranking.length === 0 && <p className={styles.empty}>Chưa có ai thi bài này</p>}

        <div className={styles.rankList}>
          {ranking?.map((item: any, index) => (
            <div
              key={index}
              className={`${styles.rankItem} ${index === 0 ? styles.top1 :
                  index === 1 ? styles.top2 :
                    index === 2 ? styles.top3 : ""
                }`}
            >
              <div className={styles.rankNumber}>#{index + 1}</div>
              <div className={styles.rankContent}>
                <div>User Name: {item.user_name}</div>
                <div className={styles.score}>Điểm: {item.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ReviewExam>
  );
}
