import { Button } from "@/component/ui/button/Button";
import type { AnswerForm } from "@/domain/admin/questions/type";
import styles from "./MultipleChoiceAnswers.module.css";

type Props = {
  answers: AnswerForm[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerForm[]>>;
  answerImages: (File | string)[];
  setAnswerImages: React.Dispatch<React.SetStateAction<File[] | string[]>>
};

export default function MultipleChoiceAnswers({ answers,
  setAnswers,
  answerImages,
  setAnswerImages
}: Props) {
  const updateContent = (index: number, value: string) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], answer_content: value };
      return copy;
    });
  };

  const toggleCorrect = (index: number) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        is_correct: !copy[index].is_correct,
      };
      return copy;
    });
  };

  const addAnswer = () => {
    setAnswers(prev => [...prev, { answer_content: "", is_correct: false }]);
  };

  const removeAnswer = (index: number) => {
    setAnswers(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Câu trả lời</label>

      {answers.map((ans, index) => (
        <div key={index} className={styles.answerBlock}>
          <div>
            <input
              className={styles.input}
              value={ans.answer_content}
              onChange={(e) => updateContent(index, e.target.value)}
              placeholder={`Đáp án ${index + 1}`}
            />
            <input
              type="radio"
              checked={ans.is_correct}
              onChange={() => toggleCorrect(index)}
            />
            Đúng
            {answers.length > 4
              &&
              <button onClick={() => removeAnswer(index)}>✕</button>
            }
          </div>
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

      <Button variant="secondary" onClick={addAnswer}>
        + Thêm đáp án
      </Button>
    </div>
  );
}
