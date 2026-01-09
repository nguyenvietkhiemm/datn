"use client";

import styles from "./QuestionCreate.module.css";
import type { Question } from "@/domain/admin/questions/type";
import { ChangeValue } from "@/domain/admin/file/file-parser/type";
import { useState } from "react";
import ListImageQuestion from "./ListImageQuestion/ListImageQuestion";
import ImageManagePanel from "./ImagePanelEdit/ImagePanelEdit";
import { LatexPreview } from "./LatexPreview/page";

interface QuestionCardProps {
    question: Omit<Question, "question_id">;
    rowIndex: number;
    editCell: { row: number; col: number } | null;
    setEditCell: (cell: { row: number; col: number } | null) => void;
    handleChange: (
        rowIndex: number,
        type_change: number,
        value: ChangeValue
    ) => void;
    isChanged: (rowIndex: number, colIndex: number) => boolean;
    setSelectedIndexes: React.Dispatch<React.SetStateAction<number[]>>;
    selectedIndexes: number[];
}

type ImagePanelEditState = {
    type_add: 1 | 2 | 0;
    answerIndex: number | null;
};

export default function QuestionCardEditor({
    question,
    rowIndex,
    editCell,
    setEditCell,
    handleChange,
    isChanged,
    setSelectedIndexes,
    selectedIndexes,
}: QuestionCardProps) {
    const currentType = question.type_question ?? 1;
    const [isEditImage, setIsEditImage] = useState<boolean>(false);
    const [imagePanelEdit, setImagePanelEdit] =
        useState<ImagePanelEditState>({
            type_add: 0,
            answerIndex: null,
        });

    const toggleSelectQuestion = (index: number) => {
        setSelectedIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const isEditQuestion = editCell?.row === rowIndex && editCell.col === -1;

    return (
        <div className={styles.questionWrapper}>
            {/* ===== HEADER NGOÀI ===== */}
            <div className={styles.questionHeader}>
                <label className={styles.selectQuestion}>
                    <input
                        type="checkbox"
                        checked={selectedIndexes.includes(rowIndex)}
                        onChange={() => toggleSelectQuestion(rowIndex)}
                    />
                </label>

                <span className={styles.questionIndex}>
                    Câu {rowIndex + 1}
                </span>

                <button
                    className={styles.removeBtn}
                    onClick={() => handleChange(rowIndex, -5, true)}
                >
                    Xoá câu hỏi
                </button>
            </div>

            <div className={styles.container}>
                {/* QUESTION CONTENT */}
                <div className={styles.container_question}>
                    <div>
                        <label className={styles.label}>Nội dung câu hỏi</label>

                        {/* ===== QUESTION VIEW / EDIT ===== */}
                        {isEditQuestion ? (
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
                            <div
                                className={`${styles.text} ${isChanged(rowIndex, -1) ? styles.changed : ""
                                    }`}
                                onClick={() =>
                                    setEditCell({ row: rowIndex, col: -1 })
                                }
                            >
                                <LatexPreview text={question.question_content} />
                            </div>
                        )}

                        {/* QUESTION IMAGES */}
                        <ListImageQuestion
                            rowIndex={rowIndex}
                            imagesQuestion={question.images}
                            handleChange={handleChange}
                        />

                        <div className={styles.action_question}>
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    setIsEditImage(true);
                                    setImagePanelEdit({
                                        type_add: 1,
                                        answerIndex: null,
                                    });
                                }}
                            >
                                + Ảnh
                            </button>
                        </div>
                    </div>
                </div>



                <div className={styles.typeQuestionBox}>
                    <label className={styles.label}>Loại câu hỏi</label>

                    <div className={styles.radioGroup}>
                        <label className={styles.radioItem}>
                            <input
                                type="radio"
                                checked={currentType === 1}
                                onChange={() => handleChange(rowIndex, -2, 1)}
                            />
                            <span>Trắc nghiệm 1 đáp án</span>
                        </label>

                        <label className={styles.radioItem}>
                            <input
                                type="radio"
                                checked={currentType === 2}
                                onChange={() => handleChange(rowIndex, -2, 2)}
                            />
                            <span>Trắc nghiệm nhiều đáp án</span>
                        </label>

                        <label className={styles.radioItem}>
                            <input
                                type="radio"
                                checked={currentType === 3}
                                onChange={() => handleChange(rowIndex, -2, 3)}
                            />
                            <span>Tự luận</span>
                        </label>
                    </div>
                </div>



                {/* ANSWERS */}
                <div className={styles.container_answer}>
                    <label className={styles.label}>Đáp án</label>

                    {question.answers.map((ans, colIndex) => {
                        const isEditAnswer =
                            editCell?.row === rowIndex &&
                            editCell.col === colIndex;

                        return (
                            <div
                                key={colIndex}
                                className={`${styles.answerRow} ${ans.is_correct ? styles.correctAnswer : ""
                                    }`}
                            >
                                <input
                                    type={currentType === 1 ? "radio" : "checkbox"}
                                    name={`correct-${rowIndex}`}
                                    checked={!!ans.is_correct}
                                    onChange={() =>
                                        handleChange(rowIndex, 1000 + colIndex, true)
                                    }
                                />

                                {isEditAnswer ? (
                                    <textarea
                                        className={`${styles.input} ${styles.changed}`}
                                        value={ans.answer_content}
                                        onChange={(e) =>
                                            handleChange(rowIndex, -9, {
                                                answerIndex: colIndex,
                                                value_change: e.target.value,
                                            })
                                        }
                                        onBlur={() => setEditCell(null)}
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        className={`${styles.text} ${isChanged(rowIndex, colIndex)
                                            ? styles.changed
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setEditCell({
                                                row: rowIndex,
                                                col: colIndex,
                                            })
                                        }
                                    >
                                        <LatexPreview text={ans.answer_content} />
                                    </div>
                                )}

                                <ListImageQuestion
                                    rowIndex={rowIndex}
                                    imagesAnswer={ans.images}
                                    answerIndex={colIndex}
                                    handleChange={handleChange}
                                />

                                <button
                                    className={styles.addBtn}
                                    onClick={() => {
                                        setIsEditImage(true);
                                        setImagePanelEdit({
                                            type_add: 2,
                                            answerIndex: colIndex,
                                        });
                                    }}
                                >
                                    + Ảnh
                                </button>

                                <button
                                    className={styles.removeBtn}
                                    onClick={() =>
                                        handleChange(rowIndex, -4, colIndex)
                                    }
                                >
                                    Xóa
                                </button>
                            </div>
                        );
                    })}
                </div>

                {isEditImage && (
                    <ImageManagePanel
                        rowIndex={rowIndex}
                        questionImages={question.images}
                        answers={question.answers}
                        handleChange={handleChange}
                        onClose={() => setIsEditImage(false)}
                        type_add={imagePanelEdit.type_add}
                        answerIndex={imagePanelEdit.answerIndex ?? undefined}
                    />
                )}

                <button
                    className={styles.addBtn}
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => handleChange(rowIndex, -3, null)}
                >
                    + Thêm đáp án
                </button>
            </div>
        </div>

    );
}
