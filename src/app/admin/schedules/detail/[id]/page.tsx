"use client";

import { useEffect, useState } from "react";
import { ScheduleService } from "@/domain/admin/schedules/service";
import { ExamSchedule } from "@/domain/admin/schedules/type";
import styles from "./Exam.Schedule.Detail.module.css";

export default function ScheduleExamView({
  scheduleId,
  onBack,
}: {
  scheduleId: number;
  onBack: () => void;
}) {
  const [schedule, setSchedule] = useState<ExamSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const data = await ScheduleService.fetchScheduleDetail(scheduleId);
      setSchedule(data);
      setLoading(false);
    };
    loadDetail();
  }, [scheduleId]);

  if (loading) return <p>Đang tải...</p>;
  if (!schedule) return null;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Quay lại
      </button>

      <h2 className={styles.title}>Chi tiết lịch thi</h2>

      <div className={styles.info}>
        <p><strong>Bắt đầu:</strong> {new Date(schedule.start_time).toLocaleString("vi-VN")}</p>
        <p><strong>Kết thúc:</strong> {new Date(schedule.end_time).toLocaleString("vi-VN")}</p>
      </div>

      <h3 className={styles.subtitle}>Danh sách đề thi</h3>

      {schedule.exams?.length ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đề</th>
              <th>Thời gian</th>
              <th>Chủ đề</th>
            </tr>
          </thead>
          <tbody>
            {schedule.exams.map((exam, i) => (
              <tr key={exam.exam_id}>
                <td>{i + 1}</td>
                <td>{exam.exam_name}</td>
                <td>{exam.time_limit} phút</td>
                <td>{exam.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.empty}>Không có đề thi</p>
      )}
    </div>
  );
}
