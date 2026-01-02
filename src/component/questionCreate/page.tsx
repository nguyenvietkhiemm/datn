"use client";

import styles from "./QuestionCreate.module.css";
import type { Question } from "@/domain/admin/questions/type";
import { ChangeValue, JsonQuestion } from "@/domain/admin/file/file-parser/type";
import { useState } from "react";
import ListImageQuestion from "./ListImageQuestion/ListImageQuestion";
import ImageManagePanel from "./ImagePanelEdit/ImagePanelEdit";
import NotificationPopup from "../notification/Notification";
import { typeNoti } from "@/lib/model";

interface QuestionCardProps {
    question: Omit<Question, "question_id">;
    rowIndex: number;
    editCell: { row: number; col: number } | null;
    setEditCell: (cell: { row: number; col: number } | null) => void;
    handleChange: (rowIndex: number, type_change: number, value: ChangeValue) => void;
    isChanged: (rowIndex: number, colIndex: number) => boolean;
    setSelectedIndexes: React.Dispatch<React.SetStateAction<number[]>>
    selectedIndexes: number[]
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
    selectedIndexes
}: QuestionCardProps) {

    const currentType = question.type_question ?? 1;
    const [isEditImage, setIsEditImage] = useState<boolean>(false);
    const [imagePanelEdit, setImagePanelEdit] =
        useState<ImagePanelEditState>({
            type_add: 0,
            answerIndex: null,
        });

    const toggleSelectQuestion = (index: number) => {
        setSelectedIndexes(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className={styles.container}>
            {/* QUESTION CONTENT */}
            <div className={styles.container_question}>
                <div>
                    <div className={styles.action_question}>
                        <button
                            className={styles.removeBtn}
                            onClick={() => handleChange(rowIndex, -5, true)}
                        >
                            Xoá câu hỏi
                        </button>

                        <label className={styles.selectQuestion}>
                            <input
                                type="checkbox"
                                checked={selectedIndexes.includes(rowIndex)}
                                onChange={() => toggleSelectQuestion(rowIndex)}
                            />
                        </label>
                    </div>
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
            </div>



            {/* ANSWERS */}
            <div className={styles.container_answer}>
                <label className={styles.label}>Đáp án</label>
                {question.answers.map((ans, colIndex) => (
                    <div key={colIndex} 
                    className={`${styles.answerRow} ${ans.is_correct ? styles.correctBorder : ''}`}
                    >
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
                            <textarea
                                className={`${styles.input} ${styles.changed}`}
                                value={ans.answer_content}
                                onChange={(e) =>
                                    handleChange(rowIndex, -9, {
                                        answerIndex: colIndex,
                                        value_change: e.target.value
                                    })
                                }
                                onBlur={() => setEditCell(null)}
                                autoFocus
                            />
                        ) : (
                            <p
                                className={`${styles.text} ${isChanged(rowIndex, colIndex) ? styles.changed : ""
                                    }`}
                                onClick={() => setEditCell({ row: rowIndex, col: colIndex })}
                            >
                                {ans.answer_content}
                            </p>
                        )}
                        {ans.is_correct && (
                            <p className={styles.correct}>✔</p>
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
                            onClick={() => handleChange(rowIndex, -4, colIndex)}
                        >
                            x
                        </button>
                    </div>
                ))}
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
    );
}
