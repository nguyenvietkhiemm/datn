"use client"
import { ReviewQuestion, UserAnswerMap } from "../../../domain/question-answer/type"
import styles from "./ResultMultiple.module.css"

type ResultMultipleChoiceProp = {
    q: ReviewQuestion,
    userSelectedIds: number[],
    isCorrect: boolean,
    index: number
}
export default function ResultMultipleChoice({ q, userSelectedIds, isCorrect, index }: ResultMultipleChoiceProp) {

    return (
        <div
            key={q.question_id}
            className={`${styles.questionCard} ${userSelectedIds.length === 0
                ? styles.unanswered
                : isCorrect
                    ? styles.correct
                    : styles.wrong
                }`}
        >
            <div className={styles.questionHeader}>
                <span className={styles.questionIndex}>
                    Câu {index + 1}
                </span>
                <span className={styles.questionText}>
                    {q.question_content}
                </span>
            </div>

            {/* Đáp án bạn chọn */}
            <div className={styles.answerRow}>
                <span className={styles.label}>Bạn chọn:</span>
                <span className={styles.value}>
                    {userSelectedIds.length > 0
                        ? q.correct_answers
                            .filter(a => userSelectedIds.includes(a.answer_id))
                            .map(a => a.answer_content)
                            .join(", ")
                        : "Chưa trả lời"}
                </span>
            </div>

            {/* Đáp án đúng */}
            <div className={styles.answerRow}>
                <span className={styles.label}>Đáp án đúng:</span>
                <span className={styles.correctValue}>
                    {q.correct_answers
                        .map(a => a.answer_content)
                        .join(", ")}
                </span>
            </div>

            <div className={styles.resultTag}>
                {userSelectedIds.length === 0
                    ? "Chưa trả lời"
                    : isCorrect
                        ? "✔ Đúng"
                        : "✘ Sai"}
            </div>
        </div>
    );
}
