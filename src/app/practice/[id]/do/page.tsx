"use client";

import React, { useState, useEffect } from "react";
import styles from "./DoBank.module.css";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { BankService } from "../../../../../domain/bank/service";
import { Question } from "../../../../../domain/question-answer/type";
import { BankProps } from "../../../../../domain/bank/type";

export default function DoBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [bank, setBank] = useState<BankProps>();
  const [userName, setUserName] = useState<string>("anonymous");
  const params = useParams();
  const bank_id = Number(params.id);
  const router = useRouter();

  /* Lấy câu hỏi từ bank */
  useEffect(() => {

    // user
    const userRaw = localStorage.getItem("user");
    if (userRaw) setUserName(JSON.parse(userRaw).user_name);

    // exam
    const bankRaw = localStorage.getItem("bank");
    if (bankRaw) {
      const bank = JSON.parse(bankRaw);
      setBank(bank);
      setTimeLeft(bank.time_limit * 60);
    }
    const loadBankDetail = async () => {
      const res = await BankService.geDetailBank(bank_id);
      setQuestions(res.data || []);
    };

    loadBankDetail();
  }, [bank_id]);

  /* Submit */
  const handleSubmit = async () => {
    const do_bank = Object.entries(answers).map(([q, a]) => ({
      question_id: Number(q),
      user_answer: [a],
    }));

    const used_time =
      bank?.time_limit && timeLeft !== null
        ? bank.time_limit * 60 * 1000 - timeLeft * 1000
        : 0;

    const res = await BankService.submitDoBank(
      bank_id,
      Number(bank!.subject_type),
      used_time,
      do_bank,
      userName
    );

    const history_bank_id = res.data.history_bank_id;
    setSubmitted(true);
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

  const handleSelect = (qid: number, aid: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: aid }));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
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
            <div>
              {questions.length > 0 ? (
                questions.map((q, i) => (
                  <div key={q.question_id} className={styles.questionBox}>
                    <p className={styles.questionText}>
                      <strong>Câu {i + 1}.</strong> {q.question_content}
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
                ⏱ {formatTime(timeLeft)}
              </div>

              <Button variant="outline" onClick={handleSubmit}>
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
