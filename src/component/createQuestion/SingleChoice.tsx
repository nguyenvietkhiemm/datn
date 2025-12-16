import React from "react";
import type { AnswerForm } from "@/domain/admin/questions/type";
import styles from "./SingleChoice.module.css";

type Props = {
  answers: AnswerForm[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerForm[]>>;
};

export default function SingleChoiceAnswers({ answers, setAnswers }: Props) {
  const updateContent = (index: number, value: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], answer_content: value };
      return copy;
    });
  };

  const setCorrect = (index: number) => {
    setAnswers((prev) =>
      prev.map((a, i) => ({
        ...a,
        is_correct: i === index,
      }))
    );
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Đáp án (chọn 1 đáp án đúng)</label>

      {answers.map((answer, index) => (
        <div key={index} className={styles.row}>
          <input
            type="text"
            className={styles.input}
            placeholder={`Đáp án ${index + 1}`}
            value={answer.answer_content}
            onChange={(e) => updateContent(index, e.target.value)}
          />

          <input
            type="radio"
            checked={answer.is_correct}
            onChange={() => setCorrect(index)}
          />
        </div>
      ))}
    </div>
  );
}
