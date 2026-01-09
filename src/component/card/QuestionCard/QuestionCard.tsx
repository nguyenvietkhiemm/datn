"use client";

import styles from "./QuestionCard.module.css";
import { Question } from "@/domain/admin/questions/type";
import { answerLabel } from "@/lib/model";
import { ImagePreview } from "@/component/questionCreate/ImagePreview/page";
import { LatexPreview } from "@/component/questionCreate/LatexPreview/page";
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";
import { useState } from "react";

interface QuestionCardProps {
    question: Question;
    rowIndex: number;
    handleDelete?: (questionId: number) => void;
    handleToggleAvailable?: (questionId: number, available: boolean) => void;
}

export default function QuestionCard({
    question,
    rowIndex,
    handleDelete,
    handleToggleAvailable
}: QuestionCardProps) {
    const [notify, setNotify] = useState<typeNoti | null>(null);
    return (
        <div className={styles.card}>

            {/* ================= QUESTION TITLE ================= */}
            <h2 className={styles.title}>{`Câu ${rowIndex + 1}`}</h2>

            <div className={styles.actions}>
                {/* Toggle Available */}
                {handleToggleAvailable && (
                    <button
                        className={question.available ? styles.active : styles.inactive}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAvailable(question.question_id, !question.available);
                        }}
                    >
                        {question.available ? "Hoạt động" : "Không hoạt động"}
                    </button>
                )}

                {/* Delete */}
                {handleDelete && (
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            setNotify({
                                message: (
                                    <>
                                        "Bạn có chắc muốn xoá câu hỏi này?"
                                    </>
                                ),
                                type: "warning",
                                confirm: true,
                                duration: 3000
                            });

                            handleDelete(question.question_id);

                        }}
                    >
                        Xoá
                    </button>
                )}
            </div>

            {/* ================= QUESTION CONTENT (editable) ================= */}
            <div
                className={styles.content}
            >
                <LatexPreview text={question.question_content} />
            </div>

            {/* ================= QUESTION IMAGES ================= */}
            {question?.images && question.images.length > 0 && (
                <div className={styles.imageGroup}>
                    {question?.images?.map((src, index) => (
                        <div key={index} className={styles.imageWrapper}>
                            <ImagePreview filename={src} width={200} />
                        </div>
                    ))}
                </div>
            )}

            {/* ================= ANSWERS ================= */}
            <div className={styles.answerList}>
                {question.answers.map((ans, answerIdx) => (
                    <div
                        key={ans.answer_id}
                        className={styles.answerItem}
                    >
                        <div className={styles.answer_main}>
                            <span className={styles.answerLabel}>
                                {answerLabel(answerIdx)}.
                            </span>
                            <div className={styles.answerText}>
                                <LatexPreview text={ans.answer_content} />
                                {ans.is_correct && <strong>(✔)</strong>}
                            </div>
                        </div>

                        {/* ===== Answer Images ===== */}
                        {ans?.images && ans.images?.length > 0 && (
                            <div className={styles.imageGroupSmall}>
                                {ans.images?.map((src, index) => (
                                    <div key={index} className={styles.imageWrapperSmall}>
                                        <ImagePreview filename={src} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
