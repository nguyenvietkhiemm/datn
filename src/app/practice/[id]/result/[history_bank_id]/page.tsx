"use client";

import styles from "./ResultBank.module.css";
import { Button } from "@/components/ui/button";
import { BankService } from "../../../../../../domain/bank/service";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ReviewQuestion, UserAnswerMap } from "../../../../../../domain/question-answer/type";
import ResultMultipleChoice from "@/components/result-multiple-choice/page";
import ResultEssay from "@/components/result-essay/page";

export default function ResultBxam() {
    const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswerMap>({});
    const [score, setScore] = useState<number | null>(null);

    const params = useParams();
    const bank_id = Number(params.id);
    const history_bank_id = Number(params.history_bank_id);

    useEffect(() => {
        if (!bank_id || !history_bank_id) return;

        // Load đáp án user
        const loadUserAnswer = async () => {
            const result = await BankService.getUserAnswer(history_bank_id, bank_id);

            setQuestions(result.data.answer_correct)
            if (Array.isArray(result.data.user_answer)) {
                const map: UserAnswerMap = {};
                result.data.user_answer.forEach((item: any) => {
                    map[item.question_id] = {
                        answer_id: item.answer_id || [],
                        user_answer_text: item.user_answer_text
                    };
                });
                setUserAnswers(map);
            }
            setScore(Number(result.data.score));

        };
        loadUserAnswer();
    }, [bank_id, history_bank_id]);

    return (
        <div className={styles.result}>
            <h3 className={styles.title}>📄 Kết quả bài thi</h3>

            <div className={styles.scoreBox}>
                <span>Điểm của bạn</span>
                <b>{score}</b>
            </div>

            <div className={styles.questionList}>
                {questions.map((q, index) => {

                    /* ================= TRẮC NGHIỆM ================= */
                    if (q.type_question !== 3) {
                        const userData = userAnswers[q.question_id];
                        const userSelectedIds = userData?.answer_id || [];

                        const correctAnswerIds =
                            q.correct_answers.map(a => a.answer_id);

                        const isCorrect = correctAnswerIds.every(id => userSelectedIds.includes(id));

                        return (
                            <ResultMultipleChoice
                                key={index}
                                q={q}
                                userSelectedIds={userSelectedIds}
                                isCorrect={isCorrect}
                                index={index}
                            />
                        );
                    }

                    /* ================= TỰ LUẬN ================= */
                    const userData = userAnswers[q.question_id];
                    const userText = userData?.user_answer_text;

                    return (
                        <ResultEssay q={q} index={index} userText={userText} />
                    )
                })}
            </div>
        </div>
    );
}
