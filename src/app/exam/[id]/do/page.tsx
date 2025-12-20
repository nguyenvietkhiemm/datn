"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./DoExam.module.css";
import { Button } from "@/components/ui/button";
import { ExamService } from "../../../../../domain/exam/service";
import { formatTime } from "../../../../../lib/model";
import { Question } from "../../../../../domain/question-answer/type";
import { ImagePreview } from "@/components/ImageReview/page";

type AnswerMap = Record<number, number[] | string>;

export default function DoExam() {
  const params = useParams();
  const router = useRouter();
  const examId = Number(params.id);

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState<string>("anonymous");
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    // user
    const userRaw = localStorage.getItem("user");
    if (userRaw) setUserName(JSON.parse(userRaw).user_name);

    // exam
    const examRaw = localStorage.getItem("exam");
    if (examRaw) {
      const exam = JSON.parse(examRaw);
      setExam(exam);
      setTimeLeft(exam.time_limit * 60);
    }

    // questions
    ExamService.getExamDetail(examId).then(res => {
      setQuestions(res.data ?? []);
    });
  }, [examId]);

  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  /* ================= SELECT ANSWER ================= */
  const handleSelect = (
    questionId: number,
    answerId: number,
    type: number
  ) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId])
        ? (prev[questionId] as number[])
        : [];

      // 1 đáp án
      if (type === 1) {
        return { ...prev, [questionId]: [answerId] };
      }

      // nhiều đáp án
      if (type === 2) {
        return {
          ...prev,
          [questionId]: current.includes(answerId)
            ? current.filter(id => id !== answerId)
            : [...current, answerId],
        };
      }

      return prev;
    });
  };

  /* ================= ESSAY ================= */
  const handleEssayChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!exam || submitted) return;

    const payload = Object.entries(answers).map(([qid, ans]) => ({
      question_id: Number(qid),
      user_answer: Array.isArray(ans) ? ans : [ans],
    }));

    const used_time =
      (exam.time_limit * 60 - timeLeft) * 1000;

    const res = await ExamService.submit(
      exam.exam_id,
      exam.subject_type,
      used_time,
      payload,
      userName
    );

    setSubmitted(true);
    router.push(
      `/exam/${exam.exam_id}/result/${res.data.history_exam_id}`
    );
  };

  /* ================= HELPER: CHECK ANSWERED ================= */
  const isAnswered = (questionId: number) => {
    const value = answers[questionId];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return false;
  };

  const scrollToQuestion = (questionId: number) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.exam_container}>
      <div className={styles.box}>
        {/* HEADER */}
        <div className={styles.exam_header}>
          <h2>{exam?.exam_name}</h2>
        </div>

        <div className={styles.exam_body}>
          {/* LEFT */}
          <div className={styles.leftPanel}>
            {questions.map((q, i) => (
              <div key={q.question_id} className={styles.questionBox} ref={(el) => {
                questionRefs.current[q.question_id] = el;
              }}
              >
                <p className={styles.questionText}>
                  <strong>{i + 1}.</strong> {q.question_content}
                  <div key={`q-${i}`} className={styles.imageWrapperSmall}>
                    {q.images?.map((src, index) => (
                      <div key={`q-${index}`} className={styles.imageWrapperSmall}>
                        <ImagePreview filename={src} />
                      </div>
                    ))}
                  </div>
                </p>

                <div className={styles.answers}>
                  {/* TRẮC NGHIỆM */}
                  {q.type_question !== 3 &&
                    q.answers.map((a) => (
                      <label key={a.answer_id} className={styles.option}>
                        <input
                          type={q.type_question === 2 ? "checkbox" : "radio"}
                          name={`q-${q.question_id}`}
                          checked={
                            Array.isArray(answers[q.question_id]) &&
                            (answers[q.question_id] as number[]).includes(a.answer_id)
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
                        {a.images?.map((src, index) => (
                          <div key={`a-${index}`} className={styles.imageWrapperSmall}>
                            <ImagePreview filename={src} />
                          </div>
                        ))}
                      </label>
                    ))}

                  {/* TỰ LUẬN */}
                  {q.type_question === 3 && (
                    <textarea
                      className={styles.essay}
                      placeholder="Nhập câu trả lời của bạn..."
                      value={
                        typeof answers[q.question_id] === "string"
                          ? answers[q.question_id] as string
                          : ""
                      }
                      onChange={(e) =>
                        handleEssayChange(q.question_id, e.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className={styles.rightPanel}>
            <div className={styles.timer}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <Button onClick={handleSubmit}>Nộp bài</Button>

            <div className={styles.grid}>
              {questions.map((q, i) => (
                <button
                  key={q.question_id}
                  onClick={() => scrollToQuestion(q.question_id)}
                  className={`${styles.numButton} ${isAnswered(q.question_id) ? styles.answered : ""
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
