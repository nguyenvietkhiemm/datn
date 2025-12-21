"use client"
import { ReviewQuestion, UserAnswerMap } from "../../../domain/question-answer/type"
import styles from "./ResultMultiple.module.css"
import { ImagePreview } from "../ImageReview/page"

type ResultMultipleChoiceProp = {
    q: ReviewQuestion,
    userSelectedIds: number[],
    isCorrect: boolean,
    index: number
}
export default function ResultMultipleChoice({ q, userSelectedIds, isCorrect, index }: ResultMultipleChoiceProp) {

    return (
        <div
            key={index}
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
                {q.images?.map((src, index) => (
                    <div key={`a-${index}`} className={styles.imageWrapperSmall}>
                        <ImagePreview filename={src} />
                    </div>
                ))}
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
                {/* <span className={styles.correctValue}>
                    {q.correct_answers
                        .map(a => a.answer_content)
                        .join(", ")}
                </span> */}
                {q.correct_answers?.map((a, i) => (
                    <div key={`correct-${i}`}>
                        <p>{a.answer_content}</p>

                        {a.images?.map((src, idx) => (
                            <div key={`img-${idx}`} className={styles.imageWrapperSmall}>
                                <ImagePreview filename={src} />
                            </div>
                        ))}
                    </div>
                ))}
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
