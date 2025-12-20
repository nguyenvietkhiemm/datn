"use client";

import Image from "next/image";
import AutoResizeTextarea from "@/component/textarea/AutoResizeTextarea";
import styles from "./QuestionCard.module.css";
import { Question } from "@/domain/admin/questions/type";
import { API_URL } from "@/lib/service";
import { FileParserService } from "@/domain/admin/file/file-parser/service";

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

    const answerLabel = (index: number) => String.fromCharCode(65 + index);

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
                        {question.available ? "hoạt động" : "Không hoạt động"}
                    </button>
                )}

                {/* Delete */}
                {handleDelete && (
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Bạn có chắc muốn xoá câu hỏi này?")) {
                                handleDelete(question.question_id);
                            }
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
                <p>{question.question_content}</p>
            </div>

            {/* ================= QUESTION IMAGES ================= */}
            {question?.images && question.images.length > 0 && (
                <div className={styles.imageGroup}>
                    {question?.images?.map((src, index) => (
                        <div key={index} className={styles.imageWrapper}>
                            <img
                                src={FileParserService.getImageUrl(src)}
                                alt={`question-img-${index}`}
                                width={300}
                                height={200}
                                className={styles.image}
                            />
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
                        <span className={styles.answerLabel}>
                            {answerLabel(answerIdx)}.
                        </span>

                        <p className={styles.answerText}>
                            {ans.answer_content}
                        </p>

                        {/* ===== Answer Images ===== */}
                        {ans?.images && ans.images?.length > 0 && (
                            <div className={styles.imageGroupSmall}>
                                {ans.images?.map((src, index) => (
                                    <div key={index} className={styles.imageWrapperSmall}>
                                        <img
                                            src={FileParserService.getImageUrl(src)}
                                            alt={`answer-img-${index}`}
                                            width={300}
                                            height={0}
                                            style={{ height: "auto" }}
                                            className={styles.image}
                                        />
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
