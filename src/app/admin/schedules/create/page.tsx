"use client";

import { ScheduleService } from "@/domain/admin/schedules/service";
import { useState } from "react";
import styles from "./Exam.Schedule.Create.module.css";
import type { ExamScheduleCreate } from "@/domain/admin/schedules/type";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ExamScheduleCreate({ onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<ExamScheduleCreate>({
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.start_time || !form.end_time) {
      alert("Vui lòng nhập đầy đủ thời gian");
      return;
    }

    try {
      setLoading(true);
      await ScheduleService.createSchedule(form);
      alert("Thêm lịch thi thành công");
      onSuccess?.();
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
        <button onClick={onCancel} className={styles.btn}>
          Huỷ
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.btn} ${styles.btn_primary}`}
        >
          {loading ? "Đang lưu..." : "Tạo lịch thi"}
        </button>
      </div>
    </div>
  );
}
