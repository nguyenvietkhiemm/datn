"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./BankDetail.module.css";
import { Question } from "@/domain/admin/questions/type";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { ImagePreview } from "@/component/questionCreate/ImageReview/page";

export interface Bank {
    bank_id: number;
    description: string;
    topic_id: number;
    available: boolean;
    time_limit: number;
    topic_name: string;
}

export default function BankDetail() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [bank, setBank] = useState<Bank>();

    const params = useParams();
    const id = params.id;

    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        const bankRaw = localStorage.getItem("bank");
        if (bankRaw) {
            const exams = JSON.parse(bankRaw);
            setBank(exams);
        }
        const token = Cookies.get("token");
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

        const fetchBank = async () => {
            try {
                const res = await fetch(`${API_URL}/banks/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (Array.isArray(data.data.question)) {
                    setQuestions(data.data.question);
                } else {
                    setQuestions([]);
                }
            } catch (err) {
                console.error("Lỗi khi fetch bank:", err);
            }
        };

        fetchBank();
    }, [id]);

    const handleSelect = (questionId: number, answerId: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    // ================= SCROLL =================
    const scrollToQuestion = (questionId: number) => {
        questionRefs.current[questionId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // ================= RENDER =================
    return (
        <div className={styles.exam_container}>
            {/* HEADER */}
            <div className={styles.exam_header}>
                <h2>{bank?.description}</h2>
            </div>

            <div className={styles.exam_body}>
                {/* LEFT: QUESTIONS */}
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

                {/* RIGHT: NAVIGATOR */}
                <div className={styles.rightPanel}>
                    <div className={styles.topSection}>
                        <div className={styles.timer}>
                            ⏱ {bank?.time_limit} phút
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {questions.map((q, i) => (
                            <button
                                key={q.question_id}
                                className={`${styles.numButton} ${answers[q.question_id]
                                    ? styles.answered
                                    : ""
                                    }`}
                                onClick={() =>
                                    scrollToQuestion(q.question_id)
                                }
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
