"use client";
import { useEffect, useState } from "react";
import styles from "./ExamHistory.module.css";
import { ExamService } from "../../../domain/exam/service";
import ReviewExam from "@/app/exam/[id]/review/page";
import { useParams, useRouter } from "next/navigation";
import { formatVNDateTime } from "../../../lib/model";

export default function ExamHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();
  const param = useParams();
  const exam_id = Number(param.id);

  useEffect(() => {

    async function load() {
      const result = await ExamService.getExamHistory();

      if (result?.data?.history) {
        setHistory(result.data.history);
      }
    }
    load();
  }, []);

  const handleResult = (history_exam_id: number, exam_id: number) => {
    router.push(`/exam/${exam_id}/result/${history_exam_id}`)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lịch sử làm bài</h2>

      {history.length === 0 && (
        <p className={styles.empty}>Bạn chưa làm bài thi nào.</p>
      )}

      <div className={styles.list}>
        {history?.map((item, index) => (
          <div key={index} className={styles.card} onClick={() => handleResult(item.history_exam_id, item.exam_id)}>
            <div className={styles.left}>
              <div className={styles.exam_name}>{item.exam_name}</div>
              <div className={styles.score}>
                Điểm: <b>{item.score}</b>
              </div>
              <div className={styles.timeTest}>
                Thời gian làm bài: {(item.time_test / 1000).toFixed(0)} giây
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.date}>
                {formatVNDateTime(item.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
