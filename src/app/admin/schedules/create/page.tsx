"use client";

import { ScheduleService } from "@/domain/admin/schedules/service";
import { useState } from "react";
import styles from "./Exam.Schedule.Create.module.css";
import type { ExamScheduleCreate } from "@/domain/admin/schedules/type";
import { ExamSchedule } from "@/domain/admin/schedules/type";
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";

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
  const [notify, setNotify] = useState<typeNoti | null>(null);
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
      setNotify({
        message: "Vui lòng nhập đầy đủ thời gian",
        type: "warning",
      })
      return;
    }

    if (new Date(form.start_time) >= new Date(form.end_time)) {
      setNotify({
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        type: "warning",
      })
      return;
    }

    try {
      setLoading(true);

      if (isEdit && initialData) {
        await ScheduleService.updateSchedule(
          initialData.exam_schedule_id,
          form
        );
        setNotify({
          message: "Cập nhật lịch thi thành công",
          type: "success",
        })

      } else {
        await ScheduleService.createSchedule(form);
        setNotify({
          message: "Thêm lịch thi thành công",
          type: "success",
        })
      }
      onSuccess?.();
    } catch (e: any) {
      setNotify({
        message: `${e.message}`,
        type: "error",
      })
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
      {notify && (
        <NotificationPopup
          message={notify.message}
          type={notify.type}
          onClose={() => setNotify(null)}
        />
      )}
    </div>
  );
}
