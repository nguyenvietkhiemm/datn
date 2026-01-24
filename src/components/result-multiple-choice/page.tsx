"use client";

import { ReviewQuestion } from "../../../domain/question-answer/type";
import styles from "./ResultMultiple.module.css";
import { ImagePreview } from "../ImageReview/page";
import { LatexPreview } from "../LatexPreview/page";

type ResultMultipleChoiceProp = {
  q: ReviewQuestion;
  index: number;
};

export default function ResultMultipleChoice({
  q,
  index
}: ResultMultipleChoiceProp) {

  const userAnswerIds = q.user_answers?.map(a => a.answer_id) ?? [];
  const correctAnswerIds = q.correct_answers?.map(a => a.answer_id) ?? [];

  const isAnswered = userAnswerIds.length > 0;

  const isCorrect =
    isAnswered &&
    correctAnswerIds.length > 0 &&
    correctAnswerIds.every(id => userAnswerIds.includes(id)) &&
    userAnswerIds.every(id => correctAnswerIds.includes(id));

  return (
    <div
      className={`${styles.questionCard} ${
        !isAnswered
          ? styles.unanswered
          : isCorrect
          ? styles.correct
          : styles.wrong
      }`}
    >
      <div className={styles.questionHeader}>
        <span className={styles.questionIndex}>Câu {index + 1}</span>
        <span className={styles.questionText}>
        <LatexPreview text={q.question_content} />
        </span>

        {q.images?.map((src, idx) => (
          <div key={`q-img-${idx}`} className={styles.imageWrapperSmall}>
            <ImagePreview filename={src} />
          </div>
        ))}
      </div>

      {/* ================= BẠN CHỌN ================= */}
      <div className={styles.answerRow}>
        <span className={styles.label}>Bạn chọn:</span>
        <span className={styles.value}>
          {isAnswered ? (
            q.user_answers.map((a, idx) => (
              <div key={`user-${idx}`}>
                <LatexPreview text={a.answer_content as string} />
              </div>
            ))
          ) : (
            "Chưa trả lời"
          )}
        </span>
      </div>

      {/* ================= ĐÁP ÁN ĐÚNG ================= */}
      <div className={styles.answerRow}>
        <span className={styles.label}>Đáp án đúng:</span>
        <div className={styles.answerlist}>
          {q.correct_answers.map((a, idx) => (
            <div key={`correct-${idx}`}>
              <div className={styles.answer_content_correct}>
                <LatexPreview text={a.answer_content as string} />
              </div>

              {a.images?.map((src, imgIdx) => (
                <div
                  key={`correct-img-${imgIdx}`}
                  className={styles.imageWrapperSmall}
                >
                  <ImagePreview filename={src} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
