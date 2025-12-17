"use client";

import styles from "./QuestionCreate.module.css";
import type { Question } from "@/domain/admin/questions/type";
import Image from "next/image";

type ChangeValue =
    | string
    | number
    | boolean
    | null
    | File[]
    | {
        answerIndex: number;
        imageIndex: number;
    };

interface QuestionCardProps {
    question: Omit<Question, "question_id">;
    rowIndex: number;
    editCell: { row: number; col: number } | null;
    setEditCell: (cell: { row: number; col: number } | null) => void;
    handleChange: (rowIndex: number, colIndex: number, value: ChangeValue) => void;
    isChanged: (rowIndex: number, colIndex: number) => boolean;
}

export default function QuestionCardEditor({
    question,
    rowIndex,
    editCell,
    setEditCell,
    handleChange,
    isChanged,
}: QuestionCardProps) {

    const currentType = question.type_question ?? 1;
    // console.log(
    //     question.answers.map((a, i) => ({
    //       answer: i,
    //       images: a.images,
    //     }))
    //   );      

    return (
        <div className={styles.container}>
            {/* QUESTION CONTENT */}
            <label className={styles.label}>Nội dung câu hỏi</label>

            {editCell?.row === rowIndex && editCell.col === -1 ? (
                <textarea
                    className={`${styles.textarea} ${styles.changed}`}
                    value={question.question_content}
                    onChange={(e) =>
                        handleChange(rowIndex, -1, e.target.value)
                    }
                    onBlur={() => setEditCell(null)}
                    autoFocus
                />
            ) : (
                <p
                    className={`${styles.text} ${isChanged(rowIndex, -1) ? styles.changed : ""
                        }`}
                    onClick={() => setEditCell({ row: rowIndex, col: -1 })}
                >
                    {question.question_content}
                </p>
            )}

            {/* QUESTION IMAGES */}
            {Array.isArray(question.images) && question.images.length > 0 && (
                <div className={styles.previewWrap}>
                    {question.images.map((img, i) => (
                        <img key={i} src={img} className={styles.preview} />
                    ))}
                </div>
            )}

            {/* PREVIEW ẢNH MỚI (CHƯA UPLOAD) */}
            {Array.isArray(question.newImages) && question.newImages.length > 0 && (
                <div className={styles.previewWrap}>
                    {question?.newImages?.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        
                        return (
                            <div key={index} className={styles.imageWrapperSmall}>
                                <img
                                    src={previewUrl}
                                    alt={`preview-${index}`}
                                    className={styles.preview}
                                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                                />
                      
                                <button
                                    className={styles.removeBtn}
                                    onClick={() =>
                                        handleChange(rowIndex, -7, {
                                            answerIndex: -1,
                                            imageIndex: index,
                                        })
                                    }
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.input}>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        if (!e.target.files) return;
                        handleChange(rowIndex, -6, Array.from(e.target.files));
                    }}
                />
            </div>

            <button
                className={styles.addBtn}
                onClick={() => handleChange(rowIndex, -5, true)}
            >
                x
            </button>

            <label className={styles.label}>Loại câu hỏi</label>

            {/* type_question */}
            <div className={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        checked={currentType === 1}
                        onChange={() => handleChange(rowIndex, -2, 1)}
                    />
                    Trắc nghiệm 1 đáp án
                </label>

                <label>
                    <input
                        type="radio"
                        checked={currentType === 2}
                        onChange={() => handleChange(rowIndex, -2, 2)}
                    />
                    Trắc nghiệm nhiều đáp án
                </label>

                <label>
                    <input
                        type="radio"
                        checked={currentType === 3}
                        onChange={() => handleChange(rowIndex, -2, 3)}
                    />
                    Tự luận
                </label>
            </div>

            {/* ANSWERS */}
            <label className={styles.label}>Đáp án</label>

            {question.answers.map((ans, colIndex) => (
                <div key={colIndex} className={styles.answerRow}>

                    <input
                        type={currentType === 1 ? "radio" : "checkbox"}
                        name={`correct-${rowIndex}`}
                        checked={!!ans.is_correct}
                        onChange={() =>
                            handleChange(rowIndex, 1000 + colIndex, true)
                        }
                    />

                    {editCell?.row === rowIndex &&
                        editCell.col === colIndex ? (
                        <input
                            className={`${styles.input} ${styles.changed}`}
                            value={ans.answer_content}
                            onChange={(e) =>
                                handleChange(rowIndex, colIndex, e.target.value)
                            }
                            onBlur={() => setEditCell(null)}
                            autoFocus
                        />
                    ) : (
                        <span
                            className={
                                isChanged(rowIndex, colIndex)
                                    ? styles.changed
                                    : ""
                            }
                            onClick={() =>
                                setEditCell({ row: rowIndex, col: colIndex })
                            }
                        >
                            {ans.answer_content}
                        </span>
                    )}

                    {ans.is_correct && (
                        <span className={styles.correct}>✔</span>
                    )}

                    {Array.isArray(ans.images) && ans?.images?.length > 0 && (
                        <div className={styles.previewWrap}>
                            {ans.images?.map((src, index) => (
                                <div key={index} className={styles.imageWrapperSmall}>
                                    <Image
                                        src={src}
                                        alt={`answer-img-${index}`}
                                        width={300}
                                        height={0}
                                        style={{ height: "auto" }}
                                        className={styles.image}
                                    />
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => handleChange(rowIndex, -4, index)}
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button
                className={styles.addBtn}
                onClick={() => handleChange(rowIndex, -3, null)}
            >
                + Thêm đáp án
            </button>
        </div>
    );
}
