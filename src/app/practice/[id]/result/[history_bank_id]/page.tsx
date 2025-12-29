"use client";

import styles from "./ResultBank.module.css";
import { BankService } from "../../../../../../domain/bank/service";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import ResultSummary from "@/components/result-do/ResultSummary";
import ResultPart from "@/components/result-do/ResultPart";
import { ReviewQuestion } from "../../../../../../domain/question-answer/type";

export default function ResultBank() {
    const [questions, setQuestions] = useState<Record<number, ReviewQuestion[]>>(
        {}
    );
    const [score, setScore] = useState<number | null>(null);

    const params = useParams();
    const bank_id = Number(params.id);
    const history_bank_id = Number(params.history_bank_id);

    useEffect(() => {
        if (!bank_id || !history_bank_id) return;

        const loadUserAnswer = async () => {
            const result = await BankService.getUserAnswer(
                history_bank_id,
                bank_id
            );

            setQuestions(result?.data?.questions ?? {});
            setScore(
                result?.data?.score !== null
                    ? Number(result.data.score)
                    : null
            );
        };

        loadUserAnswer();
        loadUserAnswer();
    }, [bank_id, history_bank_id]);

    const stats = useMemo(() => {
        let correct = 0;
        let wrong = 0;
        let skip = 0;

        Object.values(questions).flat().forEach(q => {
            const userIds = q.user_answers?.map(a => a.answer_id) ?? [];
            const correctIds = q.correct_answers?.map(a => a.answer_id) ?? [];

            if (userIds.length === 0) {
                skip++;
            } else if (
                correctIds.length > 0 &&
                correctIds.every(id => userIds.includes(id)) &&
                userIds.every(id => correctIds.includes(id))
            ) {
                correct++;
            } else {
                wrong++;
            }
        });

        return { correct, wrong, skip };
    }, [questions]);

    return (
        <div className={styles.result}>
            <h3 className={styles.title}>Kết quả bài thi</h3>

            <ResultSummary
                correct={stats.correct}
                wrong={stats.wrong}
                skip={stats.skip}
                score={score}
            />

            {([1, 2, 3] as const).map(type => (
                <ResultPart
                    key={type}
                    type={type}
                    questions={questions[type]}
                />
            ))}
        </div>
    );
}
