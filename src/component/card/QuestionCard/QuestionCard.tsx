"use client";

import Image from "next/image";
import AutoResizeTextarea from "@/component/textarea/AutoResizeTextarea";
import styles from "./QuestionCard.module.css";
import { Question } from "@/domain/admin/questions/type";

interface QuestionCardProps {
    question: Question;
    rowIndex: number;
    editCell: { row: number; col: number } | null;
    setEditCell: (cell: { row: number; col: number } | null) => void;
    handleChange: (rowIndex: number, colIndex: number, value: string) => void;
    isChanged: (rowIndex: number, colIndex: number) => boolean;
}

export default function QuestionCard({
    question,
    rowIndex,
    editCell,
    setEditCell,
    handleChange,
    isChanged,
}: QuestionCardProps) {
    return (
        <div className={styles.card}>

            {/* ================= QUESTION TITLE ================= */}
            <h2 className={styles.title}>{question.question_name}</h2>

            {/* ================= QUESTION CONTENT (editable) ================= */}
            <div
                className={`${styles.content} ${isChanged(rowIndex, -1) ? styles.changed : ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setEditCell({ row: rowIndex, col: -1 });
                }}
            >
                {editCell?.row === rowIndex && editCell?.col === -1 ? (
                    <AutoResizeTextarea
                        value={question.question_content}
                        onChange={(e) =>
                            handleChange(rowIndex, -1, e.target.value)
                        }
                        autoFocus
                        onBlur={() => setEditCell(null)}
                    />
                ) : (
                    <p>{question.question_content}</p>
                )}
            </div>

            {/* ================= QUESTION IMAGES ================= */}
            {question?.images && question.images.length > 0 && (
                <div className={styles.imageGroup}>
                    {question?.images?.map((src, index) => (
                        <div key={index} className={styles.imageWrapper}>
                            <Image
                                src={src}
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
                        className={`${styles.answerItem} ${isChanged(rowIndex, answerIdx) ? styles.changed : ""
                            } ${ans.is_correct ? styles.correct : ""}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditCell({ row: rowIndex, col: answerIdx });
                        }}
                    >
                        {/* ===== Answer Content Editable ===== */}
                        {editCell?.row === rowIndex &&
                            editCell?.col === answerIdx ? (
                            <AutoResizeTextarea
                                value={ans.answer_content}
                                onChange={(e) =>
                                    handleChange(rowIndex, answerIdx, e.target.value)
                                }
                                autoFocus
                                onBlur={() => setEditCell(null)}
                            />
                        ) : (
                            <p className={styles.answerText}>
                                {ans.answer_content}
                            </p>
                        )}

                        {/* ===== Answer Images ===== */}
                        {ans?.images && ans.images?.length > 0 && (
                            <div className={styles.imageGroupSmall}>
                                {ans.images?.map((src, index) => (
                                    <div key={index} className={styles.imageWrapperSmall}>
                                        <Image
                                            src={src}
                                            alt={`answer-img-${index}`}
                                            width={200}
                                            height={150}
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
