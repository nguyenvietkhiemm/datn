"use client";

import styles from "./ListImageQuestion.module.css";
import { ChangeValue } from "@/domain/admin/file/file-parser/type";
import { FileParserService } from "@/domain/admin/file/file-parser/service";

type ListImageQuestionProps = {
  rowIndex: number;

  imagesQuestion?: string[];
  imagesAnswer?: string[];

  answerIndex?: number;

  handleChange: (
    rowIndex: number,
    type_change: number,
    value: ChangeValue
  ) => void;
};

export default function ListImageQuestion({
  rowIndex,
  imagesQuestion = [],
  imagesAnswer = [],
  answerIndex,
  handleChange,
}: ListImageQuestionProps) {
  if (
    imagesQuestion.length === 0 &&
    imagesAnswer.length === 0
  ) {
    return null;
  }

  return (
    <div className={styles.previewWrap}>
      {/* ===== QUESTION IMAGES ===== */}
      {imagesQuestion.map((filename, index) => (
        <div key={`q-${index}`} className={styles.imageWrapperSmall}>
          <img
            src={FileParserService.getImageUrl(filename)}
            alt={`question-img-${index}`}
            style={{ width: 300, height: "auto" }}
            className={styles.image}
            loading="lazy"
          />
          <button
            className={styles.removeBtn}
            onClick={() => handleChange(rowIndex, -11, index)}
          >
            x
          </button>
        </div>
      ))}

      {/* ===== ANSWER IMAGES ===== */}
      {imagesAnswer.map((filename, index) => (
        <div key={`a-${index}`} className={styles.imageWrapperSmall}>
          <img
            src={FileParserService.getImageUrl(filename)}
            alt={`answer-img-${index}`}
            style={{ width: 300, height: "auto" }}
            className={styles.image}
            loading="lazy"
          />
          <button
            className={styles.removeBtn}
            onClick={() => {
              if (answerIndex === undefined) return;
              handleChange(rowIndex, -7, {
                answerIndex,
                imageIndex: index,
              });
            }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
