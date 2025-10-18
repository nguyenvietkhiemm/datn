"use client";
import React, { useEffect, useState } from "react";
import styles from "./ExamList.module.css";
import { useRouter } from "next/navigation";
import Topic from "@/components/filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setExams } from "@/store/slices/examSlice";

type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
};

export default function ExamList() {
    const [filterExam, setFilterExam] = useState<Exam[]>([])
    const router = useRouter();
    const exams = useSelector((state : RootState) => state.exam.exams);
    const dispatch = useDispatch();

    useEffect(() => {
        // Mock dữ liệu (thay bằng API thật sau)
        const mockExams: Exam[] = [
            {
              exam_id: 1,
              exam_name: "Đề luyện tập Hàm số và đồ thị - Số 1",
              created_at: "2025-10-05T09:00:00Z",
              time_limit: 60,
              topic_id: 1, // Hàm số và đồ thị
            },
            {
              exam_id: 2,
              exam_name: "Đề luyện tập Hàm số và đồ thị - Số 2",
              created_at: "2025-10-12T09:00:00Z",
              time_limit: 60,
              topic_id: 1,
            },
            {
              exam_id: 3,
              exam_name: "Đề thi Hình học không gian tổng hợp",
              created_at: "2025-09-25T08:30:00Z",
              time_limit: 90,
              topic_id: 2, // Hình học không gian
            },
            {
              exam_id: 4,
              exam_name: "Đề luyện tập Dao động cơ học",
              created_at: "2025-09-18T13:45:00Z",
              time_limit: 45,
              topic_id: 3, // Dao động cơ học
            },
            {
              exam_id: 5,
              exam_name: "Đề tổng hợp Điện xoay chiều",
              created_at: "2025-09-10T10:00:00Z",
              time_limit: 60,
              topic_id: 4, // Điện xoay chiều
            },
            {
              exam_id: 6,
              exam_name: "Đề luyện Phản ứng oxi hóa - khử",
              created_at: "2025-08-28T07:00:00Z",
              time_limit: 50,
              topic_id: 5, // Phản ứng oxi hóa - khử
            },
            {
              exam_id: 7,
              exam_name: "Đề luyện Este - Lipit",
              created_at: "2025-08-15T08:30:00Z",
              time_limit: 60,
              topic_id: 6, // Este - Lipit
            },
            {
              exam_id: 8,
              exam_name: "Đề ôn tập Thì trong tiếng Anh",
              created_at: "2025-07-30T09:00:00Z",
              time_limit: 45,
              topic_id: 7, // Thì trong tiếng Anh
            },
            {
              exam_id: 9,
              exam_name: "Đề luyện Mệnh đề quan hệ nâng cao",
              created_at: "2025-07-22T11:00:00Z",
              time_limit: 50,
              topic_id: 8, // Mệnh đề quan hệ
            },
            {
              exam_id: 10,
              exam_name: "Đề luyện Nghị luận xã hội",
              created_at: "2025-07-10T14:00:00Z",
              time_limit: 90,
              topic_id: 9, // Nghị luận xã hội
            },
            {
              exam_id: 11,
              exam_name: "Đề đọc hiểu văn bản THPTQG 2025",
              created_at: "2025-06-28T08:00:00Z",
              time_limit: 60,
              topic_id: 10, // Đọc hiểu văn bản
            },
          ];          
        dispatch(
          setExams(mockExams)
        )
    }, []);

    const handleDoExam = (exam_id : number) => {
        router.push(`/exam/${exam_id}/do`)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Danh sách đề thi thử</h1>

            {/* Thanh chọn topic */}
            <Topic exams={exams} setFilterExam={setFilterExam}/>

            {/* Danh sách đề thi */}
            <div className={styles.grid}>
                {filterExam.map((exam, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.header}>
                            <h2 className={styles.examName}>{exam.exam_name}</h2>
                        </div>
                        <p className={styles.date}>
                            📅 Ngày tạo: {new Date(exam.created_at).toLocaleDateString("vi-VN")}
                        </p>
                        <p className={styles.time}>⏱ Thời gian làm bài: {exam.time_limit} phút</p>
                        <button onClick = {() => handleDoExam(exam.exam_id)} className={styles.button}>Bắt đầu thi</button>
                    </div>
                ))}

                {filterExam.length === 0 && (
                    <p className={styles.empty}>Không có đề thi cho chủ đề này.</p>
                )}
            </div>
        </div>
    );
}
