"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./DoExam.module.css";
import { ExamService } from "../../../../../domain/exam/service";
import { Question } from "../../../../../domain/question-answer/type";
import ExamRightPanel from "@/components/do-question/rightPanel";
import QuestionItem from "@/components/do-question/page";
import { MyExam } from "../../../../../domain/exam/type";
import { FlatQuestions, TypeQuestion, PART_LABEL, typeNoti } from "../../../../../lib/model";
import NotificationPopup from "@/components/notification/Notification";

type AnswerMap = Record<number, number[] | string>;

export default function DoExam() {
  const params = useParams();
  const router = useRouter();
  const examId = Number(params.id);
  const STORAGE_KEY = `exam_doing_${examId}`;
  const [exam, setExam] = useState<MyExam | null>(null);
  const [questionGroup, setQuestionGroup] = useState<Record<number, Question[]>>({});
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState<string>("anonymous");
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [subjectType, setSubJectType] = useState<number | null>(null);
  const [notify, setNotify] = useState<typeNoti | null>(null);

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
      setQuestionGroup(res.data.question ?? []);
      setSubJectType(res.data.subject_type ?? null);
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

  useEffect(() => {
    if (!exam) return;

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const saved = localStorage.getItem(STORAGE_KEY);

    if (nav.type === "navigate") {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setTimeLeft(exam.time_limit * 60);
      return;
    }

    if (!saved) return;
    const data = JSON.parse(saved);
    setAnswers(data.answers || {});
    setTimeLeft(data.timeLeft ?? exam.time_limit * 60);
    setUserName(data.userName || "anonymous");
  }, [exam]);

  //auto save
  useEffect(() => {
    if (!exam || submitted) return;

    const data = {
      answers,
      timeLeft,
      userName,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [answers, timeLeft, submitted, exam]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted]);

  /* SELECT ANSWER */
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

  /* ESSAY */
  const handleEssayChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  /* SUBMIT */
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
      subjectType,
      used_time,
      payload,
      userName
    );

    setSubmitted(true);
    localStorage.removeItem(STORAGE_KEY);
    router.push(
      `/exam/${exam.exam_id}/result/${res.data.history_exam_id}`
    );
    setNotify({
      message : (
        <>
        <b>Nộp bài thành công</b>
        <br />
        <b>Đây là kết quả của bạn</b>
        </>
      ),
      type: "info",
    })
  };

  const getUnansweredQuestions = () => {
    return flatQuestions.filter(
      (q) => !isAnswered(q.question_id)
    );
  };

  const checkSubmit = () => {
    if (submitted) return;

    if (timeLeft <= 0) {
      setNotify({
        message: "Hết thời gian làm bài. Hệ thống đang nộp bài...",
        type: "info",
        confirm: false
      });
      handleSubmit();
      return;
    }

    //
    const unanswered = getUnansweredQuestions();

    if (unanswered.length > 0) {
      const first = unanswered[0];

      setNotify({
        message: (
          <>
            <b>Bạn còn {unanswered.length} câu chưa trả lời</b>
            <br />
            Bạn có chắc muốn nộp bài không?
          </>
        ),
        type: "warning",
        confirm: true,
        duration: 3000
      });

      scrollToQuestion(first.question_id);
      return;
    }

    setNotify({
      message: "Đang nộp bài...",
      type: "success",
      confirm: false
    });

    handleSubmit();
  };

  /* HELPER: CHECK ANSWERED */
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

  let globalIndex = 0;

  const flatQuestions: Question[] = FlatQuestions(questionGroup)

  /* RENDER */
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
            {TypeQuestion.map((type) => (
              <div key={type}>
                {/* TITLE PHẦN */}
                <h3 className={styles.partTitle}>
                  {PART_LABEL[type]}
                </h3>

                {/* QUESTIONS */}
                {questionGroup[type]?.map((q) => {
                  const index = globalIndex++;

                  return (
                    <QuestionItem
                      key={q.question_id}
                      question={q}
                      index={index}
                      answer={answers[q.question_id]}
                      onSelect={handleSelect}
                      onEssayChange={handleEssayChange}
                      questionRef={(el) => {
                        questionRefs.current[q.question_id] = el;
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <ExamRightPanel
            timeLeft={timeLeft}
            questions={flatQuestions}
            isAnswered={isAnswered}
            onSubmit={checkSubmit}
            onScrollToQuestion={scrollToQuestion}
          />
        </div>
      </div>
      {notify && (
        <NotificationPopup
          message={notify.message}
          type={notify.type}
          confirm={notify.confirm}
          onConfirm={handleSubmit}
          duration={notify.duration}
          onCancel={() => console.log("Huỷ nộp")}
          onClose={() => setNotify(null)}
        />
      )}
    </div>
  );
}
