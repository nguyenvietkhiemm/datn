"use client";
import React, { useState, useEffect } from "react";
import styles from "./DoExam.module.css";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ExamService } from "../../../../../domain/exam/service";
import { Question } from "../../../../../domain/question-answer/type";
import { Exam } from "../../../../../domain/exam/type"

export default function DoExam() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [exam, setExam] = useState<Exam>();
  const user_name = localStorage.getItem("user_name") || "null";
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  // Lấy dữ liệu đề thi + câu hỏi
  useEffect(() => {
    const loadExamDetail = async () => {
      const result = await ExamService.getExamDetail(id);
      if (Array.isArray(result.data)) {
        setQuestions(result.data);
      } else {
        setQuestions([]);
      }
    };

    loadExamDetail();

    const storedExam = localStorage.getItem("exam");
    if (storedExam) {
      const examData = JSON.parse(storedExam);
      setExam(examData);

      //KHỞI TẠO THỜI GIAN LÀM BÀI
      if (examData.time_limit) {
        setTimeLeft(examData.time_limit * 60);
      }
    }
  }, [id]);

  // Submit bài thi qua Service
  const handleSubmitExam = async () => {
    const do_exam = Object.entries(answers).map(([q, a]) => ({
      question_id: Number(q),
      user_answer: [a],
    }));

    const used_time = exam?.time_limit
      ? exam.time_limit * 60 * 1000 - timeLeft! * 1000
      : timeLeft! * 1000;

    const result = await ExamService.submit(id, Number(exam!.subject_type), used_time, do_exam, user_name);
    const history_exam_id = result?.data?.history_exam_id
    setSubmitted(true);
    router.push(`/exam/${exam?.exam_id}/result/${history_exam_id}`)
  };

  // Countdown
  useEffect(() => {
    if (submitted) return;

    // Chưa khởi tạo timeLeft
    if (timeLeft === null) return;

    // Khi hết giờ
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t! - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);


  // Chọn đáp án
  const handleSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.exam_container}>
      <div className={styles.box}>
        <div className={styles.exam_header}>
          <h2>{exam?.exam_name}</h2>
        </div>
          <div className={styles.exam_body}>
            {/* LEFT */}
            <div className={styles.leftPanel}>
              <div>
                {questions.length > 0 ? (
                  questions.map((q, i) => (
                    <div key={q.question_id} className={styles.questionBox}>
                      <p className={styles.questionText}>
                        <strong>{i + 1}.</strong> {q.question_content}
                      </p>
                      <div className={styles.answers}>
                        {q.answers.map((a) => (
                          <label
                            key={a.answer_id}
                            className={styles.option}
                          >
                            <input
                              type="radio"
                              name={`q-${q.question_id}`}
                              value={a.answer_id}
                              checked={answers[q.question_id] === a.answer_id}
                              onChange={() =>
                                handleSelect(q.question_id, a.answer_id)
                              }
                            />
                            {a.answer_content}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>Không có câu hỏi nào</>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.rightPanel}>
              <div className={styles.topSection}>
                <div className={styles.timer}>
                  ⏱ {timeLeft !== null ? formatTime(timeLeft) : "Đang tải..."}
                </div>

                <Button variant="outline" onClick={handleSubmitExam}>
                  Nộp bài
                </Button>
              </div>

              <div className={styles.grid}>
                {questions.map((q, i) => (
                  <button
                    key={q.question_id}
                    className={`${styles.numButton} ${answers[q.question_id] ? styles.answered : ""
                      }`}
                    onClick={() =>
                      document
                        .getElementById(`q-${q.question_id}`)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
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
