"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./DoExam.module.css";
import { Button } from "@/components/ui/button";
import { ExamService } from "../../../../../domain/exam/service";
import { formatTime } from "../../../../../lib/model";

type AnswerMap = Record<number, number[]>;

export default function DoExam() {
  const params = useParams();
  const router = useRouter();
  const examId = Number(params.id);

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const user_name =
  localStorage.getItem("user_name") || "anonymous";

  /* ===== LOAD EXAM ===== */
  useEffect(() => {
    if (!examId || isNaN(examId)) {
      router.push("/404");
      return;
    }

    const fetchExam = async () => {
      const res = await ExamService.getExamDetail(examId);
      setExam(res.exam);
      setQuestions(res.questions);
      setTimeLeft(res.exam.time_limit * 60);
    };

    fetchExam();
  }, [examId]);

  /* ===== COUNTDOWN ===== */
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  /* ===== SELECT ANSWER ===== */
  const handleSelect = (
    questionId: number,
    answerId: number,
    type: number
  ) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];

      // 1 đáp án
      if (type === 1) {
        return { ...prev, [questionId]: [answerId] };
      }

      // nhiều đáp án
      if (type === 2) {
        return {
          ...prev,
          [questionId]: current.includes(answerId)
            ? current.filter((id) => id !== answerId)
            : [...current, answerId],
        };
      }

      return prev;
    });
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    if (!exam) return;

    const payload = Object.entries(answers).map(([qid, ans]) => ({
      question_id: Number(qid),
      user_answer: ans,
    }));

    const used_time =
      (exam.time_limit * 60 - timeLeft) * 1000;

    const res = await ExamService.submit(
      exam.exam_id,
      exam.subject_type,
      used_time,
      payload,
      user_name
    );

    setSubmitted(true);
    router.push(`/exam/${exam.exam_id}/result/${res.data.history_exam_id}`);
  };

  /* ===== RENDER ===== */
  return (
    <div className={styles.exam_container}>
      <div className={styles.box}>
        <div className={styles.exam_header}>
          <h2>{exam?.exam_name}</h2>
          <div className={styles.timer}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        <div className={styles.exam_body}>
          <div className={styles.leftPanel}>
            {questions.map((q, i) => (
              <div key={q.question_id} className={styles.questionBox}>
                <p className={styles.questionText}>
                  <strong>{i + 1}.</strong> {q.question_content}
                </p>

                <div className={styles.answers}>
                  {q.answers.map((a: any) => (
                    <label key={a.answer_id} className={styles.option}>
                      <input
                        type={q.type_question === 2 ? "checkbox" : "radio"}
                        name={`q-${q.question_id}`}
                        checked={
                          answers[q.question_id]?.includes(a.answer_id) || false
                        }
                        onChange={() =>
                          handleSelect(
                            q.question_id,
                            a.answer_id,
                            q.type_question
                          )
                        }
                      />
                      <span>{a.answer_content}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.rightPanel}>
            <Button onClick={handleSubmit}>Nộp bài</Button>

            <div className={styles.grid}>
              {questions.map((q, i) => (
                <button
                  key={q.question_id}
                  className={`${styles.numButton} ${answers[q.question_id]?.length ? styles.answered : ""
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
