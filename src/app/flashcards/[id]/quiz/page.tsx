"use client";

import { useEffect, useState } from "react";
import styles from "./FlashcardQuiz.module.css";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

interface Flashcard {
  flashcard_id: number;
  front: string;
  back: string;
}

export default function FlashcardQuiz() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [optionsList, setOptionsList] = useState<string[][]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      const URL_API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

      const res = await fetch(`${URL_API}/flashcards/review/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      const list: Flashcard[] = json.data || [];

      setFlashcards(list);
      setAnswers(Array(list.length).fill(null));

      // Tạo 4 đáp án cho từng câu
      const opts = list.map((__, idx) => generateOptions(list, idx));
      setOptionsList(opts);
    };

    fetchData();
  }, [id]);

  const generateOptions = (list: Flashcard[], index: number): string[] => {
    const correct = list[index].back;
    const wrongs = list
      .filter((_, i) => i !== index)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(item => item.back);

    return [...wrongs, correct].sort(() => Math.random() - 0.5);
  };

  const handleSelect = (index: number, choice: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = choice;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    let correct = 0;
    const answerCorrect: number[] = [];
    const answerMiss: number[] = [];
    flashcards.forEach((card, index) => {
      if (answers[index] === card.back) {
        correct++;
        answerCorrect.push(card.flashcard_id)
      }
    });
    setScore(correct);
    setSubmitted(true);
    try {
      const token = Cookies.get("token");
      const URL_API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

      const res = await fetch(`${URL_API}/flashcards/quiz/submit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answerCorrect,
          answerMiss
        }),
      });

      const data = await res.json();
    } catch (error) {
      console.error("Lỗi khi gửi kết quả lên backend:", error);
    }
  };

  if (flashcards.length === 0) return <p>Đang tải câu hỏi...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Luyện tập Flashcard ({flashcards.length} câu)</h2>

      {flashcards.map((card, index) => (
        <div key={index} className={styles.card}>
          <p className={styles.question}>
            <strong>{index + 1}. </strong>{card.front}
          </p>

          <div className={styles.options}>
            {optionsList[index]?.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(index, opt)}
                className={`${styles.option}
                ${!submitted && answers[index] === opt ? styles.selected : ""}
                ${submitted && answers[index] === opt && opt === card.back ? styles.correct : ""}
                ${submitted && answers[index] === opt && opt !== card.back ? styles.wrong : ""}
                  `}
                disabled={submitted}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Khi nộp bài hoặc chọn “Bạn không biết” thì hiện đáp án */}
          {(submitted) && (
            <p className={styles.correctAnswer}>
              Đáp án đúng: <strong>{card.back}</strong>
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Nộp bài
        </button>
      ) : (
        <div className={styles.result}>
          🎯 Bạn đúng {score}/{flashcards.length} câu
        </div>
      )}
    </div>
  );
}
