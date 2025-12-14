import styles from "./ResultEssay.module.css"
import { ReviewQuestion } from "../../../domain/question-answer/type";

interface ResultEssayProp {
    q: ReviewQuestion,
    index: number,
    userText: string | null
}
export default function ResultEssay({ q, index, userText }: ResultEssayProp) {

    return (
        <div
            key={q.question_id}
            className={`${styles.questionCard} ${styles.essay}`}
        >
            <div className={styles.questionHeader}>
                <span className={styles.questionIndex}>
                    Câu {index + 1}
                </span>
                <span className={styles.questionText}>
                    {q.question_content}
                </span>
            </div>

            <div className={styles.answerRow}>
                <span className={styles.label}>Bài làm của bạn:</span>
                <span className={styles.value}>
                    {userText ?? "Chưa trả lời"}
                </span>
            </div>

            <div className={styles.resultTagEssay}>
                ✍️ Câu tự luận (chờ chấm)
            </div>
        </div>
    );
}