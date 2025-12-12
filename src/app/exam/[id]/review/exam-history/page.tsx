"use client";
import { useEffect, useState } from "react";
import styles from "./ExamHistory.module.css";
import { ExamService } from "../../../../../../domain/exam/service";

export default function ExamHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const user_name = localStorage.getItem("user_name");

  useEffect(() => {
    async function load() {
      if (!user_name) return;

      const result = await ExamService.getExamHistory(String(user_name));

      if (result?.data?.history) {
        setHistory(result.data.history);
      }
    }
    load();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lịch sử làm bài</h2>

      {history.length === 0 && (
        <p className={styles.empty}>Bạn chưa làm bài thi nào.</p>
      )}

      <div className={styles.list}>
        {history.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.left}>
              <div className={styles.examId}>Đề thi: #{item.exam_id}</div>
              <div className={styles.score}>
                Điểm: <b>{item.score}</b>
              </div>
              <div className={styles.timeTest}>
                Thời gian làm bài: {(item.time_test / 1000).toFixed(0)} giây
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.date}>
                {new Date(item.submitted_at).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
