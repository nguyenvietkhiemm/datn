"use client";

import styles from "./ListImageQuestion.module.css";
import { ChangeValue } from "@/domain/admin/file/file-parser/type";
import { ImagePreview } from "../ImagePreview/page";
type ListImageQuestionProps = {
  rowIndex: number;
  // images
  imagesQuestion?: string[];
  imagesAnswer?: string[];
  // chỉ dùng cho answer
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
  // không có ảnh nào thì không render
  if (
    (!imagesQuestion || imagesQuestion.length === 0) &&
    (!imagesAnswer || imagesAnswer.length === 0)
  ) {
    return null;
  }
  

  return (
    <div className={styles.previewWrap}>
      {/* ===== QUESTION IMAGES ===== */}
      {imagesQuestion.map((src, index) => (
        <div key={`q-${index}`} className={styles.imageWrapperSmall}>
          <ImagePreview filename={src}  width={50}/>
          <button
            className={styles.removeBtn}
            onClick={() =>
              handleChange(rowIndex, -11, index)
            }
          >
            x
          </button>
        </div>
      ))}

      {/* ===== ANSWER IMAGES ===== */}
      {imagesAnswer.map((src, index) => (
        <div key={`a-${index}`} className={styles.imageWrapperSmall}>
           <ImagePreview filename={src} width={50}/>
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
