"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./DoBank.module.css";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { BankService } from "../../../../../domain/bank/service";
import { Question } from "../../../../../domain/question-answer/type";
import { BankProps } from "../../../../../domain/bank/type";
import { ImagePreview } from "@/components/ImageReview/page";
import ExamRightPanel from "@/components/do-question/rightPanel";
import QuestionItem from "@/components/do-question/page";

type AnswerMap = Record<number, number[] | string>;

export default function DoBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState<number>(1);
  const [submitted, setSubmitted] = useState(false);
  const [bank, setBank] = useState<BankProps>();
  const [userName, setUserName] = useState<string>("anonymous");
  const params = useParams();
  const bank_id = Number(params.id);
  const router = useRouter();
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [subjectType, setSubJectType] = useState<number | null>(null);

  const STORAGE_KEY = `bank_doing_${bank_id}`;

  /* Lấy câu hỏi từ bank */
  useEffect(() => {
    // user
    const userRaw = localStorage.getItem("user");
    if (userRaw) setUserName(JSON.parse(userRaw).user_name);

    // bank
    const bankRaw = localStorage.getItem("bank");
    if (bankRaw) {
      const b = JSON.parse(bankRaw);
      setBank(b);
      setTimeLeft((b.time_limit ?? 150) * 60);
    }

    BankService.geDetailBank(bank_id).then(res => {
      setQuestions(res.data.question || []);
      setSubJectType(res.data.subject_type ?? null);
    });
    
  }, [bank_id]);

  useEffect(() => {
    if (!bank) return;

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const saved = localStorage.getItem(STORAGE_KEY);

    // 👉 Vào lần đầu
    if (nav.type === "navigate") {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setTimeLeft((bank.time_limit ?? 150) * 60);
      return;
    }

    // 👉 Reload nhưng không có gì để restore
    if (!saved) return;

    const data = JSON.parse(saved);
    setAnswers(data.answers || {});
    setTimeLeft(data.timeLeft ?? (bank.time_limit ?? 150) * 60);
    setUserName(data.userName || "anonymous");
  }, [bank]);

  useEffect(() => {
    if (!bank || submitted) return;

    const data = {
      answers,
      timeLeft,
      userName,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [answers, timeLeft, submitted, bank]);

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

  /* Submit */
  const handleSubmit = async () => {
    const do_bank = Object.entries(answers).map(([q, ans]) => ({
      question_id: Number(q),
      user_answer: Array.isArray(ans) ? ans : [ans],
    }));

    const used_time =
      bank?.time_limit && timeLeft !== null
        ? bank.time_limit * 60 * 1000 - timeLeft * 1000
        : 0;

    const res = await BankService.submitDoBank(
      bank_id,
      subjectType,
      used_time,
      do_bank,
      userName
    );

    const history_bank_id = res.data.history_bank_id;
    setSubmitted(true);
    localStorage.removeItem(STORAGE_KEY);
    router.push(`/practice/${bank_id}/result/${history_bank_id}`);
  };

  /* Countdown */
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

  const scrollToQuestion = (questionId: number) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleEssayChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className={styles.bank_container}>
      <div className={styles.box}>
        <div className={styles.bank_header}>
          <h2>{bank?.description}</h2>
        </div>
        <div className={styles.bank_body}>
          {/* LEFT */}
          <div className={styles.leftPanel}>
            {questions.map((q, i) => (
              <QuestionItem
                key={q.question_id}
                question={q}
                index={i}
                answer={answers[q.question_id]}
                onSelect={handleSelect}
                onEssayChange={handleEssayChange}
                questionRef={(el) => {
                  questionRefs.current[q.question_id] = el;
                }}
              />
            ))}
          </div>

          {/* RIGHT */}
          <ExamRightPanel
            timeLeft={timeLeft}
            questions={questions}
            isAnswered={isAnswered}
            onSubmit={handleSubmit}
            onScrollToQuestion={scrollToQuestion}
          />
        </div>
      </div>
    </div>
  );
}
