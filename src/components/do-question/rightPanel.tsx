"use client";
import styles from "./RightPanel.module.css";
import { Button } from "@/components/ui/button";
import { formatTime } from "../../../lib/model";
import { Question } from "../../../domain/question-answer/type";

type Props = {
    timeLeft: number;
    questions: Question[];
    isAnswered: (questionId: number) => boolean;
    onSubmit: () => void;
    onScrollToQuestion: (questionId: number) => void;
};

export default function ExamRightPanel({
    timeLeft,
    questions,
    isAnswered,
    onSubmit,
    onScrollToQuestion,
}: Props) {
    return (
        <div className={styles.rightPanel}>
            <div className={styles.timer}>
                ⏱ {formatTime(timeLeft)}
            </div>

            <Button onClick={onSubmit}>Nộp bài</Button>

            <div className={styles.grid}>
                {questions.map((q, i) => (
                    <button
                        key={q.question_id}
                        onClick={() => onScrollToQuestion(q.question_id)}
                        className={`${styles.numButton} ${isAnswered(q.question_id) ? styles.answered : ""
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
