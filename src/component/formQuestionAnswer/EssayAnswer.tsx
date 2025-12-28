import { AnswerForm } from "@/domain/admin/questions/type";
import styles from "./EssayAnswer.module.css"

type EssayAnswerProps = {
  answers: AnswerForm[];
  answerImages: (File | string)[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerForm[]>>;
  setAnswerImages: React.Dispatch<React.SetStateAction<File[] | string[]>>
};

export default function EssayAnswer({ answers,
  setAnswers,
  answerImages,
  setAnswerImages
}: EssayAnswerProps) {
  return (
    <div>
      <label style={{ fontWeight: 500 }}>Đáp án tự luận (tham khảo)</label>
      <textarea
        rows={4}
        placeholder="Nhập đáp án mẫu hoặc hướng dẫn chấm..."
        value={answers[0]?.answer_content || ""}
        onChange={(e) =>
          setAnswers([
            { answer_content: e.target.value, is_correct: true },
          ])
        }
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
        }}
      />
      <div className={styles.uploadImages}>
        <label className={styles.label}>Hình ảnh câu hỏi</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            setAnswerImages(Array.from(e.target.files));
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
  );
}
