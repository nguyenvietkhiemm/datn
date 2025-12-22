"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./ExamCreate.module.css";
import { useRouter } from "next/navigation";

import { ExamSchedule } from "@/domain/admin/schedules/type";
import { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { ExamService } from "@/domain/admin/exams/service";

export default function ExamCreate() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const token = Cookies.get("token");

  // ================= STATE =================
  const [createExam, setCreateExam] = useState({
    exam_name: "",
    description: "",
    time_limit: "",
    subject_id: null as number | null,
    topic_id: null as number | null,
    exam_schedule_id: null as number | null,
  });

  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filterTopic, setFilterTopic] = useState<Topic[]>([]);

  // ================= HELPER =================
  const updateExam = (
    key: keyof typeof createExam,
    value: any
  ) => {
    setCreateExam((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [scheduleRes, subjectRes, topicRes] = await Promise.all([
          fetch(`${API_URL}/exams/schedule`, { headers }),
          fetch(`${API_URL}/subjects`, { headers }),
          fetch(`${API_URL}/topics`, { headers }),
        ]);

        const scheduleData = await scheduleRes.json();
        const subjectData = await subjectRes.json();
        const topicData = await topicRes.json();

        setExamSchedules(scheduleData.data || []);
        setSubjects(subjectData.data || []);
        setTopics(topicData.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu", err);
      }
    };

    fetchAll();
  }, [API_URL, token]);

  // ================= FILTER TOPIC =================
  useEffect(() => {
    setFilterTopic(
      topics.filter(
        (t) => t.subject_id === createExam.subject_id
      )
    );
  }, [createExam.subject_id, topics]);

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      exam_name,
      description,
      time_limit,
      subject_id,
      topic_id,
      exam_schedule_id,
    } = createExam;

    if (
      !exam_name ||
      !description ||
      !time_limit ||
      !subject_id ||
      !topic_id ||
      !exam_schedule_id
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await ExamService.createExam({
        exam_name,
        description,
        time_limit: Number(time_limit),
        subject_id,
        topic_id,
        exam_schedule_id,
      });

      alert("Tạo bài thi thành công!");

      router.push(
        `/admin/exams/create/${res.data.exam_id}/questions`
      );
    } catch (err: any) {
      alert(err.message || "Không thể tạo bài thi!");
    }
  };

  // ================= RENDER =================
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tạo bài thi mới</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Tên bài thi */}
        <label className={styles.label}>Tên bài thi</label>
        <input
          className={styles.input}
          value={createExam.exam_name}
          onChange={(e) =>
            updateExam("exam_name", e.target.value)
          }
        />

        {/* Mô tả */}
        <label className={styles.label}>Mô tả</label>
        <textarea
          className={styles.textarea}
          rows={4}
          value={createExam.description}
          onChange={(e) =>
            updateExam("description", e.target.value)
          }
        />

        {/* Thời gian */}
        <label className={styles.label}>Thời gian (phút)</label>
        <input
          type="number"
          className={styles.input}
          value={createExam.time_limit}
          onChange={(e) =>
            updateExam("time_limit", e.target.value)
          }
        />

        {/* Môn học */}
        <label className={styles.label}>Môn học</label>
        <select
          className={styles.select}
          value={createExam.subject_id ?? ""}
          onChange={(e) =>
            updateExam(
              "subject_id",
              e.target.value
                ? Number(e.target.value)
                : null
            )
          }
        >
          <option value="">-- Chọn môn học --</option>
          {subjects.map((s) => (
            <option
              key={s.subject_id}
              value={s.subject_id}
            >
              {s.subject_name}
            </option>
          ))}
        </select>

        {/* Chủ đề */}
        <label className={styles.label}>Chủ đề</label>
        <select
          className={styles.select}
          value={createExam.topic_id ?? ""}
          onChange={(e) =>
            updateExam(
              "topic_id",
              e.target.value
                ? Number(e.target.value)
                : null
            )
          }
        >
          <option value="">-- Chọn chủ đề --</option>
          {filterTopic.map((t) => (
            <option
              key={t.topic_id}
              value={t.topic_id}
            >
              {t.title}
            </option>
          ))}
        </select>

        {/* Lịch thi */}
        <label className={styles.label}>Lịch thi</label>
        <select
          className={styles.select}
          value={createExam.exam_schedule_id ?? ""}
          onChange={(e) =>
            updateExam(
              "exam_schedule_id",
              e.target.value
                ? Number(e.target.value)
                : null
            )
          }
        >
          <option value="">-- Chọn lịch thi --</option>
          {examSchedules.map((s) => (
            <option
              key={s.exam_schedule_id}
              value={s.exam_schedule_id}
            >
              {new Date(s.start_time).toLocaleString("vi-VN")}
              {" → "}
              {new Date(s.end_time).toLocaleString("vi-VN")}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.button}>
          Lưu bài thi
        </button>
      </form>
    </div>
  );
}
