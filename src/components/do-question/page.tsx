"use client";
import { Question } from "../../../domain/question-answer/type";
import styles from "./DoQuestion.module.css";
import { ImagePreview } from "@/components/ImageReview/page";
import { LatexPreview } from "../LatexPreview/page";

type Props = {
  question: Question;
  index: number;
  answer: number[] | string | undefined;
  onSelect: (questionId: number, answerId: number, type: number) => void;
  onEssayChange: (questionId: number, value: string) => void;
  questionRef?: (el: HTMLDivElement | null) => void;
};

export default function QuestionItem({
  question,
  index,
  answer,
  onSelect,
  onEssayChange,
  questionRef,
}: Props) {
  return (
    <div
      className={styles.questionBox}
      ref={questionRef}
    >
      <div className={styles.questionText}>
        <strong>{index + 1}.</strong>
        <LatexPreview text={question.question_content} />
      </div>

      {/* images của question */}
      <div className={styles.imageWrapperSmall}>
        {question.images?.map((src, i) => (
          <ImagePreview key={i} filename={src} width={200} />
        ))}
      </div>

      <div className={styles.answers}>
        {/* TRẮC NGHIỆM */}
        {question.type_question !== 3 &&
          question.answers.map((a) => (
            <label key={a.answer_id} className={styles.option}>
              <input
                type={question.type_question === 2 ? "checkbox" : "radio"}
                name={`q-${question.question_id}`}
                checked={
                  Array.isArray(answer) && answer.includes(a.answer_id)
                }
                onChange={() =>
                  onSelect(
                    question.question_id,
                    a.answer_id,
                    question.type_question
                  )
                }
              />
              <LatexPreview text={a.answer_content} />

              {a.images?.map((src, i) => (
                <div key={i} className={styles.imageWrapperSmall}>
                  <ImagePreview filename={src} />
                </div>
              ))}
            </label>
          ))}

        {/* TỰ LUẬN */}
        {question.type_question === 3 && (
          <textarea
            className={styles.essay}
            placeholder="Nhập câu trả lời của bạn..."
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) =>
              onEssayChange(question.question_id, e.target.value)
            }
          />
        )}
      </div>
    </div>
  );
}
