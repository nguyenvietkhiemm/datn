import React from "react";
import type { AnswerForm } from "@/domain/admin/questions/type";
import styles from "./SingleChoice.module.css";

type Props = {
  answers: AnswerForm[];
  answerImages: (File | string)[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerForm[]>>;
  setAnswerImages: React.Dispatch<React.SetStateAction<File[] | string[]>>
};

export default function SingleChoiceAnswers({ answers,
  setAnswers,
  answerImages,
  setAnswerImages
}: Props) {
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
      <label className={styles.label}>
        Đáp án (chọn 1 đáp án đúng)
      </label>

      {answers.map((answer, index) => (
        <div key={index} className={styles.answerBlock}>
          {/* Nội dung + chọn đúng */}
          <div className={styles.row}>
            <input
              type="text"
              className={styles.input}
              placeholder={`Đáp án ${index + 1}`}
              value={answer.answer_content}
              onChange={(e) =>
                updateContent(index, e.target.value)
              }
            />

            <input
              type="radio"
              name="correctAnswer"
              checked={answer.is_correct}
              onChange={() => setCorrect(index)}
            />
          </div>

          {/* Ảnh đáp án */}
          <div className={styles.uploadImages}>
            <label className={styles.subLabel}>
              Hình ảnh đáp án
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                setAnswerImages(
                  Array.from(e.target.files)
                );
              }}
            />
          </div>

          <div className={styles.previewWrap}>
            {answerImages.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img as Blob)}
                className={styles.preview}
                alt="preview"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
