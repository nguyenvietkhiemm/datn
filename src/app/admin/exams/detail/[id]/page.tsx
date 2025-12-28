"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./ExamDetail.module.css"
import type { Exam } from "@/domain/admin/exams/type";
import { Question } from "@/domain/admin/questions/type";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { ImagePreview } from "@/component/questionCreate/ImageReview/page";
import { useRouter } from "next/navigation";
import { Button } from "@/component/ui/button/Button";

export default function ExamDetail() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [exam, setExam] = useState<Exam>();
    const params = useParams();
    const id = params.id;
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const router = useRouter();

    //dữ liệu câu hỏi
    useEffect(() => {
        const token = Cookies.get("token");
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
        const examsRaw = localStorage.getItem("exam");

        if (examsRaw) {
            const exams = JSON.parse(examsRaw);
            setExam(exams);
        }
        const fetchExamId = async () => {
            const resExamId = await fetch(`${API_URL}/exams/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await resExamId.json();
            if (Array.isArray(data.data.question)) {
                setQuestions(data.data.question);
            } else {
                setQuestions([]);
            }
        }

        fetchExamId()
    }, [id]);

    const scrollToQuestion = (questionId: number) => {
        questionRefs.current[questionId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const editExam = (id: number) => {
        router.push(`/admin/exams/create/${id}/questions`)
    }    

    return (
        <div className={styles.exam_container}>
            {/* Header */}
            <div className={styles.exam_header}>
                <h2>{exam?.exam_name}</h2>
                <Button onClick={() => editExam(Number(id))}>Chỉnh sửa câu hỏi</Button>
            </div>

            <div className={styles.exam_body}>
                {/* Left: Questions */}
                <div className={styles.leftPanel}>
                    {questions.length > 0 ? (
                        questions?.map((q, i) => (
                            <div key={q.question_id} className={styles.questionBox} ref={(el) => {
                                questionRefs.current[q.question_id] = el;
                            }}>
                                <div className={styles.questionText}>
                                    <strong>{i + 1}.</strong> {q.question_content}
                                    <div key={`q-${i}`} className={styles.imageWrapperSmall}>
                                        {q.images?.map((src, index) => (
                                            <div key={`q-${index}`} className={styles.imageWrapperSmall}>
                                                <ImagePreview filename={src} width={200} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.answers}>
                                    {q.answers.map((a) => (
                                        <label key={a.answer_id} className={styles.option}>
                                            {a.answer_content}
                                            {a.is_correct &&
                                                (
                                                    <span className={styles.correctBadge}>✔ </span>
                                                )}
                                            {a.images?.map((src, index) => (
                                                <div key={`a-${index}`} className={styles.imageWrapperSmall}>
                                                    <ImagePreview filename={src} />
                                                </div>
                                            ))}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <>Không có câu hỏi nào</>
                    )}
                </div>

                {/* Right: Navigator */}
                <div className={styles.rightPanel}>
                    <div className={styles.topSection}>
                        <div className={styles.timer}>
                            ⏱ {exam?.time_limit}
                        </div>
                    </div>
                    <div className={styles.grid}>
                        {questions.map((q, i) => (
                            <button
                                key={q.question_id}
                                className={`${styles.numButton}
                                    }`}
                                onClick={() => scrollToQuestion(q.question_id)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
