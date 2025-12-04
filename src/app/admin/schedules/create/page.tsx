"use client";

import { ScheduleService } from "@/domain/admin/schedules/service";
import { useState } from "react";
import styles from "./Exam.Schedule.Create.module.css";
import type { ExamScheduleCreate } from "@/domain/admin/schedules/type";

export default function ExamScheduleCreate() {
  const [form, setForm] = useState<ExamScheduleCreate>({
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExamSchedule = async () => {
    try {
      setLoading(true);
      await ScheduleService.createSchedule(form);
      alert("Thêm lịch thi thành công");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>Tạo lịch thi</h2>

      <div className={styles.form_body}>
        <div className={styles.field}>
          <label className={styles.label}>Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            name="start_time"
            className={styles.input}
            value={form.start_time}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Thời gian kết thúc</label>
          <input
            type="datetime-local"
            name="end_time"
            className={styles.input}
            value={form.end_time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleAddExamSchedule}
          className={`${styles.btn} ${styles.btn_primary}`}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Tạo lịch thi"}
        </button>
      </div>
    </div>
  );
}
