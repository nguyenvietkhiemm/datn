"use client";
import styles from "./ResultEssay.module.css";
import { ReviewQuestion } from "../../../domain/question-answer/type";
import { ImagePreview } from "../ImageReview/page";

type ResultEssayProp = {
    q: ReviewQuestion;
    userText: string | null;
    index: number;
};

export default function ResultEssay({
    q,
    userText,
    index,
}: ResultEssayProp) {
    const correctText = q.correct_answers[0]?.answer_content ?? "";

    const isCorrect =
        userText &&
        userText.trim().toLowerCase() ===
        correctText.trim().toLowerCase();

    return (
        <div
        key={index}
            className={`${styles.questionCard} ${!userText
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

            {/* ===== BÀI LÀM CỦA BẠN ===== */}
            <div className={styles.answerRow}>
                <span className={styles.label}>Bạn trả lời:</span>
                <span className={styles.value}>
                    {userText ? userText : "Chưa trả lời"}
                </span>
            </div>

            {/* ===== ĐÁP ÁN ĐÚNG ===== */}
            <div className={styles.answerRow}>
                <span className={styles.label}>Đáp án đúng:</span>
                {q.correct_answers?.map((a, i) => (
                    <div key={`correct-${i}`} className={styles.correctValue}>
                        <p className={styles.answer_content_correct}>{a.answer_content}</p>

                        {a.images?.map((src, idx) => (
                            <div key={`img-${idx}`} className={styles.imageWrapperSmall}>
                                <ImagePreview filename={src} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
