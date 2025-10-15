"use client";
import React, { useEffect, useState } from "react";
import styles from "./ExamList.module.css";
import { useRouter } from "next/navigation";

type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number; // đơn vị: phút
    topic_title: string;
};

export default function ExamList() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [topics, setTopics] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("Tất cả");
    const router = useRouter();

    useEffect(() => {
        // Mock dữ liệu (thay bằng API thật sau)
        const mockData: Exam[] = [
            {
                exam_id: 1,
                exam_name: "Đề thi thử IELTS 01",
                created_at: "2025-10-01",
                time_limit: 60,
                topic_title: "IELTS Academic",
            },
            {
                exam_id: 2,
                exam_name: "Đề thi thử TOEIC Reading",
                created_at: "2025-09-20",
                time_limit: 45,
                topic_title: "TOEIC",
            },
            {
                exam_id: 3,
                exam_name: "Đề thi thử HSK 4",
                created_at: "2025-08-28",
                time_limit: 70,
                topic_title: "HSK 4",
            },
            {
                exam_id: 4,
                exam_name: "Đề thi Toán THPTQG 2025",
                created_at: "2025-09-10",
                time_limit: 90,
                topic_title: "Toán THPTQG",
            },
            {
                exam_id: 5,
                exam_name: "Đề thi thử ACT 2025",
                created_at: "2025-07-30",
                time_limit: 60,
                topic_title: "ACT",
            },
        ];

        setExams(mockData);
        setTopics(["Tất cả", ...Array.from(new Set(mockData.map((e) => e.topic_title)))]);
    }, []);

    const filteredExams =
        selectedTopic === "Tất cả"
            ? exams
            : exams.filter((e) => e.topic_title === selectedTopic);

    const handleDoExam = (exam_id : number) => {
        router.push(`/exam/${exam_id}/do`)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🧠 Danh sách đề thi thử</h1>

            {/* Thanh chọn topic */}
            <div className={styles.topicFilter}>
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`${styles.topicButton} ${selectedTopic === topic ? styles.active : ""
                            }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* Danh sách đề thi */}
            <div className={styles.grid}>
                {filteredExams.map((exam, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.header}>
                            <h2 className={styles.examName}>{exam.exam_name}</h2>
                            <span className={styles.topic}>{exam.topic_title}</span>
                        </div>
                        <p className={styles.date}>
                            📅 Ngày tạo: {new Date(exam.created_at).toLocaleDateString("vi-VN")}
                        </p>
                        <p className={styles.time}>⏱ Thời gian làm bài: {exam.time_limit} phút</p>
                        <button onClick = {() => handleDoExam(exam.exam_id)} className={styles.button}>Bắt đầu thi</button>
                    </div>
                ))}

                {filteredExams.length === 0 && (
                    <p className={styles.empty}>Không có đề thi cho chủ đề này.</p>
                )}
            </div>
        </div>
    );
}
