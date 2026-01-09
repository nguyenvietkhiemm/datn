"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./BankDetail.module.css";
import { Question } from "@/domain/admin/questions/type";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { ImagePreview } from "@/component/questionCreate/ImagePreview/page";
import { Button } from "@/component/ui/button/Button";
import { useRouter } from "next/navigation";
import { FlatQuestions, TypeQuestion, PART_LABEL } from "../../../../../lib/model";
import { LatexPreview } from "@/component/questionCreate/LatexPreview/page";

export interface Bank {
    bank_id: number;
    description: string;
    topic_id: number;
    available: boolean;
    time_limit: number;
    topic_name: string;
}

export default function BankDetail() {
    const [questionGroup, setQuestionGroup] = useState<Record<number, Question[]>>({});
    const [bank, setBank] = useState<Bank>();
    const router = useRouter();
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

                setQuestionGroup(data.data.question);
            } catch (err) {
                console.error("Lỗi khi fetch bank:", err);
            }
        };

        fetchBank();
    }, [id]);

    const editBank = (id: number) => {
        router.push(`/admin/bank/create/${id}/questions`)
    }

    // SCROLL
    const scrollToQuestion = (questionId: number) => {
        questionRefs.current[questionId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    let globalIndex = 0;

    const flatQuestions: Question[] = FlatQuestions(questionGroup)

    // RENDER
    return (
        <div className={styles.exam_container}>
            {/* HEADER */}
            <div className={styles.exam_header}>
                <h2>{bank?.description}</h2>
                <Button onClick={() => editBank(Number(id))}>Chỉnh sửa câu hỏi</Button>
            </div>

            <div className={styles.exam_body}>
                {/* Left: Questions */}
                <div className={styles.leftPanel}>
                    {TypeQuestion.map((type) => (
                        <div key={type}>
                            {/* TITLE PHẦN */}
                            <h3 className={styles.partTitle}>
                                {PART_LABEL[type]}
                            </h3>

                            {/* QUESTIONS */}
                            {questionGroup[type] && questionGroup[type]?.map((q) => {
                                const index = globalIndex++;

                                return (
                                    <div key={q.question_id} className={styles.questionBox} ref={(el) => {
                                        questionRefs.current[q.question_id] = el;
                                    }}>
                                        <div className={styles.questionText}>
                                            <strong>{index + 1}.</strong>
                                            <LatexPreview text={q.question_content} />
                                            <div key={`q-${index}`} className={styles.imageWrapperSmall}>
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
                                                    <div className={styles.answerText}>
                                                        <LatexPreview text={a.answer_content} />
                                                        {a.is_correct && <strong>(✔)</strong>}
                                                    </div>
                                                    {a.images?.map((src, index) => (
                                                        <div key={`a-${index}`} className={styles.imageWrapperSmall}>
                                                            <ImagePreview filename={src} />
                                                        </div>
                                                    ))}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                    )
                    }

                </div>
                {/* Right: Navigator */}
                <div className={styles.rightPanel}>
                    <div className={styles.topSection}>
                        <div className={styles.timer}>
                            ⏱ {bank?.time_limit}
                        </div>
                    </div>
                    <div className={styles.grid}>
                        {flatQuestions.map((q, i) => (
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
