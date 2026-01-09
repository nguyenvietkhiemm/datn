"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./BankCreate.module.css";
import { useRouter } from "next/navigation";
import { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { BankService } from "@/domain/admin/banks/service";
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";

export default function BankCreate() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const token = Cookies.get("token");
  const [notify, setNotify] = useState<typeNoti | null>(null);
  // ================= STATE =================
  const [createBank, setCreateBank] = useState({
    description: "",
    time_limit: "",
    subject_id: null as number | null,
    topic_id: null as number | null,
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filterTopic, setFilterTopic] = useState<Topic[]>([]);

  // ================= UPDATE =================
  const updateBank = (
    key: keyof typeof createBank,
    value: any
  ) => {
    setCreateBank((prev) => ({
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

        const [subjectRes, topicRes] = await Promise.all([
          fetch(`${API_URL}/subjects`, { headers }),
          fetch(`${API_URL}/topics`, { headers }),
        ]);

        const subjectData = await subjectRes.json();
        const topicData = await topicRes.json();

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
    if (!createBank.subject_id) {
      setFilterTopic([]);
      setCreateBank((prev) => ({
        ...prev,
        topic_id: null,
      }));
      return;
    }

    setFilterTopic(
      topics.filter(
        (t) => t.subject_id === createBank.subject_id
      )
    );
  }, [createBank.subject_id, topics]);

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      description,
      time_limit,
      subject_id,
      topic_id,
    } = createBank;

    if (!description || !time_limit || !subject_id || !topic_id) {
      setNotify({
        message: "Vui lòng điền đầy đủ thông tin!",
        type: "warning",
        confirm: false
      });
      return;
    }

    try {
      const res = await BankService.createBank({
        description,
        time_limit: Number(time_limit),
        subject_id,
        topic_id,
      });

      router.push(
        `/admin/bank/create/${res.bank_id}/questions`
      );
      setNotify({
        message: "Tạo ngân hàng câu hỏi thành công!",
        type: "success",
        confirm: false
      });
    } catch (err: any) {
      setNotify({
        message: err.message,
        type: "error",
        confirm: false
      });
    }
  };

  // ================= RENDER =================
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tạo ngân hàng câu hỏi</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Mô tả */}
        <label className={styles.label}>Mô tả</label>
        <textarea
          className={styles.textarea}
          rows={4}
          value={createBank.description}
          onChange={(e) =>
            updateBank("description", e.target.value)
          }
        />

        {/* Thời gian */}
        <label className={styles.label}>Thời gian (phút)</label>
        <input
          type="number"
          className={styles.input}
          value={createBank.time_limit}
          onChange={(e) =>
            updateBank("time_limit", e.target.value)
          }
        />

        {/* Môn học */}
        <label className={styles.label}>Môn học</label>
        <select
          className={styles.select}
          value={createBank.subject_id ?? ""}
          onChange={(e) =>
            updateBank(
              "subject_id",
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option value="">-- Chọn môn học --</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        {/* Chủ đề */}
        <label className={styles.label}>Chủ đề</label>
        <select
          className={styles.select}
          value={createBank.topic_id ?? ""}
          disabled={!createBank.subject_id}
          onChange={(e) =>
            updateBank(
              "topic_id",
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option value="">-- Chọn chủ đề --</option>
          {filterTopic.map((t) => (
            <option key={t.topic_id} value={t.topic_id}>
              {t.title}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.button}>
          Lưu ngân hàng
        </button>
      </form>
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
