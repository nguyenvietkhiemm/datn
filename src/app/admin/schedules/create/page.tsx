"use client";

import { ScheduleService } from "@/domain/admin/schedules/service";
import { useState } from "react";
import styles from "./Exam.Schedule.Create.module.css";
import type { ExamScheduleCreate } from "@/domain/admin/schedules/type";
import { ExamSchedule } from "@/domain/admin/schedules/type";

type Props = {
  initialData?: ExamSchedule;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function ExamScheduleCreate({
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState<ExamScheduleCreate>({
    start_time: initialData?.start_time
      ? initialData.start_time.slice(0, 16)
      : "",
    end_time: initialData?.end_time
      ? initialData.end_time.slice(0, 16)
      : "",
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

    if (new Date(form.start_time) >= new Date(form.end_time)) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    try {
      setLoading(true);
      if (new Date(form.start_time) >= new Date(form.end_time)) {
        alert("Thời gian kết thúc phải sau thời gian bắt đầu");
        return;
      }

      if (isEdit && initialData) {
        await ScheduleService.updateSchedule(
          initialData.exam_schedule_id,
          form
        );
        alert("Cập nhật lịch thi thành công");
      } else {
        await ScheduleService.createSchedule(form);
        alert("Thêm lịch thi thành công");
      }
      onSuccess?.();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>
        {isEdit ? "Cập nhật lịch thi" : "Tạo lịch thi"}
      </h2>


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
          {loading
            ? "Đang lưu..."
            : isEdit
              ? "Cập nhật"
              : "Tạo lịch thi"}

        </button>
      </div>
    </div>
  );
}
