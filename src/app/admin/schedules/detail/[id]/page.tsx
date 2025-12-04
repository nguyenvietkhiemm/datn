"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScheduleService } from "@/domain/admin/schedules/service";
import styles from "./Exam.Schedule.Detail.module.css";
import { useRouter } from "next/navigation";
import { ExamSchedule } from "@/domain/admin/schedules/type";
import { Exam } from "@/domain/admin/exams/type";

export default function ExamScheduleDetail() {
  const { id } = useParams();

  const [schedule, setSchedule] = useState<ExamSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Gọi API lấy chi tiết lịch thi
  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        setLoading(true);
        const detail = await ScheduleService.fetchScheduleDetail(Number(id));
        setSchedule(detail);
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);


  const detailExam = (id: number, exam: Exam) => {
    localStorage.setItem("exam", JSON.stringify(exam));
    router.push(`/admin/exams/detail/${id}`)
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (message) return <p className={styles.error}>{message}</p>;
  if (!schedule) return <p>Không tìm thấy lịch thi.</p>;

  return (
    <div className={styles.detail_container}>
      <h2 className={styles.title}>Chi tiết lịch thi</h2>

      <div className={styles.info_box}>
        <p>
          <strong>
            <span>🕐 </span> Bắt đầu:
          </strong>{" "}
          {new Date(schedule.start_time).toLocaleString("vi-VN")}
        </p>

        <p>
          <strong>
            <span>⏰ </span> Kết thúc:
          </strong>{" "}
          {new Date(schedule.end_time).toLocaleString("vi-VN")}
        </p>

        <p>
          <strong><span>📅 </span> Ngày tạo:</strong>{" "}
          {new Date(schedule.created_at).toLocaleString("vi-VN")}
        </p>

        <p>
          <strong><span>🛠</span> Cập nhật:</strong>{" "}
          {new Date(schedule.updated_at).toLocaleString("vi-VN")}
        </p>
      </div>

      <div className={styles.list_exam}>
        <h3 className={styles.subtitle}>Danh sách đề thi</h3>
        {/* <Search setTotalPage={setTotalPage} setFilterExam={setFilterExam} currentPage={currentPage}/> */}
        {schedule.exams && schedule.exams.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên đề thi</th>
                <th>Thời gian (phút)</th>
                <th>Chủ đề</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {schedule.exams.map((exam, index) => (
                <tr key={exam.exam_id} onClick={() => detailExam(exam.exam_id, exam)}>
                  <td>{index + 1}</td>
                  <td>{exam.exam_name}</td>
                  <td>{exam.time_limit}</td>
                  <td>{exam.title}</td>
                  <td>{new Date(exam.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.empty}>Không có đề thi nào trong lịch này.</p>
        )}
      </div>
    </div>
  );
}
