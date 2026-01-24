"use client";

import styles from "./ResultExam.module.css";
import { ExamService } from "../../../../../../domain/exam/service";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import ResultSummary from "@/components/result-do/ResultSummary";
import ResultPart from "@/components/result-do/ResultPart";
import { ReviewQuestion } from "../../../../../../domain/question-answer/type";
import { LatexPreview } from "@/components/LatexPreview/page";

export default function ResultExam() {
  const [questions, setQuestions] = useState<Record<number, ReviewQuestion[]>>({});
  const [score, setScore] = useState<number | null>(null);

  const params = useParams();
  const exam_id = Number(params.id);
  const history_exam_id = Number(params.history_exam_id);

  useEffect(() => {
    if (!exam_id || !history_exam_id) return;

    const loadUserAnswer = async () => {
      const result = await ExamService.getUserAnswer(
        history_exam_id,
        exam_id
      );

      setQuestions(result?.data?.questions ?? {});
      setScore(
        result?.data?.score !== null
          ? Number(result.data.score)
          : null
      );
    };

    loadUserAnswer();
  }, [exam_id, history_exam_id]);

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
